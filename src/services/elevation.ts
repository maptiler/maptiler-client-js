import { LineString, MultiLineString, Position } from "geojson";

import { callFetch } from "../callFetch";
import { config } from "../config";
import { defaults } from "../defaults";
import { ServiceError } from "./ServiceError";

const BATCH_SIZE = 50;
const WARN_SIZE = 1000;

export type ElevationAtOptions = {
  /**
   * Custom MapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;
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

function encodePositions(positions: Position[]): string {
  return positions.map((pos) => pos.join(",")).join(";");
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

  const endpoint = new URL(
    `elevation/${encodePositions([position])}.json`,
    defaults.maptilerApiURL,
  );
  endpoint.searchParams.set("key", apiKey);

  const resp = await callFetch(endpoint.toString());
  if (!resp.ok) {
    throw new ServiceError(resp, customMessages[resp.status] ?? "");
  }

  const result = await resp.json();

  return result[0];
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
  if (positions.length > WARN_SIZE) {
    console.warn(
      "Computing elevation for complex geometries is discouraged - simplify the geometry before proceeding",
    );
  }

  const apiKey = options.apiKey ?? config.apiKey;

  const parts = Math.ceil(positions.length / BATCH_SIZE);
  const respPromises = new Array<Promise<Response>>(parts);
  for (let part = 0; part < parts; part++) {
    const startPos = part * BATCH_SIZE;
    const positionsBatch = positions.slice(startPos, startPos + BATCH_SIZE);
    const endpoint = new URL(
      `elevation/${encodePositions(positionsBatch)}.json`,
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
