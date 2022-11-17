import { config } from "./config";

export async function callFetch(resource, options = {}) {
  if (config.fetch === null) {
    throw new Error(
      "The fetch function was not found. If on NodeJS < 18 please specify the fetch function with config.fetch"
    );
  }

  return config.fetch(resource, options);
}
