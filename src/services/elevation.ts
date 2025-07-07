import { LineString, MultiLineString, Position } from "geojson";

import { callFetch } from "../callFetch";
import { config } from "../config";
import { defaults } from "../defaults";
import { ServiceError } from "./ServiceError";
import { math } from "./math";
import {
  TileJSON,
  canParsePixelData,
  getBufferToPixelDataParser,
  getTileCache,
} from "../tiledecoding";

const TERRAIN_TILESET = "terrain-rgb-v2";
const API_BATCH_SIZE = 50;
const API_WARN_SIZE = 1000;

let terrainTileJson: TileJSON = null;

export type ElevationAtOptions = {
  /**
   * Custom MapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;

  /**
   * Zoom level to use for the terrain tileset in `client` mode.
   * If not provided, the highest zoom level will be used.
   */
  zoom?: number;

  /**
   * If set to `client`, the elevation will be computed from the terrain tiles on the client side.
   * If set to `server`, the elevation will be obtained from the MapTiler Elevation API.
   * Defaults to `server` for `at`, `batch`, and `client` for `fromLineString`, `fromMultiLineString` (in browser envs).
   */
  computeOn?: "client" | "server";
};

/**
 * Options for batch elevation lookup
 */
export type ElevationBatchOptions = ElevationAtOptions & {
  /**
   * If provided, a median kernel of the given size will smooth the elevation
   * to reduce very small local variations
   */
  smoothingKernelSize?: number;
};

const customMessages = {
  403: "Key is missing, invalid or restricted",
};

async function computeOnServer(
  positions: Position[],
  apiKey: string,
): Promise<Position[]> {
  if (positions.length > API_WARN_SIZE) {
    console.warn(
      "Computing elevation for complex geometries is discouraged - simplify the geometry before proceeding",
    );
  }

  const parts = Math.ceil(positions.length / API_BATCH_SIZE);
  const respPromises = new Array<Promise<Response>>(parts);
  for (let part = 0; part < parts; part++) {
    const startPos = part * API_BATCH_SIZE;
    const batch = positions.slice(startPos, startPos + API_BATCH_SIZE);
    const batchEncoded = batch.map((pos) => pos.join(",")).join(";");
    const endpoint = new URL(
      `elevation/${batchEncoded}.json`,
      defaults.maptilerApiURL,
    );
    endpoint.searchParams.set("key", apiKey);
    respPromises[part] = callFetch(endpoint.toString());
  }

  let elevatedPositions: Position[];
  try {
    const resps = await Promise.all(respPromises);
    const jsons = await Promise.all(
      resps.map((resp) => {
        if (!resp.ok) throw new Error(`HTTP response ${resp.status}`);
        return resp.json();
      }),
    );
    elevatedPositions = jsons.flat();
  } catch {
    throw new Error("Some segments could not be fetched.");
  }
  return elevatedPositions;
}

async function computeOnClient(
  positions: Position[],
  apiKey: string,
  zoom?: number,
): Promise<Position[]> {
  // Fetch terrain TileJSON
  if (!terrainTileJson) {
    const endpoint = new URL(
      `tiles/${TERRAIN_TILESET}/tiles.json`,
      defaults.maptilerApiURL,
    );
    endpoint.searchParams.set("key", apiKey);
    const urlWithParams = endpoint.toString();
    const res = await callFetch(urlWithParams);
    if (res.ok) {
      terrainTileJson = (await res.json()) as TileJSON;
    } else {
      throw new ServiceError(res, customMessages[res.status] ?? "");
    }
  }

  // Better throw about not bein able to parse tiles before fetching them
  const tileParser = getBufferToPixelDataParser();
  const tileURLSchema = terrainTileJson.tiles[0];
  const cache = getTileCache();

  const maxZoom = terrainTileJson.maxzoom;
  let usedZoom = ~~(zoom ?? maxZoom);
  if (usedZoom > maxZoom || usedZoom < 0) {
    usedZoom = maxZoom;
  }
  const tileIndicesFloats = positions.map((position) =>
    math.wgs84ToTileIndex(position, usedZoom, false),
  );
  const tileIndicesInteger = tileIndicesFloats.map((index) => [
    ~~index[0],
    ~~index[1],
  ]);
  const tileIDs = tileIndicesInteger.map(
    (index) =>
      `terrain_${usedZoom.toString()}_${index[0].toString()}_${index[1].toString()}`,
  );

  // unique tiles to fetch (excluding those already in cache and the doublons)
  const uniqueTilesToFetch = Array.from(
    new Set(tileIDs.filter((tileID) => !cache.has(tileID))),
  ).map((tileID) => tileID.split("_").slice(1));
  const tileURLs = uniqueTilesToFetch.map((zxy) =>
    tileURLSchema
      .replace("{x}", zxy[1].toString())
      .replace("{y}", zxy[2].toString())
      .replace("{z}", zxy[0].toString()),
  );
  const promisesFetchTiles = tileURLs.map((url) => callFetch(url));
  const resTiles = await Promise.allSettled(promisesFetchTiles);
  const fulfilledRes = resTiles
    .map((el: PromiseSettledResult<Response>) =>
      el.status === "fulfilled" ? el.value : null,
    )
    .filter((res) => res);
  const fulfilledRButNotOkRes = fulfilledRes.filter((res) => !res.ok);

  if (fulfilledRes.length !== promisesFetchTiles.length) {
    throw new Error("Some tiles could not be fetched.");
  }

  if (fulfilledRButNotOkRes.length) {
    throw new ServiceError(
      fulfilledRButNotOkRes[0],
      customMessages[fulfilledRButNotOkRes[0].status] ?? "",
    );
  }

  const tileArrayBuffers = await Promise.all(
    fulfilledRes.map((res) => res.arrayBuffer()),
  );

  // It is possible that the tile is missing
  if (!tileArrayBuffers.every((buff) => buff.byteLength > 0)) {
    throw new Error("Some tiles are not available.");
  }

  const tilePixelDatas = await Promise.all(
    tileArrayBuffers.map((buff) => tileParser(buff)),
  );

  // Adding to cache
  tilePixelDatas.forEach((tilePixelData, i) => {
    const zxy = uniqueTilesToFetch[i];
    const tileID = `terrain_${zxy[0].toString()}_${zxy[1].toString()}_${zxy[2].toString()}`;
    cache.set(tileID, tilePixelData);
  });

  const elevatedPositions = positions.map((position, i) => {
    const tileID = tileIDs[i];
    const tileIndexFloat = tileIndicesFloats[i];
    const tilePixelData = cache.get(tileID);

    // const pixelX = ~~(tilePixelData.width * (tileIndexFloat[0] % 1));
    // const pixelY = ~~(tilePixelData.height * (tileIndexFloat[1] % 1));

    const pixelX = Math.min(
      Math.round(tilePixelData.width * (tileIndexFloat[0] % 1)),
      tilePixelData.width - 1,
    );
    const pixelY = Math.min(
      Math.round(tilePixelData.height * (tileIndexFloat[1] % 1)),
      tilePixelData.height - 1,
    );

    const pixelDataIndex =
      (pixelY * tilePixelData.width + pixelX) * tilePixelData.components;
    const R = tilePixelData.pixels[pixelDataIndex];
    const G = tilePixelData.pixels[pixelDataIndex + 1];
    const B = tilePixelData.pixels[pixelDataIndex + 2];
    const elevation = -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;

    return [position[0], position[1], ~~(elevation * 1000) / 1000];
  });

  return elevatedPositions;
}

