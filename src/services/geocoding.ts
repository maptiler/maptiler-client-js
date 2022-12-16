import { Feature, Position } from "geojson";
import { callFetch } from "../callFetch";
import { config } from "../config";
import { defaults } from "../defaults";
import { BBox, ArrayBBox, LngLat } from "../generalTypes";

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
  proximity?: LngLat;

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
  bbox: ArrayBBox;

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
  const endpoint = new URL(
    `geocoding/${encodeURIComponent(query)}.json`,
    defaults.maptilerApiURL
  );
  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);

  if ("bbox" in options) {
    const bbox = Array.isArray(options.bbox)
      ? {
          southWest: { lng: options.bbox[0], lat: options.bbox[1] },
          northEast: { lng: options.bbox[2], lat: options.bbox[3] },
        }
      : options.bbox;
    endpoint.searchParams.set(
      "bbox",
      [
        bbox.southWest.lng,
        bbox.southWest.lat,
        bbox.northEast.lng,
        bbox.northEast.lat,
      ].join(",")
    );
  }

  if ("proximity" in options) {
    endpoint.searchParams.set(
      "proximity",
      [options.proximity.lng, options.proximity.lat].join(",")
    );
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
 * @param lngLat
 * @param options
 * @returns
 */
async function reverse(
  lngLat: LngLat,
  options: ReverseGeocodingOptions = {}
): Promise<GeocodingSearchResult> {
  const endpoint = new URL(
    `geocoding/${lngLat.lng},${lngLat.lat}.json`,
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
