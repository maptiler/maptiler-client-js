// Types import
import type { Bbox, LngLat, LngLatArray } from "./generalTypes";

import { ClientConfig, config } from "./config";
import type { FetchFunction } from "./config";
import { Language } from "./language";

// Importing services
import { geocoding } from "./services/geocoding";
import type { GeocodingOptions } from "./services/geocoding";
import { geolocation } from "./services/geolocation";
import { coordinates } from "./services/coordinates";
import type { CoordinatesSearchOptions, CoordinatesTransformOptions } from "./services/coordinates";
import { data } from "./services/data";
import { staticMaps } from "./services/staticMaps";
import type {
  StaticMapMarker,
  StaticMapBaseOptions,
  CenteredStaticMapOptions,
  AutomaticStaticMapOptions,
  BoundedStaticMapOptions,
} from "./services/staticMaps";

import { ServiceError } from "./services/ServiceError";

// Exporting types
export type {
  LngLat,
  GeocodingOptions,
  Bbox,
  LngLatArray,
  CoordinatesTransformOptions,
  CoordinatesSearchOptions,
  StaticMapMarker,
  StaticMapBaseOptions,
  CenteredStaticMapOptions,
  BoundedStaticMapOptions,
  AutomaticStaticMapOptions,
  FetchFunction,
};

// Exporting classes, objects, functions, etc.
export {
  config,
  ClientConfig,
  ServiceError,
  geocoding,
  geolocation,
  coordinates,
  data,
  staticMaps,
  Language,
};
