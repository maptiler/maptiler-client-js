// Types import
import type {
  BBox,
  LngLat,
  ArrayLngLat,
  ObjectBBox,
  ArrayBBox,
} from "./generalTypes";

import { ClientConfig, config } from "./config";
import type { FetchFunction } from "./config";
import { LanguageGeocoding, LanguageGeocodingString } from "./language";

// Importing services
import { geocoding } from "./services/geocoding";
import type {
  GeocodingOptions,
  ReverseGeocodingOptions,
  GeocodingSearchResult,
  GeocodingFeature,
  FeatureHierarchy,
  Coordinates,
} from "./services/geocoding";
import { geolocation } from "./services/geolocation";
import type {
  GeolocationInfoOptions,
  GeolocationResult,
} from "./services/geolocation";
import { coordinates } from "./services/coordinates";
import type {
  CoordinatesSearchOptions,
  CoordinatesTransformOptions,
  CoordinateTransformResult,
  CoordinateSearchResult,
  CoordinateSearch,
  XYZ,
  CoordinateTransformation,
  CoordinateId,
  CoordinateExport,
  CoordinateGrid,
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
  GeocodingSearchResult,
  GeocodingFeature,
  CoordinateExport,
  CoordinateGrid,
  CoordinateTransformation,
  CoordinateId,
  FeatureHierarchy,
  Coordinates,
  BBox,
  ArrayLngLat,
  ObjectBBox,
  ArrayBBox,
  CoordinatesTransformOptions,
  CoordinateTransformResult,
  CoordinateSearchResult,
  XYZ,
  CoordinateSearch,
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
  GeolocationResult,
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
