import type { BBox, Feature, Geometry, Position } from "geojson";
import { callFetch } from "../callFetch";
import { config } from "../config";
import { defaults } from "../defaults";

import {
  type LanguageInfo,
  getAutoLanguage,
  getLanguageInfoFromCode,
  isLanguageInfo,
  Language,
  getLanguageInfoFromFlag,
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
  language?: string | Array<string> | LanguageInfo | Array<LanguageInfo>;
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
     * Filter of feature types to return.
     * If not specified, feature of all available types except `poi` are returned (`types = ["poi"]`, `excludeTypes = true`).
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
      | "road"
      | "poi"
    )[];

    /**
     * Set to `true` to use all available feature types except those mentioned in `types`. Default value is `false` if `types` is specified.
     */
    excludeTypes?: boolean;
  };

export type GeocodingOptions = CommonForwardAndReverseGeocodingOptions & {
  /**
   * Only search for results in the specified area.
   */
  bbox?: BBox;

  /**
   * Prefer results close to a specific location.
   */
  proximity?: Position | "ip";

  /**
   * Limit search to specific country/countries specified as list of Alpha-2 ISO 3166-1 codes.
   */
  country?: string[];

  /**
   * Set to `false` to disable fuzzy (typo-tolerant) search. Default is `true`.
   */
  fuzzyMatch?: boolean;

  /**
   * Set to `true` to use autocomplete, `false` to disable it. Default is `true`.
   */
  autocomplete?: boolean;
};

export type ReverseGeocodingOptions = CommonForwardAndReverseGeocodingOptions;

export type ByIdGeocodingOptions = LanguageGeocodingOptions & {
  apiKey?: string;
};

export type Coordinates = Position;

type FeatureProperties = {
  /**
   * External reference of the feature used for debugging purposes
   */
  ref: string;

  /**
   * ISO 3166-1 alpha-2 country code of the feature
   */
  country_code: string;

  /**
   * (experimental) Kind of the feature
   */
  kind?:
    | "road"
    | "road_relation"
    | "admin_area"
    | "place"
    | "street"
    | "virtual_street";

  /**
   * (experimental) Value of place=* tag from OpenStreetMap feature if kind=place
   */
  "osm:place_type"?: string;

  /**
   * (experimental) Feature tags from OpenStreetMap. Only available for `poi` type.
   */
  "osm:tags"?: Record<string, string>;

  /**
   * Array of POI categories. Only available for `poi` type.
   */
  categories?: string[];

  /**
   * Wikidata identifier.
   */
  wikidata?: string;
};

type FeatureBase = {
  /**
   * Unique feature ID
   */
  id: string;

  /**
   * Localized feature name
   */
  text: string;

  /**
   * Query's primary ISO 639-1 language code
   */
  language?: string;

  /**
   * A string analogous to the `text` field that matches the query in the requested language.
   * This field is only returned when multiple languages are requested using the `language` parameter, and will be present for each requested language.
   */
  [text: `text_${string}`]: string;

  /**
   * A ISO 639-1 query's fallback language code.
   * This field is only returned when multiple languages are requested using the `language` parameter, and will be present for each requested language.
   */
  [language: `language_${string}`]: string;
};

export type FeatureHierarchy = FeatureProperties & FeatureBase;

export type GeocodingFeature = Feature<Geometry, FeatureProperties> &
  FeatureBase & {
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
     * A string analogous to the `place_name` field that matches the query in the requested language.
     * This field is only returned when multiple languages are requested using the `language` parameter, and will be present for each requested language.
     */
    [key: `place_name_${string}`]: string;

    /**
     * An array of feature types describing the feature.
     * Currently each feature has only single type but this may change in the future.
     */
    place_type: string[];

    /**
     * Localized type of the place name, matches `place_type` property
     */
    place_type_name: string[];

    /**
     * Feature hierarchy
     */
    context?: Array<FeatureHierarchy>;

    /**
     * Address number, if applicable
     */
    address?: string;

    /**
     * Indicates how well the returned feature matches the user's query on a scale from 0 to 1.
     * 0 means the result does not match the query text at all, while 1 means the result fully matches the query text.
     * You can use the relevance property to remove results that don't fully match the query.
     */
    relevance: number;

    /**
     * A string analogous to the `text` field that more closely matches the query than results in the specified language.
     * For example, querying _Praha, Czechia_ with language set to English (`en`) might return a feature with the `text` _Prague_ and the `matching_text` _Praha_.
     */
    matching_text?: string;

    /**
     * A string analogous to the `place_name` field that more closely matches the query than results in the specified language.
     * For example, querying _Praha, Czechia_ with language set to English (`en`) might return a feature with the `place_name` _Prague, Czechia_ and a `matching_place_name` of _Praha, Czechia_.
     */
    matching_place_name?: string;
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
  options: LanguageGeocodingOptions,
) {
  const { language } = options;

  if (language === undefined) {
    return;
  }

  // Making it an array of language codes
  const languageCodes = (Array.isArray(language) ? language : [language])
    .map((elem) => toValidGeocodingLanguageCode(elem))
    .filter((elem) => elem); // removing the nulls

  const languages = Array.from(new Set(languageCodes)).join(",");

  searchParams.set("language", languages);
}

