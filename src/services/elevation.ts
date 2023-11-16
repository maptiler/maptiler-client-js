import { Position } from "geojson";
import QuickLRU from 'quick-lru';
import { callFetch } from "../callFetch";
import { config } from "../config";
import { defaults } from "../defaults";
import { ServiceError } from "./ServiceError";
import { math } from "./math";

const terrainTileJsonURL = "tiles/terrain-rgb-v2/tiles.json";
let terrainTileJson: TileJSON = null;

export type ElevationAtOptions = {
  /**
   * Custom MapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;
};

export type PixelData = {
  pixels: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  components: number,
}

export type TileJSON = {
  scale: string,
  format: string,
  maxzoom: number,
  minzoom: number,
  profile: string,
  description: string,
  attribution: string,
  bounds: [number, number, number, number],
  center: [number, number, number],

  /**
   * TileJSON version
   */
  tilejson: string,
  name: string,
  crs: string,
  crs_wkt: string,
  extent : [number, number, number, number],
  tiles: string[]
}


const customMessages = {
  403: "Key is missing, invalid or restricted",
};

let terrainTileCache = null;

function getTerrainTileCache(): QuickLRU<string, PixelData> {
  if (!terrainTileCache) {
    terrainTileCache = new QuickLRU({maxSize: config.cacheSize})
  }
  return terrainTileCache;
}


async function fetchTerrainTileJson(apiKey: string): Promise<TileJSON> {
  const endpoint = new URL(terrainTileJsonURL, defaults.maptilerApiURL);
  endpoint.searchParams.set("key", apiKey);
  const urlWithParams = endpoint.toString();

  const res = await callFetch(urlWithParams);
  if (res.ok) {
    terrainTileJson = await res.json() as TileJSON
    return terrainTileJson;
  }
}

async function fileBufferToPixelData(buff: ArrayBuffer): Promise<PixelData> {
  // Convert ArrayBuffer to Blob
  //  const blob = new Blob([buff], { type: 'image/png' });
  const blob = new Blob([buff]);
  const imageBitmap = await createImageBitmap(blob);

  // Draw the image bitmap on a canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  ctx.drawImage(imageBitmap, 0, 0);

  // Access pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return {
    pixels: imageData.data,
    width: canvas.width,
    height: canvas.height,
    components: imageData.data.length / (canvas.width * canvas.height),
  }
}

 
async function at(
  position: Position,
  options: ElevationAtOptions = {}
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

  const cache = getTerrainTileCache();

  if (cache.has(tileID)) {
    console.log("cached");
    tilePixelData = cache.get(tileID);
  } else {
    console.log("not cached");
    const tileURL = terrainTileJson.tiles[0]
      .replace("{x}", tileX.toString())
      .replace("{y}", tileY.toString())
      .replace("{z}", maxZoom.toString())
    
    const tileRes = await callFetch(tileURL);
    const tileBuff = await tileRes.arrayBuffer();
    tilePixelData = await fileBufferToPixelData(tileBuff);
    cache.set(tileID, tilePixelData);
  }

  const pixelX =  ~~(tilePixelData.width * (tileIndex[0] % 1));
  const pixelY =  ~~(tilePixelData.height * (tileIndex[1] % 1));
  const pixelDataIndex = (pixelY * tilePixelData.width + pixelX) * tilePixelData.components;
  const R = tilePixelData.pixels[pixelDataIndex];
  const G = tilePixelData.pixels[pixelDataIndex + 1];
  const B = tilePixelData.pixels[pixelDataIndex + 2];
  const elevation = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)

  return [position[0], position[1], elevation];
}


export const elevation = {
  at,
}