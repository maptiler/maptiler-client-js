import { BBox } from "geojson";
import { callFetch } from "../callFetch";
import { config } from "../config";
import { defaults } from "../defaults";
import { ServiceError } from "./ServiceError";

const customMessages = {
  403: "Key is missing, invalid or restricted",
};

/**
 * Options that can be provided to get user data.
 */
export type GeolocationInfoOptions = {
  /**
   * Custom MapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;
};

export type GeolocationResult = {
  /**
   * Name of the country
   * Example: Switzerland
   */
  country?: string;

  /**
   * Two-letter code of the country ISO 3166-1 alpha-2 codes
   * Example: CH
   */
  country_code?: string;

  /**
   * Bounds of the country in WGS84 degrees [west, south, east, north].
   * Example: [5.95538,45.818852,10.490936,47.809357]
   */
  country_bounds?: BBox;

  /**
   * Official country languages in ISO 639-1 format. ISO 639-1 codes
   * Example: ["de","fr","it"]
   */
  country_languages?: Array<string>;

  /**
   * Name of the continent
   * Example: Europe
   */
  continent?: string;

  /**
   * Two-letter code of the continent
   * Example: EU
   */
  continent_code?: string;

  /**
   * Indicated whether the country is part of the European Union.
   */
  eu?: boolean;

  /**
   * Name of the city
   * Example: Zurich
   */
  city?: string;

  /**
   * Latitude of the location
   * Example: 47.36667
   */
  latitude?: number;

  /**
   * Longitude of the location
   * Example: 8.55
   */
  longitude?: number;

  /**
   * Postal code
   * Example: 8000
   */
  postal?: string;

  /**
   * If known, the ISO 3166-2 name for the first level region. ISO 3166-2 codes
   * Example: Zurich
   */
  region?: string;

  /**
   * If known, the ISO 3166-2 code for the first level region. ISO 3166-2 codes
   * Example: ZH
   */
  region_code?: string;

  /**
   * Name of the timezone
   * Example: Europe/Zurich
   */
  timezone?: string;
};

/**
 * Looks up geolocation details from IP address using MapTiler API.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/geolocation/#ip-geolocation
 * @returns
 */
async function info(
  options: GeolocationInfoOptions = {}
): Promise<GeolocationResult> {
  const endpoint = new URL(`geolocation/ip.json`, defaults.maptilerApiURL);
  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);
  const urlWithParams = endpoint.toString();

  const res = await callFetch(urlWithParams);

  if (!res.ok) {
    throw new ServiceError(
      res,
      res.status in customMessages ? customMessages[res.status] : ""
    );
  }

  const obj = await res.json();
  return obj as GeolocationResult;
}

/**
 * The **geolocation** namespace contains an asynchronous function to call the [MapTiler Geolocation API](https://docs.maptiler.com/cloud/api/geolocation/).
 * The **Geolocation API** provides a way to retrieve the IP address as well as geographic informations of a machine performing the query (most likely: a user)
 */
const geolocation = {
  info,
};

export { geolocation };
