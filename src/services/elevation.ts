import { Position } from "geojson";

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

export const elevation = {
  at,
};
