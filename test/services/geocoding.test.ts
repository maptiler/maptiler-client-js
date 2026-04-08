import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";

vi.mock("../../src/callFetch", () => ({
  callFetch: vi.fn(),
}));

vi.mock("../../src/language", () => ({
  getAutoLanguage: vi.fn(() => ({ code: "en", geocoding: true })),
  getLanguageInfoFromCode: vi.fn((code) =>
    code === "cs" ? { code: "cs", geocoding: true } : null,
  ),
  getLanguageInfoFromFlag: vi.fn(() => ({ code: "en", geocoding: true })),
  isLanguageInfo: vi.fn((obj) => !!obj?.code),
  Language: { AUTO: { flag: "auto" } },
}));

import { callFetch } from "../../src/callFetch";
import { config } from "../../src/config";
import { geocoding } from "../../src/services/geocoding";
import { ServiceError } from "../../src/services/ServiceError";

describe("geocoding.forward()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("throws on empty query", async () => {
    await expect(geocoding.forward("")).rejects.toThrow(/non-empty/);
  });

  it("builds correct base URL", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await geocoding.forward("Prague");

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/geocoding/Prague.json");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
  });

  it("adds language parameter", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await geocoding.forward("Praha", { language: "cs" });

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.searchParams.get("language")).toBe("cs");
  });

  it("adds forward-specific options", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await geocoding.forward("Praha", {
      bbox: [1, 2, 3, 4],
      proximity: [10, 20],
      country: ["CZ", "SK"],
      fuzzyMatch: false,
      autocomplete: false,
    });

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.searchParams.get("bbox")).toBe("1,2,3,4");
    expect(url.searchParams.get("proximity")).toBe("10,20");
    expect(url.searchParams.get("country")).toBe("CZ,SK");
    expect(url.searchParams.get("fuzzyMatch")).toBe("false");
    expect(url.searchParams.get("autocomplete")).toBe("false");
  });

  it("throws ServiceError on non-OK", async () => {
    const fakeRes = {
      ok: false,
      status: 403,
      json: () => Promise.resolve({}),
    };

    (callFetch as Mock).mockResolvedValue(fakeRes);

    await expect(geocoding.forward("Prague")).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("returns JSON on success", async () => {
    const fakeJson = { type: "FeatureCollection", features: [] };

    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeJson),
    });

    const result = await geocoding.forward("Prague");
    expect(result).toEqual(fakeJson);
  });
});

describe("geocoding.reverse()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("throws on invalid position", async () => {
    await expect(
      geocoding.reverse("bad" as unknown as number[]),
    ).rejects.toThrow(/array/);
  });

  it("builds correct URL", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await geocoding.reverse([10, 20]);

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/geocoding/10,20.json");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
  });

  it("throws ServiceError on non-OK", async () => {
    const fakeRes = {
      ok: false,
      status: 400,
      json: () => Promise.resolve({}),
    };

    (callFetch as Mock).mockResolvedValue(fakeRes);

    await expect(geocoding.reverse([10, 20])).rejects.toBeInstanceOf(
      ServiceError,
    );
  });
});

describe("geocoding.byId()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("builds correct URL", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await geocoding.byId("123");

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/geocoding/123.json");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
  });

  it("throws ServiceError on non-OK", async () => {
    const fakeRes = {
      ok: false,
      status: 403,
      json: () => Promise.resolve({}),
    };

    (callFetch as Mock).mockResolvedValue(fakeRes);

    await expect(geocoding.byId("123")).rejects.toBeInstanceOf(ServiceError);
  });
});

describe("geocoding.batch()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("returns empty array for empty input", async () => {
    const result = await geocoding.batch([]);
    expect(result).toEqual([]);
  });

  it("builds correct URL for multiple queries", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ foo: 1 }, { bar: 2 }]),
    });

    await geocoding.batch(["Prague", "Berlin"]);

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/geocoding/Prague;Berlin.json");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
  });

  it("wraps single-query result into array", async () => {
    const fakeJson = { foo: 1 };

    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeJson),
    });

    const result = await geocoding.batch(["Prague"]);
    expect(result).toEqual([fakeJson]);
  });

  it("throws ServiceError on non-OK", async () => {
    const fakeRes = {
      ok: false,
      status: 400,
      json: () => Promise.resolve({}),
    };

    (callFetch as Mock).mockResolvedValue(fakeRes);

    await expect(geocoding.batch(["Prague"])).rejects.toBeInstanceOf(
      ServiceError,
    );
  });
});
