import { BBox, Position } from "geojson";
import { ClientConfig, config } from "./config";
import type { FetchFunction } from "./config";
import { LanguageGeocoding, LanguageGeocodingString } from "./language";

// Importing services
import { geocoding } from "./services/geocoding";
import type {
  GeocodingOptions,
  ReverseGeocodingOptions,
  LanguageGeocodingOptions,
  CommonForwardAndReverseGeocodingOptions,
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

import type { MapStylePreset, MapStyleType } from "./mapstyle";

import {
  MapStyleVariant,
  ReferenceMapStyle,
  mapStylePresetList,
  MapStyle,
  expandMapStyle,
} from "./mapstyle";

// Exporting types
export type {
  Position,
  BBox,
  GeocodingOptions,
  ReverseGeocodingOptions,
  LanguageGeocodingOptions,
  CommonForwardAndReverseGeocodingOptions,
  GeocodingSearchResult,
  GeocodingFeature,
  CoordinateExport,
  CoordinateGrid,
  CoordinateTransformation,
  CoordinateId,
  FeatureHierarchy,
  Coordinates,
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
  MapStylePreset,
  MapStyleType,
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
  MapStyleVariant,
  ReferenceMapStyle,
  mapStylePresetList,
  MapStyle,
  expandMapStyle,
};
