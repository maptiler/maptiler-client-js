import { FeatureCollection } from "geojson";
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
export type GetDataOptions = {
  /**
   * Custom MapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;
};

/**
 * Get user data and returns it as GeoJSON using the MapTiler API.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/data/#geojson
 * @param dataId
 * @returns
 */
async function get(
  dataId: string,
  options: GetDataOptions = {}
): Promise<FeatureCollection> {
  if (typeof dataId !== "string" || dataId.trim().length === 0) {
    throw new Error("The data ID must be a non-empty string");
  }

  const endpoint = new URL(
    `data/${encodeURIComponent(dataId)}/features.json`,
    defaults.maptilerApiURL
  );
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
  return obj;
}

/**
 * The **data** namespace contains an asynchronous function to call the [MapTiler Data API](https://docs.maptiler.com/cloud/api/data/).
 * The **Data API** provides a way to retrieve user data in GeoJSON format.
 */
const data = {
  get,
};

export { data };
