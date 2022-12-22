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

export type GeocodingOptions = {
  /**
   * Custom mapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;

  /**
   * Only search for results in the specified area.
   */
  bbox?: BBox;

  /**
   * Prefer results close to a specific location.
   */
  proximity?: Position;

  /**
   * Prefer results in specific language. It’s possible to specify multiple values.
   */
  language?: LanguageGeocodingString | Array<LanguageGeocodingString>;
};

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
  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);

  if ("bbox" in options) {
    endpoint.searchParams.set("bbox", options.bbox.join(","));
  }

  if ("proximity" in options) {
    endpoint.searchParams.set("proximity", options.proximity.join(","));
  }

  if ("language" in options) {
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

    endpoint.searchParams.set("language", languages);
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
  return obj as GeocodingSearchResult;
}

export type ReverseGeocodingOptions = {
  /**
   * Custom mapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;

  /**
   * Prefer results in specific language. It’s possible to specify multiple values.
   */
  language?: LanguageGeocodingString | Array<LanguageGeocodingString>;
};

/**
 * Perform a reverse geocoding query to MapTiler API.
 * Providing a longitude and latitude, this function returns a set of human readable information abou this place (country, city, street, etc.)
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
  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);

  if ("language" in options) {
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

    endpoint.searchParams.set("language", languages);
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
  return obj as GeocodingSearchResult;
}

/**
 * The **geocoding** namespace contains asynchronous functions to call the [MapTiler Geocoding API](https://docs.maptiler.com/cloud/api/geocoding/).
 * The **Geocoding API** provides ways to get geographic coordinates from a human-readable search query of a place (forward geocoding)
 * and to get the location details (country, city, street, etc.) from a geographic coordinate (reverse geocoding);
 */
const geocoding = {
  forward,
  reverse,
  language: LanguageGeocoding,
};

export { geocoding };
