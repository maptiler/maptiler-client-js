import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../../src/mapstyle", () => ({
  styleToStyle: vi.fn((s) => s ?? "streets-mock"),
}));

import { staticMaps } from "../../src/services/staticMaps";
import { config } from "../../src/config";

describe("staticMaps.centered()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("builds a basic centered static map URL", () => {
    const url = new URL(
      staticMaps.centered([10, 20], 5, { style: "outdoor-mock" }),
    );

    expect(url.pathname).toBe(
      "/maps/outdoor-mock/static/10,20,5/1024x1024.png",
    );
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
  });

  it("applies hiDPI scaling", () => {
    const url = new URL(staticMaps.centered([10, 20], 5, { hiDPI: true }));

    expect(url.pathname).toBe(
      "/maps/streets-mock/static/10,20,5/512x512@2x.png",
    );
  });

  it("adds attribution when provided", () => {
    const url = new URL(
      staticMaps.centered([10, 20], 5, { attribution: "bottomleft" }),
    );

    expect(url.searchParams.get("attribution")).toBe("bottomleft");
  });

  it("serializes markers (no icon)", () => {
    const url = new URL(
      staticMaps.centered([10, 20], 5, {
        markers: [15, 30, "red"],
      }),
    );

    expect(url.searchParams.get("markers")).toBe("15,30,red");
  });

  it("serializes markers with icon, anchor, and hiDPI scale", () => {
    const url = new URL(
      staticMaps.centered([10, 20], 5, {
        markers: [15, 30, "red"],
        markerIcon: "../icon.png",
        markerAnchor: "bottom",
        hiDPI: true,
      }),
    );

    expect(url.searchParams.get("markers")).toBe(
      "icon:../icon.png|anchor:bottom|scale:2|15,30",
    );
  });

  it("serializes path with fill, stroke, width, and geometry", () => {
    const url = new URL(
      staticMaps.centered([10, 20], 5, {
        path: [
          [0, 1],
          [2, 3],
          [4, 5],
          [6, 7],
          [8, 9],
        ],
        pathFillColor: "red",
        pathStrokeColor: "blue",
        pathWidth: 4,
      }),
    );

    expect(url.searchParams.get("path")).toBe(
      "fill:red|stroke:blue|width:4|0,1|2,3|4,5|6,7|8,9",
    );
  });
});

describe("staticMaps.bounded()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("builds a basic bounded static map URL", () => {
    const url = new URL(
      staticMaps.bounded([1, 2, 3, 4], { style: "outdoor-mock" }),
    );

    expect(url.pathname).toBe(
      "/maps/outdoor-mock/static/1,2,3,4/1024x1024.png",
    );
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
  });

  it("adds padding when provided", () => {
    const url = new URL(staticMaps.bounded([1, 2, 3, 4], { padding: 0.2 }));

    expect(url.searchParams.get("padding")).toBe("0.2");
  });

  it("serializes markers", () => {
    const url = new URL(
      staticMaps.bounded([1, 2, 3, 4], {
        markers: [
          [10, 20, "red"],
          [30, 40, "blue"],
        ],
      }),
    );

    expect(url.searchParams.get("markers")).toBe("10,20,red|30,40,blue");
  });
});

describe("staticMaps.automatic()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("throws when neither markers nor path is provided", () => {
    expect(() => staticMaps.automatic({})).toThrow(
      /require markers and\/or path/,
    );
  });

  it("builds an automatic static map URL", () => {
    const url = new URL(
      staticMaps.automatic({
        markers: [10, 20, "red"],
      }),
    );

    expect(url.pathname).toBe("/maps/streets-mock/static/auto/1024x1024.png");
    expect(url.searchParams.get("markers")).toBe("10,20,red");
  });

  it("adds padding when provided", () => {
    const url = new URL(
      staticMaps.automatic({
        markers: [10, 20, "red"],
        padding: 0.3,
      }),
    );

    expect(url.searchParams.get("padding")).toBe("0.3");
  });

  it("serializes path", () => {
    const url = new URL(
      staticMaps.automatic({
        path: [
          [1, 2],
          [3, 4],
        ],
      }),
    );

    expect(url.searchParams.get("path")).toBe("fill:none|1,2|3,4");
  });
});