function toValidGeocodingLanguageCode(
  lang: string | LanguageInfo,
): string | null {
  let langInfo: LanguageInfo | null = null;

  if (lang === Language.AUTO.flag) {
    // equal to the string "auto"
    langInfo = getAutoLanguage();
  } else if (typeof lang === "string") {
    langInfo = getLanguageInfoFromCode(lang);
  } else if (isLanguageInfo(lang)) {
    langInfo =
      lang.flag === Language.AUTO.flag
        ? getAutoLanguage()
        : getLanguageInfoFromFlag(lang.flag);
  }

  if (!langInfo) return null;
  if (langInfo.geocoding) return langInfo.code;
  return null;
}

function addCommonForwardAndReverseGeocodingOptions(
  searchParams: URLSearchParams,
  options: CommonForwardAndReverseGeocodingOptions,
) {
  const { apiKey, limit, types, excludeTypes } = options;

  searchParams.set("key", apiKey ?? config.apiKey);

  if (limit !== undefined) {
    searchParams.set("limit", String(limit));
  }

  if (types !== undefined) {
    searchParams.set("types", types.join(","));
  }

  if (excludeTypes !== undefined) {
    searchParams.set("excludeTypes", String(excludeTypes));
  }

  addLanguageGeocodingOptions(searchParams, options);
}

function addForwardGeocodingOptions(
  searchParams: URLSearchParams,
  options: GeocodingOptions,
) {
  addCommonForwardAndReverseGeocodingOptions(searchParams, options);

  const { bbox, proximity, country, fuzzyMatch, autocomplete } = options;

  if (bbox !== undefined) {
    searchParams.set("bbox", bbox.join(","));
  }

  if (proximity !== undefined) {
    searchParams.set(
      "proximity",
      proximity === "ip" ? proximity : proximity.join(","),
    );
  }

  if (country !== undefined) {
    searchParams.set("country", country.join(","));
  }

  if (fuzzyMatch !== undefined) {
    searchParams.set("fuzzyMatch", fuzzyMatch ? "true" : "false");
  }

  if (autocomplete !== undefined) {
    searchParams.set("autocomplete", autocomplete ? "true" : "false");
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
  options: GeocodingOptions = {},
): Promise<GeocodingSearchResult> {
  if (typeof query !== "string" || query.trim().length === 0) {
    throw new Error("The query must be a non-empty string");
  }

  const endpoint = new URL(
    `geocoding/${encodeURIComponent(query)}.json`,
    defaults.maptilerApiURL,
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
  options: ReverseGeocodingOptions = {},
): Promise<GeocodingSearchResult> {
  if (!Array.isArray(position) || position.length < 2) {
    throw new Error("The position must be an array of form [lng, lat].");
  }

  const endpoint = new URL(
    `geocoding/${position[0]},${position[1]}.json`,
    defaults.maptilerApiURL,
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
  options: ByIdGeocodingOptions = {},
): Promise<GeocodingSearchResult> {
  const endpoint = new URL(`geocoding/${id}.json`, defaults.maptilerApiURL);
  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);

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
  options: GeocodingOptions = {},
): Promise<GeocodingSearchResult[]> {
  if (!queries.length) {
    return [];
  }

  const joinedQuery = queries
    .map((query) => encodeURIComponent(query))
    .join(";");

  const endpoint = new URL(
    `geocoding/${joinedQuery}.json`,
    defaults.maptilerApiURL,
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
};

export { geocoding };
