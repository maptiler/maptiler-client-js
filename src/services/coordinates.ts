import { BBox, Position } from "geojson";
import { callFetch } from "../callFetch";
import { config } from "../config";
import { defaults } from "../defaults";
import { ServiceError } from "./ServiceError";

const customMessages = {
  403: "Key is missing, invalid or restricted",
};

export type CoordinatesSearchOptions = {
  /**
   * Custom MapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;

  /**
   * Maximum number of results returned (default: 10)
   */
  limit?: number;

  /**
   *  Show detailed transformations for each CRS (default: false)
   */
  transformations?: boolean;

  /**
   * Show exports in WKT and Proj4 notations (default: false)
   */
  exports?: boolean;
};

export type CoordinateId = {
  authority: string;
  code: BigInteger;
};

export type CoordinateExport = {
  proj4: string;
  wkt: string;
};

export type CoordinateGrid = {
  path: string;
};

export type CoordinateTransformation = {
  id: CoordinateId;
  name: string;
  reversible: boolean;
  usable: boolean;
  deprecated: boolean;
  grids: Array<CoordinateGrid>;
  accuracy?: number;
  area?: string;
  bbox?: BBox;
  target_crs?: CoordinateId;
  unit?: string;
};

export type CoordinateSearch = {
  id: CoordinateId;

  name: string;

  kind: string;

  deprecated: boolean;

  transformations?: Array<CoordinateTransformation | number>;

  accuracy?: number;

  unit?: string;

  area?: string;

  /**
   * Bounding box of the resource in [min_lon, min_lat, max_lon, max_lat] order.
   */
  bbox?: BBox;

  /**
   * Most suitable transformation for this CRS.
   */
  default_transformation?: any;

  exports: CoordinateExport;
};

export type CoordinateSearchResult = {
  /**
   * The coordinate search results
   */
  results: Array<CoordinateSearch>;

  /**
   * The number of results
   */
  total: number;
};

/**
 * Search information about coordinate systems using MapTiler API.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/coordinates/#search-coordinate-systems
 * @param query Can be any kind of CRS by name or code
 * @param options
 * @returns
 */
async function search(
  query: string,
  options: CoordinatesSearchOptions = {}
): Promise<CoordinateSearchResult> {
  if (typeof query !== "string" || query.trim().length === 0) {
    throw new Error("The query must be a non-empty string");
  }

  const endpoint = new URL(
    `coordinates/search/${query}.json`,
    defaults.maptilerApiURL
  );
  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);

  if ("limit" in options) {
    endpoint.searchParams.set("limit", options.limit.toString());
  }

  if ("transformations" in options) {
    endpoint.searchParams.set(
      "transformations",
      options.transformations.toString()
    );
  }

  if ("exports" in options) {
    endpoint.searchParams.set("exports", options.exports.toString());
  }

  const urlWithParams = endpoint.toString();
  const res = await callFetch(urlWithParams);

  if (!res.ok) {
    throw new ServiceError(
      res,
      res.status in customMessages ? customMessages[res.status] : ""
    );
  }

  const obj = await res.json();
  return obj as CoordinateSearchResult;
}

export type XYZ = {
  x?: number;
  y?: number;
  z?: number;
};

export type CoordinateTransformResult = {
  results: Array<XYZ>;

  /**
   * Transformations are selected using given ops parameter.
   * If no parameter is given, auto strategy is used.
   * If given, it may try to use a listed transformation,
   * then fallback to towgs84 patching, and finally boundcrs.
   */
  transformer_selection_strategy: string;
};

/**
 * Options that can be provided when transforming a coordinate from one CRS to another.
 */
export type CoordinatesTransformOptions = {
  /**
   * Custom MapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;

  /**
   * Source coordinate reference system (default: 4326)
   */
  sourceCrs?: number;

  /**
   * Target coordinate reference system (default: 4326)
   */
  targetCrs?: number;

  /**
   * List of codes of operations
   */
  operations?: number | Array<number>;
};

/**
 * Transforms coordinates from a source reference system to a target reference system using MapTiler API.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/coordinates/#transform-coordinates
 * @param positions
 * @param options
 * @returns
 */
async function transform(
  positions: Position | Array<Position>,
  options: CoordinatesTransformOptions = {}
): Promise<CoordinateTransformResult> {
  const coordinatesStr = (Array.isArray(positions[0]) ? positions : [positions])
    .map((coord) => `${coord[0]},${coord[1]}`)
    .join(";");

  const endpoint = new URL(
    `coordinates/transform/${coordinatesStr}.json`,
    defaults.maptilerApiURL
  );
  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);

  if ("sourceCrs" in options) {
    endpoint.searchParams.set("s_srs", options.sourceCrs.toString());
  }

  if ("targetCrs" in options) {
    endpoint.searchParams.set("t_srs", options.targetCrs.toString());
  }

  if ("operations" in options) {
    endpoint.searchParams.set(
      "ops",
      (Array.isArray(options.operations)
        ? options.operations
        : [options.operations]
      ).join("|")
    );
  }

  const urlWithParams = endpoint.toString();
  const res = await callFetch(urlWithParams);

  if (!res.ok) {
    throw new ServiceError(
      res,
      res.status in customMessages ? customMessages[res.status] : ""
    );
  }

  const obj = await res.json();
  return obj as CoordinateTransformResult;
}

/**
 * The **coordinate** namespace contains asynchronous functions to call the [MapTiler Coordinate API](https://docs.maptiler.com/cloud/api/coordinates/).
 * The goal of the **Coordinate API* is query information about spatial coordinate reference system (CRS) as well as to transform coordinates from one CRS to another.
 */
const coordinates = {
  search,
  transform,
};

export { coordinates };