/**
 * Get the elevation at a given position.
 * The returned position is of form [longitude, latitude, altitude]
 */
async function at(
  /**
   * Wgs84 position as [longitude, latitude]
   */
  position: Position,
  /**
   * Options
   */
  options: ElevationAtOptions = {},
): Promise<Position> {
  const elevatedPositions = await batch([position], options);
  return elevatedPositions[0];
}

/**
 * Perform a batch elevation request
 */
async function batch(
  /**
   * Wgs84 positions as [[lng0, lat0], [lng1, lat1], [lng2, lat2], ...]
   */
  positions: Position[],
  /**
   * Options
   */
  options: ElevationBatchOptions = {},
): Promise<Position[]> {
  if (positions.length === 0) return [];

  const apiKey = options.apiKey ?? config.apiKey;

  const elevatedPositions =
    options.computeOn === "client"
      ? await computeOnClient(positions, apiKey, options.zoom)
      : await computeOnServer(positions, apiKey);

  // Smoothing
  if (options.smoothingKernelSize) {
    // make sure the kernel is of an odd size
    const kernelSize = ~~(options.smoothingKernelSize / 2) * 2 + 1;
    const elevations: number[] = elevatedPositions.map((pos) => pos[2]);
    const kernelSpan = ~~(kernelSize / 2);

    for (let i = kernelSpan; i < elevations.length - kernelSpan - 1; i += 1) {
      let sum = 0;
      for (let j = 0; j < kernelSize; j += 1) {
        const elev = elevations[i - kernelSpan + j];
        sum += elev;
      }
      sum /= kernelSize;
      elevatedPositions[i][2] = sum;
    }
  }

  return elevatedPositions;
}

/**
 * Creates a clone of a GeoJSON LineString (deep copy with structuredClone) that contains the computed elevation
 * as the third element of each position array ([lng, lat, alt])
 */
async function fromLineString(
  /**
   * A GeoJSON LineStriung feature
   */
  ls: LineString,
  /**
   * Options
   */
  options: ElevationBatchOptions = {},
): Promise<LineString> {
  if (ls.type !== "LineString") {
    throw new Error("The provided object is not a GeoJSON LineString");
  }

  options.computeOn ??= canParsePixelData() ? "client" : "server";
  const clone = structuredClone(ls) as LineString;
  const elevatedPositions = await batch(clone.coordinates, options);
  clone.coordinates = elevatedPositions;

  return clone;
}

/**
 * Creates a clone of a MultiLineString (deep copy with structuredClone) that contains the computed elevation
 * as the third element of each position array ([lng, lat, alt])
 */
async function fromMultiLineString(
  /**
   * A GeoJSON LineStriung feature
   */
  ls: MultiLineString,
  /**
   * Options
   */
  options: ElevationBatchOptions = {},
): Promise<MultiLineString> {
  if (ls.type !== "MultiLineString") {
    throw new Error("The provided object is not a GeoJSON MultiLineString");
  }

  options.computeOn ??= canParsePixelData() ? "client" : "server";
  const clone = structuredClone(ls) as MultiLineString;
  const multiLengths = clone.coordinates.map((poss) => poss.length);

  // This is equivalent to a batch of batch, so we makes the multilinestring
  // a unique line string to reduce number of requests
  const flattenPositions = clone.coordinates.flat();
  const flattenPositionsElevated = await batch(flattenPositions, options);

  // And then chopping back into a multi line string
  const result: Position[][] = [];
  let index = 0;
  for (const length of multiLengths) {
    result.push(flattenPositionsElevated.slice(index, index + length));
    index += length;
  }

  clone.coordinates = result;
  return clone;
}

export const elevation = {
  at,
  batch,
  fromLineString,
  fromMultiLineString,
};
