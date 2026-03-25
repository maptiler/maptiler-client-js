import { describe, it, expect, vi } from "vitest";
import {
  NonISOLanguage,
  ISOLanguage,
  Language,
  getLanguageInfoFromKey,
  getLanguageInfoFromCode,
  getLanguageInfoFromFlag,
  getAutoLanguage,
  isLanguageInfo,
  toLanguageInfo,
  areSameLanguages,
} from "../src/language";

describe("language helpers", () => {
  const TEST_LANG = {
    ENGLISH: ISOLanguage.ENGLISH,
    JAPANESE: ISOLanguage.JAPANESE,
    AUTO: NonISOLanguage.AUTO,
  };

  describe("getLanguageInfoFromKey()", () => {
    it("returns the matching language by key", () => {
      const result = getLanguageInfoFromKey("ENGLISH", TEST_LANG);
      expect(result).toBe(TEST_LANG.ENGLISH);
    });

    it("returns null when key not found", () => {
      const result = getLanguageInfoFromKey("UNKNOWN", TEST_LANG);
      expect(result).toBeNull();
    });
  });

  describe("getLanguageInfoFromCode()", () => {
    it("returns the matching language by ISO code", () => {
      const result = getLanguageInfoFromCode("ja", TEST_LANG);
      expect(result).toBe(TEST_LANG.JAPANESE);
    });

    it("returns null when code not found", () => {
      const result = getLanguageInfoFromCode("xx", TEST_LANG);
      expect(result).toBeNull();
    });
  });

  describe("getLanguageInfoFromFlag()", () => {
    it("returns the matching language by flag", () => {
      const result = getLanguageInfoFromFlag("name:en", TEST_LANG);
      expect(result).toBe(TEST_LANG.ENGLISH);
    });

    it("returns null when flag not found", () => {
      const result = getLanguageInfoFromFlag("name:xx", TEST_LANG);
      expect(result).toBeNull();
    });
  });

  describe("getAutoLanguage()", () => {
    it("uses Intl locale when navigator is undefined", () => {
      vi.stubGlobal("navigator", undefined);
      vi.stubGlobal("Intl", {
        DateTimeFormat: () => ({
          resolvedOptions: () => ({ locale: "ja-JP" }),
        }),
      });

      const result = getAutoLanguage();
      expect(result).toBe(Language.JAPANESE);
    });

    it("falls back to English when locale not found", () => {
      vi.stubGlobal("navigator", undefined);
      vi.stubGlobal("Intl", {
        DateTimeFormat: () => ({
          resolvedOptions: () => ({ locale: "xx-XX" }),
        }),
      });

      const result = getAutoLanguage();
      expect(result).toBe(Language.ENGLISH);
    });

    it("uses navigator.languages when available", () => {
      vi.stubGlobal("navigator", {
        languages: ["ja-JP-Hira", "en-US"],
      });

      const result = getAutoLanguage();
      expect(result).toBe(Language.JAPANESE);
    });

    it("falls back to English when navigator languages unsupported", () => {
      vi.stubGlobal("navigator", {
        languages: ["xx-XX"],
      });

      const result = getAutoLanguage();
      expect(result).toBe(Language.ENGLISH);
    });
  });

  describe("isLanguageInfo()", () => {
    it("returns true for valid LanguageInfo", () => {
      expect(isLanguageInfo(TEST_LANG.ENGLISH)).toBe(true);
    });

    it("returns false for invalid objects", () => {
      expect(isLanguageInfo({})).toBe(false);
      expect(isLanguageInfo(null)).toBe(false);
      expect(isLanguageInfo("en")).toBe(false);
    });
  });

  describe("toLanguageInfo()", () => {
    it("returns the same language when given a LanguageInfo object", () => {
      const result = toLanguageInfo(TEST_LANG.JAPANESE, TEST_LANG);
      expect(result).toBe(TEST_LANG.JAPANESE);
    });

    it("returns language by key", () => {
      const result = toLanguageInfo("ENGLISH", TEST_LANG);
      expect(result).toBe(TEST_LANG.ENGLISH);
    });

    it("returns language by ISO code", () => {
      const result = toLanguageInfo("ja", TEST_LANG);
      expect(result).toBe(TEST_LANG.JAPANESE);
    });

    it("returns language by flag", () => {
      const result = toLanguageInfo("name:en", TEST_LANG);
      expect(result).toBe(TEST_LANG.ENGLISH);
    });

    it("returns null for unknown values", () => {
      expect(toLanguageInfo("xx", TEST_LANG)).toBeNull();
      expect(toLanguageInfo(123 as unknown as string, TEST_LANG)).toBeNull();
    });
  });

  describe("areSameLanguages()", () => {
    it("returns true when languages match by different forms", () => {
      expect(areSameLanguages("ENGLISH", "name:en", TEST_LANG)).toBe(true);
      expect(areSameLanguages("en", TEST_LANG.ENGLISH, TEST_LANG)).toBe(true);
    });

    it("returns false when languages differ", () => {
      expect(areSameLanguages("ENGLISH", "JAPANESE", TEST_LANG)).toBe(false);
    });

    it("returns false when either cannot be resolved", () => {
      expect(areSameLanguages("xx", "ENGLISH", TEST_LANG)).toBe(false);
      expect(areSameLanguages("ENGLISH", "yy", TEST_LANG)).toBe(false);
    });
  });
});
