import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";

vi.mock("../../src/callFetch", () => ({
  callFetch: vi.fn(),
}));

import { callFetch } from "../../src/callFetch";
import { config } from "../../src/config";
import { routing, type RoutingRequest } from "../../src/services/routing";
import { ServiceError } from "../../src/services/ServiceError";

describe("routing.directionsPost()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("builds correct POST URL and sends JSON body", async () => {
    const fakeJson = { route: { summary: {}, legs: [] } };

    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeJson),
    });

    const body: RoutingRequest = {
      profile: "car",
      locations: [
        { lon: 10, lat: 20 },
        { lon: 30, lat: 40 },
      ],
    };

    await routing.directionsPost(body);

    expect(callFetch).toHaveBeenCalledWith(
      expect.stringContaining("/routing/directions?key=TEST_KEY"),
      expect.objectContaining({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
  });

  it("throws ServiceError on non-OK response", async () => {
    const fakeRes = {
      ok: false,
      status: 400,
      json: () => Promise.resolve({}),
    };

    (callFetch as Mock).mockResolvedValue(fakeRes);

    await expect(
      routing.directionsPost({
        profile: "car",
        locations: [
          { lon: 10, lat: 20 },
          { lon: 30, lat: 40 },
        ],
      }),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("returns JSON on success", async () => {
    const fakeJson = { route: { summary: {}, legs: [] } };

    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeJson),
    });

    const result = await routing.directionsPost({
      profile: "car",
      locations: [
        { lon: 10, lat: 20 },
        { lon: 30, lat: 40 },
      ],
    });

    expect(result).toEqual(fakeJson);
  });
});

describe("routing.directionsGet()", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("builds correct GET URL with required parameters", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ route: { summary: {}, legs: [] } }),
    });

    await routing.directionsGet({
      profile: "car",
      locations: [
        { lon: 10, lat: 20 },
        { lon: 30, lat: 40 },
      ],
    });

    expect(callFetch).toHaveBeenCalledWith(expect.any(String));

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/routing/directions");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
    expect(url.searchParams.get("profile")).toBe("car");
    expect(url.searchParams.getAll("location")).toEqual(["20,10", "40,30"]);
  });

  it("adds response options", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ route: { summary: {}, legs: [] } }),
    });

    await routing.directionsGet({
      profile: "car",
      locations: [
        { lon: 10, lat: 20 },
        { lon: 30, lat: 40 },
      ],
      response: {
        units: "km",
        language: "cs",
        alternates: 2,
        additionalData: { detailLevel: "steps" },
      },
    });

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.searchParams.get("response.units")).toBe("km");
    expect(url.searchParams.get("response.language")).toBe("cs");
    expect(url.searchParams.get("alternates")).toBe("2");
    expect(url.searchParams.get("response.additionalData.detailLevel")).toBe(
      "steps",
    );
  });

  it("adds profile-specific options", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ route: { summary: {}, legs: [] } }),
    });

    await routing.directionsGet({
      profile: "car",
      locations: [
        { lon: 10, lat: 20 },
        { lon: 30, lat: 40 },
      ],
      profileOptions: {
        mode: "fastest",
        topSpeed: 120,
        avoidances: { tolls: true, ferry: false },
      },
    });

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.searchParams.get("car.mode")).toBe("fastest");
    expect(url.searchParams.get("topSpeed")).toBe("120");
    expect(url.searchParams.get("avoidances.tolls")).toBe("true");
    expect(url.searchParams.get("avoidances.ferry")).toBe("false");
  });

  it("throws ServiceError on non-OK response", async () => {
    const fakeRes = {
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    };

    (callFetch as Mock).mockResolvedValue(fakeRes);

    await expect(
      routing.directionsGet({
        profile: "car",
        locations: [
          { lon: 10, lat: 20 },
          { lon: 30, lat: 40 },
        ],
      }),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("returns JSON on success", async () => {
    const fakeJson = { route: { summary: {}, legs: [] } };

    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeJson),
    });

    const result = await routing.directionsGet({
      profile: "car",
      locations: [
        { lon: 10, lat: 20 },
        { lon: 30, lat: 40 },
      ],
    });

    expect(result).toEqual(fakeJson);
  });
});
