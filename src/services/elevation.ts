import { Position } from "geojson";
import { callFetch } from "../callFetch";
import { config } from "../config";
import { defaults } from "../defaults";
import { ServiceError } from "./ServiceError";

const tileJsonURL = "tiles/terrain-rgb-v2/tiles.json";


const customMessages = {
  403: "Key is missing, invalid or restricted",
};

let tileJsonPayload = null;


export type ElevationAtOptions = {
  /**
   * Custom MapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;
};


async function at(
  position: Position,
  options: ElevationAtOptions = {}
): Promise<Position> {
  const endpoint = new URL(tileJsonURL, defaults.maptilerApiURL);
  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);
  const urlWithParams = endpoint.toString();

  const res = await callFetch(urlWithParams);

  if (!res.ok) {
    throw new ServiceError(
      res,
      res.status in customMessages ? customMessages[res.status] : "",
    );
  }

  const obj = await res.json();

  return [0, 0, 0];
}