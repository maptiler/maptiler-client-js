import { describe, it, expect, vi, afterEach } from "vitest";

import { MapStyle, defaultMapStyle, styleToStyle } from "../src/mapstyle";

describe("defaultMapStyle", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is Streets v4", () => {
    expect(defaultMapStyle).toBe(MapStyle.STREETS);
    expect(defaultMapStyle.getDefaultVariant().getId()).toBe("streets-v4");
  });

  it("is used by styleToStyle when no style is provided, without a deprecation warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(styleToStyle(undefined)).toBe("streets-v4");
    expect(styleToStyle(null)).toBe("streets-v4");
    expect(warn).not.toHaveBeenCalled();
  });
});
