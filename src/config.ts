import { BufferToPixelDataFunction } from "./tiledecoding";

/**
 * The only two hosts the MapTiler Cloud API is served from.
 * Not exported: the API host must always be read through `config.apiHost`/`config.apiURL`
 * so that `useEuEndpoints()` is honored everywhere.
 */
const DEFAULT_API_HOST = "api.maptiler.com";
const EU_API_HOST = "api.maptiler.eu";

export type FetchFunction = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

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
   * Whether to use the EU-based `api.maptiler.eu` host instead of the default `api.maptiler.com`
   */
  private _useEuEndpoints = false;

  /**
   * Number of tiles to keep in cache
   */
  public tileCacheSize: number = 200;

  public bufferToPixelData?: BufferToPixelDataFunction | null;

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

  /**
   * Switch between the default `api.maptiler.com` host and the EU-based `api.maptiler.eu` host.
   * Call with `false` to switch back to the default.
   */
  useEuEndpoints(value = true): void {
    this._useEuEndpoints = value;
  }

  /**
   * Whether the EU-based `api.maptiler.eu` host is currently in use instead of the default `api.maptiler.com`
   */
  get isUsingEuEndpoints(): boolean {
    return this._useEuEndpoints;
  }

  /**
   * The host currently used for the MapTiler API requests (`api.maptiler.com` or `api.maptiler.eu`)
   */
  get apiHost(): string {
    return this._useEuEndpoints ? EU_API_HOST : DEFAULT_API_HOST;
  }

  /**
   * The base URL currently used for the MapTiler API requests
   * (`https://api.maptiler.com/` or `https://api.maptiler.eu/`)
   */
  get apiURL(): string {
    return `https://${this.apiHost}/`;
  }
}

/**
 * Configuration object
 */
const config = new ClientConfig();

export { ClientConfig, config };
