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
export function wgs84ToMercator(wgs84: Position): Position {
  return [
    longitudeToMercatorX(wgs84[0]),
    latitudeToMercatorY(wgs84[1])
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
export function mercatorToWgs84(merc: Position): Position {
  return [
    mercatorXToLongitude(merc[0]),
    mercatorYToLatitude(merc[1])
  ]
}

/**
 * Gives the distance in meters between two positions using the Haversine Formula.
 */
export function distance(from: Position, to: Position): number {
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
export function wrap(position: Position): Position {
  const lng = position[0];
  const lat = position[1];

  const d = 360;
  const w = ((lng + 180) % d + d) % d - 180;
  const wrapLong = (w === -180) ? 180 : w;

  return [wrapLong, lat];
}