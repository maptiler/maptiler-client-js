import { BBox, Feature, Position } from "geojson";
import { callFetch } from "../callFetch";
import { config } from "../config";
import { defaults } from "../defaults";

import {
  getAutoLanguageGeocoding,
  LanguageGeocoding,
  LanguageGeocodingString,
} from "../language";
import { ServiceError } from "./ServiceError";

const customMessages = {
  400: "Query too long / Invalid parameters",
  403: "Key is missing, invalid or restricted",
};

export type LanguageGeocodingOptions = {
  /**
   * Prefer results in specific language. It’s possible to specify multiple values.
   */
  language?: LanguageGeocodingString | Array<LanguageGeocodingString>;
};

export type CommonForwardAndReverseGeocodingOptions =
  LanguageGeocodingOptions & {
    /**
     * Custom MapTiler Cloud API key to use instead of the one in global `config`
     */
    apiKey?: string;

    /**
     * Maximum number of results to show. Must be between 1 and 10. Default is 5 for forward and 1 for reverse geocoding.
     */
    limit?: number;

    /**
     * Filter of feature types to return. If not specified, all available feature types are returned.
     */
    types?: (
      | "country"
      | "region"
      | "subregion"
      | "county"
      | "joint_municipality"
      | "joint_submunicipality"
      | "municipality"
      | "municipal_district"
      | "locality"
      | "neighbourhood"
      | "place"
      | "postal_code"
      | "address"
    )[];
  };

export type GeocodingOptions = CommonForwardAndReverseGeocodingOptions & {
  /**
   * Only search for results in the specified area.
   */
  bbox?: BBox;

  /**
   * Prefer results close to a specific location.
   */
  proximity?: Position;

  /**
   * Limit search to specific country/countries specified as list of Alpha-2 ISO 3166-1 codes.
   */
  country?: string[];

  /**
   * Set to `false` to disable fuzzy (typo-tolerant) search. Default is `true`.
   */
  fuzzyMatch?: boolean;

  /**
   * Set to `true` to use autocomplete, `false` to disable it.
   * Default (`undefined`) is to combine autocomplete with non-autocomplete results.
   */
  autocomplete?: boolean;
};

export type ReverseGeocodingOptions = CommonForwardAndReverseGeocodingOptions;

export type ByIdGeocodingOptions = LanguageGeocodingOptions;

export type Coordinates = Position;

export type FeatureHierarchy = {
  /**
   * Unique feature ID
   */
  id: string;

  /**
   * Localized feature name
   */
  text: string;
};

export type GeocodingFeature = Feature & {
  /**
   * Bounding box of the original feature as [w, s, e, n] array
   */
  bbox: BBox;

  /**
   * A [lon, lat] array of the original feature centeroid
   */
  center: Coordinates;

  /**
   * Formatted (including the hierarchy) and localized feature full name
   */
  place_name: string;

  /**
   * Localized feature name
   */
  text: string;

  /**
   * Feature hierarchy
   */
  context?: Array<FeatureHierarchy>;

  /**
   * Address number, if applicable
   */
  address?: string;
};

export type GeocodingSearchResult = {
  type: "FeatureCollection";

  /**
   * Array of features found
   */
  features: Array<GeocodingFeature>;

  /**
   * Tokenized search query
   */
  query: Array<string>;

  /**
   * Attribution of the result
   */
  attribution: string;
};

function addLanguageGeocodingOptions(
  searchParams: URLSearchParams,
  options: LanguageGeocodingOptions
) {
  if (options.language == undefined) {
    return;
  }

  const languages = Array.from(
    new Set(
      (Array.isArray(options.language)
        ? options.language
        : [options.language]
      ).map((lang) =>
        lang === LanguageGeocoding.AUTO ? getAutoLanguageGeocoding() : lang
      )
    )
  ).join(",");

  searchParams.set("language", languages);
}

function addCommonForwardAndReverseGeocodingOptions(
  searchParams: URLSearchParams,
  options: CommonForwardAndReverseGeocodingOptions
) {
  searchParams.set("key", options.apiKey ?? config.apiKey);

  if (options.limit != undefined) {
    searchParams.set("limit", String(options.limit));
  }

  if (options.types != undefined) {
    searchParams.set("types", options.types.join(","));
  }

  addLanguageGeocodingOptions(searchParams, options);
}

function addForwardGeocodingOptions(
  searchParams: URLSearchParams,
  options: GeocodingOptions
) {
  addCommonForwardAndReverseGeocodingOptions(searchParams, options);

  if (options.bbox != undefined) {
    searchParams.set("bbox", options.bbox.join(","));
  }

  if (options.proximity != undefined) {
    searchParams.set("proximity", options.proximity.join(","));
  }

  if (options.country != undefined) {
    searchParams.set("country", options.country.join(","));
  }

  if (options.fuzzyMatch != undefined) {
    searchParams.set("fuzzyMatch", options.fuzzyMatch ? "true" : "false");
  }

  if (options.autocomplete != undefined) {
    searchParams.set("autocomplete", options.autocomplete ? "true" : "false");
  }
}

