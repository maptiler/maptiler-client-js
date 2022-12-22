export type FetchFunction = (url: string, options: object) => Promise<any>;

function tryGettingFetch() {
  // this is browser, fetch exists
  if (typeof self !== "undefined") {
    return fetch.bind(self);
  }

  if (typeof global !== "undefined" && global.fetch) {
    return global.fetch;
  }

  return null;
}

/**
 * The configuration object definition
 */
class ClientConfig {
  /**
   * MapTiler Cloud API key
   */
  private _apiKey = "";

  /**
   * The fetch function. To be set if in Node < 18, otherwise
   * will be automatically resolved.
   */
  private _fetch: FetchFunction | null = tryGettingFetch();

  /**
   * Set the MapTiler Cloud API key
   */
  set apiKey(k: string) {
    this._apiKey = k;
  }

  /**
   * Get the MapTiler Cloud API key
   */
  get apiKey(): string {
    return this._apiKey;
  }

  /**
   * Set a the custom fetch function to replace the default one
   */
  set fetch(f: FetchFunction) {
    this._fetch = f;
  }

  /**
   * Get the fetch fucntion
   */
  get fetch(): FetchFunction | null {
    return this._fetch;
  }
}

/**
 * Configuration object
 */
const config = new ClientConfig();

export { ClientConfig, config };
