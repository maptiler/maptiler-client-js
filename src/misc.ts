import {
  GeoJsonObject,
  GeometryObject,
  LineString,
  MultiLineString,
  Feature,
  FeatureCollection,
  Position,
} from "geojson";

/**
 * From a generic GeoJSON object extract thepossibly nested LineString and MultiLineString features
 * it contains. The result is a flat array made of LineString and MultiLineString.
 */
function extractLineStrings(
  geoJson: GeoJsonObject,
): Array<LineString | MultiLineString> {
  const lineStrings: Array<LineString | MultiLineString> = [];

  function extractFromGeometry(geometry: GeometryObject) {
    if (geometry.type === "LineString" || geometry.type === "MultiLineString") {
      lineStrings.push(geometry as LineString | MultiLineString);
    }
  }

  function extractFromFeature(feature: Feature) {
    if (feature.geometry) {
      extractFromGeometry(feature.geometry);
    }
  }

  function extractFromFeatureCollection(collection: FeatureCollection) {
    for (const feature of collection.features) {
      if (feature.type === "Feature") {
        extractFromFeature(feature);
      } else if (feature.type === "FeatureCollection") {
        extractFromFeatureCollection(feature as unknown as FeatureCollection); // had to add unknown
      }
    }
  }

  if (geoJson.type === "Feature") {
    extractFromFeature(geoJson as Feature);
  } else if (geoJson.type === "FeatureCollection") {
    extractFromFeatureCollection(geoJson as FeatureCollection);
  } else {
    // It's a single geometry
    extractFromGeometry(geoJson as GeometryObject);
  }

  return lineStrings;
}

// square distance from a point to a segment
function getSqSegDist(p: Position, p1: Position, p2: Position): number {
  let x = p1[0],
    y = p1[1],
    dx = p2[0] - x,
    dy = p2[1] - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

    if (t > 1) {
      x = p2[0];
      y = p2[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p[0] - x;
  dy = p[1] - y;

  return dx * dx + dy * dy;
}

function simplifyDPStep(
  points: Array<Position>,
  first: number,
  last: number,
  sqTolerance: number,
  simplified: Array<Position>,
) {
  let maxSqDist = sqTolerance,
    index;

  for (let i = first + 1; i < last; i++) {
    const sqDist = getSqSegDist(points[i], points[first], points[last]);

    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }

  if (maxSqDist > sqTolerance) {
    if (index - first > 1) {
      simplifyDPStep(points, first, index, sqTolerance, simplified);
    }
    simplified.push(points[index]);

    if (last - index > 1) {
      simplifyDPStep(points, index, last, sqTolerance, simplified);
    }
  }
}

// simplification using Ramer-Douglas-Peucker algorithm
function simplifyDouglasPeucker(
  points: Array<Position>,
  sqTolerance: number,
): Array<Position> {
  const last = points.length - 1;
  const simplified = [points[0]];
  simplifyDPStep(points, 0, last, sqTolerance, simplified);
  simplified.push(points[last]);
  return simplified;
}

/**
 * Simplify a path made of a list of GeoJSON Positions, with a tolerance.
 */
function simplify(points: Array<Position>, tolerance: number): Array<Position> {
  if (points.length <= 2) {
    return points;
  }

  const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;
  const simplePoints = simplifyDouglasPeucker(points, sqTolerance);
  return simplePoints;
}

export const misc = {
  extractLineStrings,
  simplify,
};
