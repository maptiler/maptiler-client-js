import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  bufferToPixelDataBrowser,
  getTileCache,
  getBufferToPixelDataParser,
  canParsePixelData,
} from "../src/tiledecoding";
import { config } from "../src/config";
import QuickLRU from "quick-lru";

describe("tiledecoding helpers", () => {
  beforeEach(() => {
    globalThis.tileCache = null;
    config.bufferToPixelData = undefined;
    config.tileCacheSize = 123;
  });

  describe("getTileCache()", () => {
    it("creates a QuickLRU instance with correct size", () => {
      const cache = getTileCache();
      expect(cache).toBeInstanceOf(QuickLRU);
      expect(cache.maxSize).toBe(123);
    });

    it("returns the same instance on subsequent calls", () => {
      const c1 = getTileCache();
      const c2 = getTileCache();
      expect(c1).toBe(c2);
    });
  });

  describe("getBufferToPixelDataParser()", () => {
    it("returns config.bufferToPixelData when provided", () => {
      const mockFn = vi.fn();
      config.bufferToPixelData = mockFn;

      const parser = getBufferToPixelDataParser();
      expect(parser).toBe(mockFn);
    });

    it("throws in Node environment when no parser is configured", () => {
      vi.stubGlobal("window", undefined);

      expect(() => getBufferToPixelDataParser()).toThrow(
        /image file buffer to pixel data parser is necessary/,
      );
    });

    it("returns browser parser when window exists", () => {
      vi.stubGlobal("window", {});

      const parser = getBufferToPixelDataParser();
      expect(parser).toBe(bufferToPixelDataBrowser);
    });
  });

  describe("canParsePixelData()", () => {
    it("returns true when config.bufferToPixelData is set", () => {
      config.bufferToPixelData = () => Promise.resolve(null);
      expect(canParsePixelData()).toBe(true);
    });

    it("returns true when window exists", () => {
      vi.stubGlobal("window", {});

      expect(canParsePixelData()).toBe(true);
    });

    it("returns false when neither parser nor window exists", () => {
      vi.stubGlobal("window", undefined);
      config.bufferToPixelData = undefined;

      expect(canParsePixelData()).toBe(false);
    });
  });
});
