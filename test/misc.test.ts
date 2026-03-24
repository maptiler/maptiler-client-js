import { describe, it, expect } from "vitest";
import { misc } from "../src/misc";

const { extractLineStrings, simplify } = misc;

describe("misc helpers", () => {
  describe("extractLineStrings()", () => {
    it("extracts from a single LineString geometry", () => {
      const geo = {
        type: "LineString" as const,
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      };

      const result = extractLineStrings(geo);
      expect(result).toEqual([geo]);
    });

    it("extracts from a single MultiLineString geometry", () => {
      const geo = {
        type: "MultiLineString" as const,
        coordinates: [
          [
            [0, 0],
            [1, 1],
          ],
          [
            [2, 2],
            [3, 3],
          ],
        ],
      };

      const result = extractLineStrings(geo);
      expect(result).toEqual([geo]);
    });

    it("extracts from a Feature containing a LineString", () => {
      const feature = {
        type: "Feature" as const,
        geometry: {
          type: "LineString" as const,
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
        properties: {},
      };

      const result = extractLineStrings(feature);
      expect(result).toEqual([feature.geometry]);
    });

    it("extracts from a FeatureCollection with mixed geometries", () => {
      const line1 = {
        type: "LineString" as const,
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      };

      const multi = {
        type: "MultiLineString" as const,
        coordinates: [
          [
            [2, 2],
            [3, 3],
          ],
          [
            [4, 4],
            [5, 5],
          ],
        ],
      };

      const collection = {
        type: "FeatureCollection" as const,
        features: [
          { type: "Feature" as const, geometry: line1, properties: {} },
          { type: "Feature" as const, geometry: multi, properties: {} },
          {
            type: "Feature" as const,
            geometry: { type: "Point" as const, coordinates: [0, 0] },
            properties: {},
          },
        ],
      };

      const result = extractLineStrings(collection);
      expect(result).toEqual([line1, multi]);
    });

    it("extracts from nested FeatureCollections", () => {
      const line = {
        type: "LineString" as const,
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      };

      const nested = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "FeatureCollection" as const,
            features: [
              { type: "Feature" as const, geometry: line, properties: {} },
            ],
          },
        ],
      };

      const result = extractLineStrings(nested);
      expect(result).toEqual([line]);
    });
  });

  describe("simplify()", () => {
    it("returns the same array when length <= 2", () => {
      const pts = [
        [0, 0],
        [1, 1],
      ];
      expect(simplify(pts, 1)).toBe(pts);
    });

    it("simplifies a polyline with a moderate tolerance", () => {
      const pts = [
        [0, 0],
        [0.5, 0.1],
        [1, 0],
      ];

      const result = simplify(pts, 0.2);
      expect(result).toEqual([
        [0, 0],
        [1, 0],
      ]);
    });

    it("keeps all points when tolerance is very small", () => {
      const pts = [
        [0, 0],
        [0.5, 0.1],
        [1, 0],
      ];

      const result = simplify(pts, 0.00001);
      expect(result).toEqual(pts);
    });

    it("collapses to endpoints when tolerance is large", () => {
      const pts = [
        [0, 0],
        [0.5, 1],
        [1, 0],
      ];

      const result = simplify(pts, 10);
      expect(result).toEqual([
        [0, 0],
        [1, 0],
      ]);
    });
  });
});
