// Types import
import type { Bbox, LngLat, LngLatArray } from "./generalTypes";

import { ClientConfig, config } from "./config";
import type { FetchFunction } from "./config";
import { LanguageGeocoding, LanguageGeocodingString } from "./language";

// Importing services
import { geocoding } from "./services/geocoding";
import type {
  GeocodingOptions,
  ReverseGeocodingOptions,
} from "./services/geocoding";
import { geolocation } from "./services/geolocation";
import type { GeolocationInfoOptions } from "./services/geolocation";
import { coordinates } from "./services/coordinates";
import type {
  CoordinatesSearchOptions,
  CoordinatesTransformOptions,
} from "./services/coordinates";
import { data } from "./services/data";
import type { GetDataOptions } from "./services/data";
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
  ReverseGeocodingOptions,
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
  LanguageGeocodingString,
  GetDataOptions,
  GeolocationInfoOptions,
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
  LanguageGeocoding,
};
