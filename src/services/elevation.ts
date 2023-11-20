import { LineString, MultiLineString, Position } from "geojson";

import { callFetch } from "../callFetch";
import { config } from "../config";
import { defaults } from "../defaults";
import { ServiceError } from "./ServiceError";
import { math } from "./math";
import {
  TileJSON,
  getBufferToPixelDataParser,
  getTileCache,
} from "../tiledecoding";

const terrainTileJsonURL = "tiles/terrain-rgb-v2/tiles.json";
let terrainTileJson: TileJSON = null;

export type ElevationAtOptions = {
  /**
   * Custom MapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;
};

const customMessages = {
  403: "Key is missing, invalid or restricted",
};

async function fetchTerrainTileJson(apiKey: string): Promise<TileJSON> {
  const endpoint = new URL(terrainTileJsonURL, defaults.maptilerApiURL);
  endpoint.searchParams.set("key", apiKey);
  const urlWithParams = endpoint.toString();

  const res = await callFetch(urlWithParams);
  if (res.ok) {
    terrainTileJson = (await res.json()) as TileJSON;
    return terrainTileJson;
  } else {
    if (!res.ok) {
      throw new ServiceError(res, customMessages[res.status] ?? "");
    }
  }
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
  const apiKey = options.apiKey ?? config.apiKey;

  if (!terrainTileJson) {
    await fetchTerrainTileJson(apiKey);
  }

  const maxZoom = terrainTileJson.maxzoom;
  const tileIndex = math.wgs84ToTileIndex(position, maxZoom, false);

  const tileX = ~~tileIndex[0];
  const tileY = ~~tileIndex[1];

  if (!terrainTileJson.tiles.length) {
    throw new Error("Terrain tileJSON tile list is empty.");
  }

  const tileID = `terrain_${maxZoom.toString()}_${tileX.toString()}_${tileY.toString()}`;
  let tilePixelData;

  const cache = getTileCache();

  if (cache.has(tileID)) {
    tilePixelData = cache.get(tileID);
  } else {
    const tileURL = terrainTileJson.tiles[0]
      .replace("{x}", tileX.toString())
      .replace("{y}", tileY.toString())
      .replace("{z}", maxZoom.toString());

    const tileRes = await callFetch(tileURL);

    if (!tileRes.ok) {
      throw new ServiceError(tileRes, customMessages[tileRes.status] ?? "");
    }

    const tileBuff = await tileRes.arrayBuffer();
    const tileParser = getBufferToPixelDataParser();
    tilePixelData = await tileParser(tileBuff);
    cache.set(tileID, tilePixelData);
  }

  const pixelX = ~~(tilePixelData.width * (tileIndex[0] % 1));
  const pixelY = ~~(tilePixelData.height * (tileIndex[1] % 1));
  const pixelDataIndex =
    (pixelY * tilePixelData.width + pixelX) * tilePixelData.components;
  const R = tilePixelData.pixels[pixelDataIndex];
  const G = tilePixelData.pixels[pixelDataIndex + 1];
  const B = tilePixelData.pixels[pixelDataIndex + 2];
  const elevation = -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;

  return [position[0], position[1], elevation];
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
  options: ElevationAtOptions = {},
): Promise<Position[]> {
  const apiKey = options.apiKey ?? config.apiKey;

  if (!terrainTileJson) {
    await fetchTerrainTileJson(apiKey);
  }

  // Better throw about not bein able to parse tiles before fetching them
  const tileParser = getBufferToPixelDataParser();
  const tileURLSchema = terrainTileJson.tiles[0];
  const cache = getTileCache();

  const maxZoom = terrainTileJson.maxzoom;
  const tileIndicesFloats = positions.map((position) => math.wgs84ToTileIndex(position, maxZoom, false));
  const tileIndicesInteger = tileIndicesFloats.map((index) => [~~index[0], ~~index[1]]);
  const tileIDs = tileIndicesInteger.map((index) => `terrain_${maxZoom.toString()}_${index[0].toString()}_${index[1].toString()}`);

  // unique tiles to fetch (excluding those already in cache and the doublons)
  const uniqueTilesToFetch = Array.from(new Set(tileIDs.filter((tileID) => !cache.has(tileID)))).map((tileID) => tileID.split("_").slice(1));
  const tileURLs = uniqueTilesToFetch.map((zxy) => tileURLSchema.replace("{x}", zxy[1].toString()).replace("{y}", zxy[2].toString()).replace("{z}", zxy[0].toString()))
  const promisesFetchTiles = tileURLs.map((url) => callFetch(url));
  const resTiles = await Promise.allSettled(promisesFetchTiles);
  const fulfilledRes = resTiles.map((el: PromiseSettledResult<Response>) => el.status === "fulfilled" ? el.value : null ).filter((res) => res);
  const fulfilledRButNotOkRes = fulfilledRes.filter((res) => !res.ok);

  if (fulfilledRes.length !== promisesFetchTiles.length) {
    throw new Error("Some tiles could not be fetched.");
  }

  if (fulfilledRButNotOkRes.length) {
    throw new ServiceError(fulfilledRButNotOkRes[0], customMessages[fulfilledRButNotOkRes[0].status] ?? "");
  }

  const tileArrayBuffers = await Promise.all(fulfilledRes.map((res) => res.arrayBuffer()));

  // It is possible that the tile is missing 
  if (!tileArrayBuffers.every((buff) => buff.byteLength > 0)) {
    throw new Error("Some tiles are not available.");
  }

  const tilePixelDatas = await Promise.all(tileArrayBuffers.map((buff) => tileParser(buff)));

  // Adding to cache
  tilePixelDatas.forEach((tilePixelData, i) => {
    const zxy = uniqueTilesToFetch[i];
    const tileID = `terrain_${zxy[0].toString()}_${zxy[1].toString()}_${zxy[2].toString()}`;
    cache.set(tileID, tilePixelData);
  });

  const elevations = positions.map((position, i) => {
    const tileID = tileIDs[i];
    const tileIndexFloat = tileIndicesFloats[i];
    const tilePixelData = cache.get(tileID);

    const pixelX = ~~(tilePixelData.width * (tileIndexFloat[0] % 1));
    const pixelY = ~~(tilePixelData.height * (tileIndexFloat[1] % 1));
    const pixelDataIndex =
      (pixelY * tilePixelData.width + pixelX) * tilePixelData.components;
    const R = tilePixelData.pixels[pixelDataIndex];
    const G = tilePixelData.pixels[pixelDataIndex + 1];
    const B = tilePixelData.pixels[pixelDataIndex + 2];
    const elevation = -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;

    return [
      position[0],
      position[1],
      (~~(elevation * 1000) / 1000),
    ]
  })
  
  return elevations;
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
  options: ElevationAtOptions = {}
): Promise<LineString> {

  if (ls.type !== "LineString") {
    throw new Error("The provided object is not a GeoJSON LineString");
  }

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
  options: ElevationAtOptions = {}
): Promise<MultiLineString> {

  if (ls.type !== "MultiLineString") {
    throw new Error("The provided object is not a GeoJSON MultiLineString");
  }

  const clone = structuredClone(ls) as MultiLineString;
  const multiLengths = clone.coordinates.map((poss) => poss.length);

  // This is equivalent to a batch of batch, so we makes the multilinestring a unique
  // line string to prevent batch to fetch multiple times the same tile
  const flattenPositions = clone.coordinates.flat();
  const flattenPositionsElevated = await batch(flattenPositions, options);
  
  // And then chopping back into a multi line string
  const result: Position[][] = [];
  let index = 0;
  for (let length of multiLengths) {
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
