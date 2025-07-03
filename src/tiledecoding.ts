import QuickLRU from "quick-lru";
import { config } from "./config";

/**
 * Informations about an image
 * @deprecated This type will be removed in the next major version
 */
export type PixelData = {
  /**
   * The array of pixels as RGBRGB or RGBARGBA in a row-major order
   */
  pixels: Uint8ClampedArray | Uint8Array;
  /**
   * Width of the image in number of pixels
   */
  width: number;
  /**
   * Height of the image in number of pixels
   */
  height: number;
  /**
   * Number of components per pixel (3 if image is RGB, 4 if image is RGBA)
   */
  components: number;
};

/**
 * Type for the function that decodes an image file ArrayBuffer into valid pixel data
 * @deprecated This type will be removed in the next major version
 */
export type BufferToPixelDataFunction = (ArrayBuffer) => Promise<PixelData>;

/**
 * Main properties necessary from a TileJSON
 * @deprecated This type will be removed in the next major version
 */
export type TileJSON = {
  scale: string;
  format: string;
  maxzoom: number;
  minzoom: number;
  profile: string;
  description: string;
  attribution: string;
  bounds: [number, number, number, number];
  center: [number, number, number];

  /**
   * TileJSON version
   */
  tilejson: string;
  name: string;
  crs: string;
  crs_wkt: string;
  extent: [number, number, number, number];
  tiles: string[];
};

// The LRU cache for storing tile PixelData
let tileCache = null;

/**
 * Singleton-like function to access the tile cache
 * @deprecated This function will be removed in the next major version
 */
export function getTileCache(): QuickLRU<string, PixelData> {
  if (!tileCache) {
    tileCache = new QuickLRU({ maxSize: config.tileCacheSize });
  }
  return tileCache;
}

/**
 * Browser function to decode an image file buffer into valid pixel data
 * @deprecated This function will be removed in the next major version
 */
export async function bufferToPixelDataBrowser(
  buff: ArrayBuffer,
): Promise<PixelData> {
  const blob = new Blob([buff]);
  const imageBitmap = await createImageBitmap(blob);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  ctx.drawImage(imageBitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return {
    pixels: imageData.data,
    width: canvas.width,
    height: canvas.height,
    components: imageData.data.length / (canvas.width * canvas.height),
  };
}

/**
 * @deprecated This function will be removed in the next major version
 */
export function getBufferToPixelDataParser(): BufferToPixelDataFunction {
  if (config.bufferToPixelData) {
    return config.bufferToPixelData;
  }

  if (typeof window !== "undefined") {
    return bufferToPixelDataBrowser;
  }

  throw new Error(
    "An image file buffer to pixel data parser is necessary. Specify it in `config.bufferToPixelData`",
  );
}
