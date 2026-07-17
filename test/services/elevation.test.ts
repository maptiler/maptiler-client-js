import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";

vi.mock("../../src/callFetch", () => ({
  callFetch: vi.fn(),
}));

import type { LineString, MultiLineString } from "geojson";
import { elevation } from "../../src/services/elevation";
import { callFetch } from "../../src/callFetch";
import { config } from "../../src/config";

describe("elevation.at()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("delegates to batch() and returns first element", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([[10, 20, 100]]),
    });

    const result = await elevation.at([10, 20]);

    expect(callFetch).toHaveBeenCalled();
    expect(result).toEqual([10, 20, 100]);
  });
});

describe("elevation.batch()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("returns empty array for empty input", async () => {
    const result = await elevation.batch([]);
    expect(result).toEqual([]);
  });

  it("uses computeOnServer by default", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([[10, 20, 5]]),
    });

    const result = await elevation.batch([[10, 20]]);

    expect(callFetch).toHaveBeenCalled();
    expect(result).toEqual([[10, 20, 5]]);
  });

  it("uses computeOnClient when computeOn='client'", async () => {
    (callFetch as Mock).mockResolvedValue({ ok: false });

    await elevation
      .batch([[10, 20]], {
        computeOn: "client",
      })
      .catch(vi.fn());

    expect(callFetch).toHaveBeenCalledWith(
      expect.stringContaining("tiles.json"),
    );
  });

  it("re-fetches the terrain TileJSON when the API host changes via useEuEndpoints()", async () => {
    const tilesJsonCallsFor = (host: string) =>
      (callFetch as Mock).mock.calls.filter(([url]: [string]) =>
        url.includes("tiles.json"),
      ).filter(([url]: [string]) => new URL(url).host === host);

    (callFetch as Mock).mockImplementation((url: string) => {
      if (url.includes("tiles.json")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              tiles: [`https://${new URL(url).host}/tiles/{z}/{x}/{y}.webp`],
              maxzoom: 12,
            }),
        });
      }
      // Individual tile fetches are left failing: this test only cares
      // about whether the TileJSON itself gets re-fetched from the right host.
      return Promise.resolve({ ok: false, status: 500 });
    });

    await elevation.batch([[10, 20]], { computeOn: "client" }).catch(() => {});
    expect(tilesJsonCallsFor("api.maptiler.com")).toHaveLength(1);

    // Same host again: the cached TileJSON should be reused, not re-fetched.
    await elevation.batch([[10, 20]], { computeOn: "client" }).catch(() => {});
    expect(tilesJsonCallsFor("api.maptiler.com")).toHaveLength(1);

    // Switching host must invalidate the cache and re-fetch from the new host.
    config.useEuEndpoints(true);
    await elevation.batch([[10, 20]], { computeOn: "client" }).catch(() => {});
    expect(tilesJsonCallsFor("api.maptiler.eu")).toHaveLength(1);

    config.useEuEndpoints(false);
  });

  it("applies smoothing kernel", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          [0, 0, 10],
          [1, 0, 15],
          [2, 0, 25],
          [3, 0, 40],
          [4, 0, 60],
        ]),
    });

    const result = await elevation.batch(
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
      ],
      { smoothingKernelSize: 3 },
    );

    expect(result[0][2]).toBe(10);
    expect(result[1][2]).toBeCloseTo((10 + 15 + 25) / 3);
    expect(result[2][2]).toBeCloseTo((15 + 25 + 40) / 3);
    expect(result[3][2]).toBeCloseTo((25 + 40 + 60) / 3);
    expect(result[4][2]).toBe(60);
  });
});

describe("elevation.fromLineString()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("throws for non-LineString", async () => {
    await expect(
      elevation.fromLineString({ type: "Point" } as unknown as LineString),
    ).rejects.toThrow(/LineString/);
  });

  it("clones and elevates coordinates", async () => {
    const ls = {
      type: "LineString" as const,
      coordinates: [
        [1, 2],
        [3, 4],
      ],
    };

    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          [1, 2, 10],
          [3, 4, 20],
        ]),
    });

    const result = await elevation.fromLineString(ls);

    expect(callFetch).toHaveBeenCalled();

    expect(result.coordinates).toEqual([
      [1, 2, 10],
      [3, 4, 20],
    ]);

    expect(result).not.toBe(ls);
  });
});

describe("elevation.fromMultiLineString()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("throws for non-MultiLineString", async () => {
    await expect(
      elevation.fromMultiLineString({
        type: "LineString",
      } as unknown as MultiLineString),
    ).rejects.toThrow(/MultiLineString/);
  });

  it("flattens, batches, and reconstructs", async () => {
    const mls = {
      type: "MultiLineString" as const,
      coordinates: [
        [
          [1, 2],
          [3, 4],
        ],
        [
          [5, 6],
          [7, 8],
        ],
      ],
    };

    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          [1, 2, 10],
          [3, 4, 20],
          [5, 6, 30],
          [7, 8, 40],
        ]),
    });

    const result = await elevation.fromMultiLineString(mls);

    expect(callFetch).toHaveBeenCalled();

    expect(result.coordinates).toEqual([
      [
        [1, 2, 10],
        [3, 4, 20],
      ],
      [
        [5, 6, 30],
        [7, 8, 40],
      ],
    ]);
  });
});
