import { config } from "./config";

export async function callFetch(resource, options = {}) {
  if (config.fetch === null) {
    throw new Error(
      "The fetch function was not found. If on NodeJS < 18 please specify the fetch function with config.fetch"
    );
  }

  //  Control if URL contains the api key
  if (new URL(resource).searchParams.get("key").trim() === "") {
    throw new Error(
      "The MapTiler Cloud API key is missing. Set it in `config.apiKey` or get one for free at https://maptiler.com"
    );
  }

  return config.fetch(resource, options);
}
