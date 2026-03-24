import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";

vi.mock("../../src/callFetch", () => ({
  callFetch: vi.fn(),
}));

import { callFetch } from "../../src/callFetch";
import { config } from "../../src/config";
import { data } from "../../src/services/data";
import { ServiceError } from "../../src/services/ServiceError";

describe("data.get()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    config.apiKey = "TEST_KEY";
  });

  it("throws when dataId is not a non-empty string", async () => {
    await expect(data.get("")).rejects.toThrow(/non-empty string/);
    await expect(data.get("   ")).rejects.toThrow(/non-empty string/);
    await expect(data.get(null)).rejects.toThrow(/non-empty string/);
  });

  it("calls the correct URL with encoded dataId and API key", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ type: "FeatureCollection", features: [] }),
    });

    await data.get("my data/id", { apiKey: "CUSTOM" });

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/data/my%20data%2Fid/features.json");
    expect(url.searchParams.get("key")).toBe("CUSTOM");
  });

  it("uses config.apiKey when no custom key is provided", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ type: "FeatureCollection", features: [] }),
    });

    await data.get("abc");

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/data/abc/features.json");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
  });

  it("throws ServiceError for 403", async () => {
    const fakeRes = {
      ok: false,
      status: 403,
      json: () => Promise.resolve({}),
    };

    (callFetch as Mock).mockResolvedValue(fakeRes);

    await expect(data.get("abc")).rejects.toBeInstanceOf(ServiceError);
  });

  it("returns JSON when request succeeds", async () => {
    const fakeJson = { type: "FeatureCollection", features: [] };

    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeJson),
    });

    const result = await data.get("abc");
    expect(result).toEqual(fakeJson);
  });
});
