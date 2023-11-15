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