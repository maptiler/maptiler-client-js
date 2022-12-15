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
   * Custom mapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;
};

/**
 * Looks up geolocation details from IP address using MapTiler API.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/geolocation/#ip-geolocation
 * @returns
 */
async function info(options: GeolocationInfoOptions = {}) {
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
  return obj;
}

/**
 * The **geolocation** namespace contains an asynchronous function to call the [MapTiler Geolocation API](https://docs.maptiler.com/cloud/api/geolocation/).
 * The **Geolocation API** provides a way to retrieve the IP address as well as geographic informations of a machine performing the query (most likely: a user)
 */
const geolocation = {
  info,
};

export { geolocation };
