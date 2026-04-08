import { describe, it, expect } from "vitest";
import { math } from "../../src/services/math";

const {
  EARTH_CIRCUMFERENCE,
  longitudeToMercatorX,
  latitudeToMercatorY,
  wgs84ToMercator,
  mercatorXToLongitude,
  mercatorYToLatitude,
  mercatorToWgs84,
  haversineDistanceWgs84,
  wrapWgs84,
  circumferenceAtLatitude,
  mercatorToTileIndex,
  wgs84ToTileIndex,
  toRadians,
  toDegrees,
  haversineIntermediateWgs84,
  haversineCumulatedDistanceWgs84,
} = math;

describe("math helpers", () => {
  describe("longitudeToMercatorX / mercatorXToLongitude", () => {
    it("round-trips longitude through mercator X", () => {
      const lng = 12.34;
      const x = longitudeToMercatorX(lng);
      const lng2 = mercatorXToLongitude(x);
      expect(lng2).toBeCloseTo(lng, 6);
    });
  });

  describe("latitudeToMercatorY / mercatorYToLatitude", () => {
    it("round-trips latitude through mercator Y", () => {
      const lat = 48.2;
      const y = latitudeToMercatorY(lat);
      const lat2 = mercatorYToLatitude(y);
      expect(lat2).toBeCloseTo(lat, 6);
    });

    it("clamps latitude to max valid Web Mercator", () => {
      const y = latitudeToMercatorY(90);
      const y2 = latitudeToMercatorY(-90);
      expect(y).toBeCloseTo(latitudeToMercatorY(85.0511287));
      expect(y2).toBeCloseTo(latitudeToMercatorY(-85.0511287));
    });
  });

  describe("wgs84ToMercator / mercatorToWgs84", () => {
    it("round-trips WGS84 through Mercator", () => {
      const pos = [8.55, 47.366];
      const merc = wgs84ToMercator(pos);
      const pos2 = mercatorToWgs84(merc);
      expect(pos2[0]).toBeCloseTo(pos[0], 6);
      expect(pos2[1]).toBeCloseTo(pos[1], 6);
    });
  });

  describe("wrapWgs84()", () => {
    it("wraps longitude > 180", () => {
      expect(wrapWgs84([190, 10])[0]).toBeCloseTo(-170);
    });

    it("wraps longitude < -180", () => {
      expect(wrapWgs84([-200, 10])[0]).toBeCloseTo(160);
    });

    it("wraps -180 to +180", () => {
      expect(wrapWgs84([-180, 0])[0]).toBe(180);
    });
  });

  describe("haversineDistanceWgs84()", () => {
    it("returns 0 for identical points", () => {
      expect(haversineDistanceWgs84([0, 0], [0, 0])).toBe(0);
    });

    it("computes approx distance for 1° latitude", () => {
      const d = haversineDistanceWgs84([0, 0], [0, 1]);
      expect(d).toBeCloseTo(111_195, -2);
    });
  });

  describe("haversineCumulatedDistanceWgs84()", () => {
    it("computes cumulative distances", () => {
      const pts = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const result = haversineCumulatedDistanceWgs84(pts);
      expect(result[0]).toBe(0);
      expect(result[1]).toBeCloseTo(111_195, -2);
      expect(result[2]).toBeCloseTo(222_390, -2);
    });
  });

  describe("haversineIntermediateWgs84()", () => {
    it("returns pos1 when ratio = 0", () => {
      const p1 = [0, 0];
      const p2 = [0, 10];
      const result = haversineIntermediateWgs84(p1, p2, 0);

      expect(result[1]).toEqual(0);
    });

    it("returns midpoint when ratio = 0.5", () => {
      const p1 = [0, 0];
      const p2 = [0, 10];

      const result = haversineIntermediateWgs84(p1, p2, 0.5);

      expect(result[1]).toBeCloseTo(5, 6);
    });

    it("returns pos2 when ratio = 1", () => {
      const p1 = [0, 0];
      const p2 = [0, 10];

      const result = haversineIntermediateWgs84(p1, p2, 1);

      expect(result[1]).toBeCloseTo(10, 6);
    });
  });

  describe("circumferenceAtLatitude()", () => {
    it("equals Earth circumference at equator", () => {
      expect(circumferenceAtLatitude(0)).toBeCloseTo(EARTH_CIRCUMFERENCE);
    });

    it("is zero at poles", () => {
      expect(circumferenceAtLatitude(90)).toBeCloseTo(0);
    });
  });

  describe("mercatorToTileIndex()", () => {
    it("returns [0,0] at zoom 0", () => {
      expect(mercatorToTileIndex([0.5, 0.5], 0)).toEqual([0, 0]);
    });

    it("returns correct quadrant at zoom 1", () => {
      expect(mercatorToTileIndex([0.75, 0.25], 1)).toEqual([1, 0]);
    });

    it("returns floating values when strict=false", () => {
      expect(mercatorToTileIndex([0.5, 0.5], 2, false)).toEqual([2, 2]);
    });
  });

  describe("wgs84ToTileIndex()", () => {
    it("returns [0,0] for any point at zoom 0", () => {
      expect(wgs84ToTileIndex([10, 10], 0)).toEqual([0, 0]);
    });
  });

  describe("toRadians / toDegrees", () => {
    it("converts degrees to radians", () => {
      expect(toRadians(180)).toBeCloseTo(Math.PI);
    });

    it("converts radians to degrees", () => {
      expect(toDegrees(Math.PI)).toBeCloseTo(180);
    });
  });
});
