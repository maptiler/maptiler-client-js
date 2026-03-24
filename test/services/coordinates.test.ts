import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";

vi.mock("../../src/callFetch", () => ({
  callFetch: vi.fn(),
}));

import { callFetch } from "../../src/callFetch";
import { config } from "../../src/config";
import { coordinates } from "../../src/services/coordinates";
import { ServiceError } from "../../src/services/ServiceError";

describe("coordinates.search()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("throws when query is empty", async () => {
    await expect(coordinates.search("")).rejects.toThrow(/non-empty/);
    await expect(coordinates.search(null)).rejects.toThrow(/non-empty/);
  });

  it("builds correct URL with default params", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [], total: 0 }),
    });

    await coordinates.search("EPSG");

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/coordinates/search/EPSG.json");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
  });

  it("adds optional parameters", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [], total: 0 }),
    });

    await coordinates.search("EPSG", {
      limit: 5,
      transformations: true,
      exports: true,
    });

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.searchParams.get("limit")).toBe("5");
    expect(url.searchParams.get("transformations")).toBe("true");
    expect(url.searchParams.get("exports")).toBe("true");
  });

  it("throws ServiceError for 403", async () => {
    const fakeRes = {
      ok: false,
      status: 403,
      json: () => Promise.resolve({}),
    };

    (callFetch as Mock).mockResolvedValue(fakeRes);

    await expect(coordinates.search("EPSG")).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("returns JSON on success", async () => {
    const fakeJson = { results: [], total: 0 };

    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeJson),
    });

    const result = await coordinates.search("EPSG");
    expect(result).toEqual(fakeJson);
  });
});

describe("coordinates.transform()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("builds URL for a single position", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [],
          transformer_selection_strategy: "auto",
        }),
    });

    await coordinates.transform([10, 20]);

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/coordinates/transform/10,20.json");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
  });

  it("builds URL for multiple positions", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [],
          transformer_selection_strategy: "auto",
        }),
    });

    await coordinates.transform([
      [10, 20],
      [30, 40],
    ]);

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/coordinates/transform/10,20;30,40.json");
  });

  it("adds optional CRS and operations", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [],
          transformer_selection_strategy: "auto",
        }),
    });

    await coordinates.transform([10, 20], {
      sourceCrs: 3857,
      targetCrs: 4326,
      operations: [1, 2, 3],
    });

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.searchParams.get("s_srs")).toBe("3857");
    expect(url.searchParams.get("t_srs")).toBe("4326");
    expect(url.searchParams.get("ops")).toBe("1|2|3");
  });

  it("throws ServiceError for 403", async () => {
    const fakeRes = {
      ok: false,
      status: 403,
      json: () => Promise.resolve({}),
    };

    (callFetch as Mock).mockResolvedValue(fakeRes);

    await expect(coordinates.transform([10, 20])).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("returns JSON on success", async () => {
    const fakeJson = {
      results: [{ x: 1, y: 2 }],
      transformer_selection_strategy: "auto",
    };

    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeJson),
    });

    const result = await coordinates.transform([10, 20]);
    expect(result).toEqual(fakeJson);
  });
});
