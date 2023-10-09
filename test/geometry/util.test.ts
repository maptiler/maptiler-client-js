import { describe, it, expect, test } from "vitest";
import {
  earthRadius,
  xyzToTileID,
  mToFt,
  degToRad,
  getZoomLevelResolution,
} from "../../src/geometry";

test("earthRadius", () => {
  expect(earthRadius).toEqual(6371008.8);
});

describe("xyzToTileID", () => {
  it("managing tile x-y-z to ID", () => {
    expect(xyzToTileID(0, 0, 0)).toEqual(0);
    expect(xyzToTileID(0, 0, 1)).toEqual(1);
    expect(xyzToTileID(1, 0, 1)).toEqual(33);
    expect(xyzToTileID(1, 1, 1)).toEqual(97);
    expect(xyzToTileID(1048575, 1048575, 20)).toEqual(35184372088820);
  });

  it("xyzToTileID for all zooms 1-7", () => {
    const idCache = new Set<number>();
    for (let z = 1; z <= 7; z++) {
      for (let x = 0; x < 2 ** z; x++) {
        for (let y = 0; y < 2 ** z; y++) {
          const id = xyzToTileID(x, y, z);
          if (idCache.has(id)) throw new Error(`duplicate id ${id}`);
          idCache.add(id);
        }
      }
    }
  });
});

// test mToFt
describe("mToFt", () => {
  it("converts km to miles", () => {
    expect(mToFt(1)).toEqual(3.28084);
    expect(mToFt(10)).toEqual(32.8084);
    expect(mToFt(100)).toEqual(328.084);
    expect(mToFt(1000)).toEqual(3280.84);
  });
});

// test degToRad
describe("degToRad", () => {
  it("converts degrees to radians", () => {
    expect(degToRad(0)).toEqual(0);
    expect(degToRad(180)).toEqual(Math.PI);
    expect(degToRad(360)).toEqual(0);
    expect(degToRad(90)).toEqual(Math.PI / 2);
    expect(degToRad(270)).toEqual((3 * Math.PI) / 2);
  });
});

describe('getZoomLevelResolution', () => {
  it('calculates resolution of a zoom level', () => {
    expect(getZoomLevelResolution(0, 0)).toBeCloseTo(234814.55089206144)
    expect(getZoomLevelResolution(0, 1)).toBeCloseTo(117407.27544603072)
    expect(getZoomLevelResolution(0, 2)).toBeCloseTo(58703.63772301536)
    expect(getZoomLevelResolution(0, 3)).toBeCloseTo(29351.81886150768)
    expect(getZoomLevelResolution(0, 4)).toBeCloseTo(14675.90943075384)
    expect(getZoomLevelResolution(0, 5)).toBeCloseTo(7337.95471537692)
    expect(getZoomLevelResolution(0, 6)).toBeCloseTo(3668.97735768846)
    expect(getZoomLevelResolution(0, 7)).toBeCloseTo(1834.48867884423)
    expect(getZoomLevelResolution(0, 8)).toBeCloseTo(917.244339422115)
    expect(getZoomLevelResolution(0, 9)).toBeCloseTo(458.6221697110575)
    expect(getZoomLevelResolution(0, 10)).toBeCloseTo(229.3110848555287)
    expect(getZoomLevelResolution(0, 11)).toBeCloseTo(114.65554242776437)
    expect(getZoomLevelResolution(0, 12)).toBeCloseTo(57.32777121388218)
    expect(getZoomLevelResolution(0, 13)).toBeCloseTo(28.663885606941093)
    expect(getZoomLevelResolution(0, 14)).toBeCloseTo(14.33194280347054)
    expect(getZoomLevelResolution(0, 15)).toBeCloseTo(7.165971401735273)
    expect(getZoomLevelResolution(0, 16)).toBeCloseTo(3.582985700867636)
    expect(getZoomLevelResolution(0, 17)).toBeCloseTo(1.7914928504338183)
    expect(getZoomLevelResolution(0, 18)).toBeCloseTo(0.8957464252169091)
    expect(getZoomLevelResolution(0, 19)).toBeCloseTo(0.4478732126084545)
  })

  it('calcuates resolution of the zoom level 15 at various latitudes', () => {
    expect(getZoomLevelResolution(0, 15)).toBeCloseTo(7.165971401735273)
    expect(getZoomLevelResolution(45, 15)).toBeCloseTo(5.067106971955882)
    expect(getZoomLevelResolution(60, 15)).toBeCloseTo(3.5829857008676376)
    expect(getZoomLevelResolution(75, 15)).toBeCloseTo(1.8546898754290955)
    expect(getZoomLevelResolution(85, 15)).toBeCloseTo(0.6245555600267148)
  })
})
