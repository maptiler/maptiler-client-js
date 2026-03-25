import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";

vi.mock("../../src/callFetch", () => ({
  callFetch: vi.fn(),
}));

import { callFetch } from "../../src/callFetch";
import { config } from "../../src/config";
import { geolocation } from "../../src/services/geolocation";
import { ServiceError } from "../../src/services/ServiceError";

describe("geolocation.info()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    config.apiKey = "TEST_KEY";
  });

  it("calls the correct URL with default API key", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await geolocation.info();

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/geolocation/ip.json");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
  });

  it("uses custom API key when provided", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await geolocation.info({ apiKey: "CUSTOM" });

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/geolocation/ip.json");
    expect(url.searchParams.get("key")).toBe("CUSTOM");
  });

  it("adds elevation=true when elevation option is true", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await geolocation.info({ elevation: true });

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/geolocation/ip.json");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
    expect(url.searchParams.get("elevation")).toBe("true");
  });

  it("adds elevation=false when elevation option is false", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await geolocation.info({ elevation: false });

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/geolocation/ip.json");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
    expect(url.searchParams.get("elevation")).toBe("false");
  });

  it("throws ServiceError for 403", async () => {
    const fakeRes = {
      ok: false,
      status: 403,
      json: () => Promise.resolve({}),
    };

    (callFetch as Mock).mockResolvedValue(fakeRes);

    await expect(geolocation.info()).rejects.toBeInstanceOf(ServiceError);
  });

  it("returns JSON when request succeeds", async () => {
    const fakeJson = { country: "Switzerland", country_code: "CH" };

    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeJson),
    });

    const result = await geolocation.info();
    expect(result).toEqual(fakeJson);
  });
});