/**
 * Performs a forward geocoding query to MapTiler API.
 * Providing a human readable place name (of a city, country, street, etc.), the function returns
 * a list of candidate locations including longitude and latitude.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/geocoding/#search-by-name-forward
 * @param query
 * @param options
 * @returns
 */
async function forward(
  query: string,
  options: GeocodingOptions = {}
): Promise<GeocodingSearchResult> {
  if (typeof query !== "string" || query.trim().length === 0) {
    throw new Error("The query must be a non-empty string");
  }

  const endpoint = new URL(
    `geocoding/${encodeURIComponent(query)}.json`,
    defaults.maptilerApiURL
  );

  const { searchParams } = endpoint;

  addForwardGeocodingOptions(searchParams, options);

  const urlWithParams = endpoint.toString();

  const res = await callFetch(urlWithParams);

  if (!res.ok) {
    throw new ServiceError(res, customMessages[res.status] ?? "");
  }

  const obj: GeocodingSearchResult = await res.json();

  return obj;
}

/**
 * Perform a reverse geocoding query to MapTiler API.
 * Providing a longitude and latitude, this function returns a set of human readable information about this place (country, city, street, etc.)
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/geocoding/#search-by-coordinates-reverse
 * @param position
 * @param options
 * @returns
 */
async function reverse(
  position: Position,
  options: ReverseGeocodingOptions = {}
): Promise<GeocodingSearchResult> {
  if (!Array.isArray(position) || position.length < 2) {
    throw new Error("The position must be an array of form [lng, lat].");
  }

  const endpoint = new URL(
    `geocoding/${position[0]},${position[1]}.json`,
    defaults.maptilerApiURL
  );

  addCommonForwardAndReverseGeocodingOptions(endpoint.searchParams, options);

  const urlWithParams = endpoint.toString();

  const res = await callFetch(urlWithParams);

  if (!res.ok) {
    throw new ServiceError(res, customMessages[res.status] ?? "");
  }

  const obj: GeocodingSearchResult = await res.json();

  return obj;
}

/**
 * Perform a geocoding query to MapTiler API to obtain fature by its ID.
 * Providing a feature ID, this function returns a feature which includes its full geometry.
 * Note that the feature ID is not stable and it changes when the database is re-indexed.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/geocoding/#search-by-feature-id
 * @param id
 * @param options
 * @returns
 */
async function byId(
  id: string,
  options: ByIdGeocodingOptions = {}
): Promise<GeocodingSearchResult> {
  const endpoint = new URL(`geocoding/${id}.json`, defaults.maptilerApiURL);

  addLanguageGeocodingOptions(endpoint.searchParams, options);

  const urlWithParams = endpoint.toString();

  const res = await callFetch(urlWithParams);

  if (!res.ok) {
    throw new ServiceError(res, customMessages[res.status] ?? "");
  }

  const obj: GeocodingSearchResult = await res.json();

  return obj;
}

/**
 * Perform a batch geocoding query to MapTiler API.
 * Provide multiple queries in the array. Each query can be forward, reverse or by feature ID.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/geocoding/#batch-geocoding
 * @param queries
 * @param options
 * @returns
 */
async function batch(
  queries: string[],
  options: GeocodingOptions = {}
): Promise<GeocodingSearchResult[]> {
  if (!queries.length) {
    return [];
  }

  const joinedQuery = queries
    .map((query) => encodeURIComponent(query))
    .join(";");

  const endpoint = new URL(
    `geocoding/${joinedQuery}.json`,
    defaults.maptilerApiURL
  );

  const { searchParams } = endpoint;

  addForwardGeocodingOptions(searchParams, options);

  const urlWithParams = endpoint.toString();

  const res = await callFetch(urlWithParams);

  if (!res.ok) {
    throw new ServiceError(res, customMessages[res.status] ?? "");
  }

  const obj = await res.json();

  return queries.length === 1 ? [obj] : obj;
}

/**
 * The **geocoding** namespace contains asynchronous functions to call the [MapTiler Geocoding API](https://docs.maptiler.com/cloud/api/geocoding/).
 * The **Geocoding API** provides ways to get geographic coordinates from a human-readable search query of a place (forward geocoding)
 * and to get the location details (country, city, street, etc.) from a geographic coordinate (reverse geocoding);
 */
const geocoding = {
  forward,
  reverse,
  byId,
  batch,
  language: LanguageGeocoding,
};

export { geocoding };
