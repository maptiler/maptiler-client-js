import { Position } from "geojson";

/**
 * Average radius of Earth in meters
 */
export const EARTH_RADIUS = 6371008.8;

/**
 * Average circumfrence of Earth in meters
 */
export const EARTH_CIRCUMFRENCE = 2 * Math.PI * EARTH_RADIUS;

/**
 * Convert a wgs84 longitude to web Mercator X (west-east axis), where westmost X is 0 and eastmost X is 1.
 */
export function longitudeToMercatorX(lng: number): number {
  return (180 + lng) / 360;
}

/**
 * Convert a wgs84 latitude to web Mercator Y (north-south axis), where northmost Y is 0 and southmost Y is 1.
 */
export function latitudeToMercatorY(lat: number): number {
  return (180 - (180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)))) / 360;
}

/**
 * Convert a wgs84 position into a web Mercator position where north-west is [0, 0] and south-east is [1, 1]
 */
export function wgs84ToMercator(position: Position): Position {
  const wrappedPos = wrapWgs84(position);
  return [
    longitudeToMercatorX(wrappedPos[0]),
    latitudeToMercatorY(wrappedPos[1])
  ];
}

/**
 * Converts a mercator X (west-east axis in [0, 1]) to wgs84 longitude
 */
export function mercatorXToLongitude(x: number): number {
  return x * 360 - 180
}

/**
 * Converts a mercator Y (north-south axis in [0, 1]) to wgs84 latitude
 */
export function mercatorYToLatitude(y: number): number {
  const y2 = 180 - y * 360;
  return 360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90;
}

/**
 * Converts a web Mercator position where north-west is [0, 0] and south-east is [1, 1] into a wgs84
 */
export function mercatorToWgs84(position: Position): Position {
  return [
    mercatorXToLongitude(position[0]),
    mercatorYToLatitude(position[1])
  ]
}

/**
 * Gives the distance in meters between two positions using the Haversine Formula.
 */
export function distanceWgs84(from: Position, to: Position): number {
  const rad = Math.PI / 180;
  const lat1 = from[1] * rad;
  const lat2 = to[1] * rad;
  const a = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos((to[0] - from[0]) * rad);

  const maxMeters = EARTH_RADIUS * Math.acos(Math.min(a, 1));
  return maxMeters;
}

/**
 * Returns a position that has longitude in [-180, 180]
 */
export function wrapWgs84(position: Position): Position {
  const lng = position[0];
  const lat = position[1];

  const d = 360;
  const w = ((lng + 180) % d + d) % d - 180;
  const wrapLong = (w === -180) ? 180 : w;

  return [wrapLong, lat];
}


/**
 * From a given mercator coordinate and a zoom level, computes the tile index
 */
export function mercatorToTileIndex(
  /**
   * Mercator coordinates (north-west is [0, 0], sourth-east is [1, 1])
   */
  position: Position,
  /**
   * Zoom level
   */
  zoom: number,
  /**
   * Returns integer tile indices if `true` or floating-point values if `false`
   */
  strict: boolean = true
  ): Position {
  const numberOfTilePerAxis = 2 ** zoom;

  const fIndex: Position = [
    position[0] * numberOfTilePerAxis,
    position[1] * numberOfTilePerAxis,
  ];

  return strict ? [~~fIndex[0], ~~fIndex[1]] : fIndex;
}


/**
 * From a given wgs84 coordinate and a zoom level, computes the tile index
 */
export function wgs84ToTileIndex(
  /**
   * Wgs84 coordinates
   */
  position: Position,
  /**
   * Zoom level
   */
  zoom: number, 
  /**
   * Returns integer tile indices if `true` or floating-point values if `false`
   */
  strict: boolean = true
  ): Position {
  const merc = wgs84ToMercator(position);
  return mercatorToTileIndex(merc, zoom, strict);
}