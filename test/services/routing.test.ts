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
      expect.stringContaining("/routing/v1/directions?key=TEST_KEY"),
      expect.objectContaining({
        method: "POST",
        headers: expect.any(Headers),
        body: JSON.stringify(body),
      }),
    );
    expect(
      (callFetch as Mock).mock.calls[0][1].headers.get("content-type"),
    ).toBe("application/json");
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

  it("applies adjustSearchParams and keeps the key non-overridable", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ route: { summary: {}, legs: [] } }),
    });

    await routing.directionsPost(
      {
        profile: "car",
        locations: [
          { lon: 10, lat: 20 },
          { lon: 30, lat: 40 },
        ],
      },
      {
        adjustSearchParams: (searchParams) => {
          searchParams.set("custom", "value");
          searchParams.set("key", "OVERRIDE_ATTEMPT");
        },
      },
    );

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.searchParams.get("custom")).toBe("value");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
  });

  it("passes fetchExtras through and keeps the JSON content-type", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ route: { summary: {}, legs: [] } }),
    });

    const controller = new AbortController();

    await routing.directionsPost(
      {
        profile: "car",
        locations: [
          { lon: 10, lat: 20 },
          { lon: 30, lat: 40 },
        ],
      },
      {
        fetchExtras: {
          signal: controller.signal,
          headers: { "x-custom": "header" },
        },
      },
    );

    const init = (callFetch as Mock).mock.calls[0][1];

    expect(init.signal).toBe(controller.signal);
    expect(init.headers.get("x-custom")).toBe("header");
    expect(init.headers.get("content-type")).toBe("application/json");
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

    expect(callFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
    );

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.pathname).toBe("/routing/v1/directions");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
    expect(url.searchParams.get("profile")).toBe("car");
    expect(url.searchParams.getAll("location")).toEqual(["10,20", "30,40"]);
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

  it("applies adjustSearchParams and keeps the key non-overridable", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ route: { summary: {}, legs: [] } }),
    });

    await routing.directionsGet(
      {
        profile: "car",
        locations: [
          { lon: 10, lat: 20 },
          { lon: 30, lat: 40 },
        ],
      },
      {
        adjustSearchParams: (searchParams) => {
          searchParams.set("custom", "value");
          searchParams.set("profile", "bicycle");
          searchParams.set("key", "OVERRIDE_ATTEMPT");
        },
      },
    );

    const url = new URL((callFetch as Mock).mock.calls[0][0]);

    expect(url.searchParams.get("custom")).toBe("value");
    expect(url.searchParams.get("profile")).toBe("bicycle");
    expect(url.searchParams.get("key")).toBe("TEST_KEY");
  });

  it("passes fetchExtras through", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ route: { summary: {}, legs: [] } }),
    });

    const controller = new AbortController();

    await routing.directionsGet(
      {
        profile: "car",
        locations: [
          { lon: 10, lat: 20 },
          { lon: 30, lat: 40 },
        ],
      },
      { fetchExtras: { signal: controller.signal } },
    );

    const init = (callFetch as Mock).mock.calls[0][1];

    expect(init.signal).toBe(controller.signal);
    expect(init.method).toBe("GET");
  });
});

/**
 * Real Encoded Polyline taken from the API schema examples
 * (`examples/directions/responses/encoded.json`).
 */
const ENCODED_GEOMETRY =
  "mbctuA}zcpVDVeBr@fDfJdBzHxDzHvC`GlDkBdW_NfEqBxDmBdBu@jLiF~VaLhD{AdCiA";

const DECODED_FIRST_POINT = [12.339647, 45.434935];
const DECODED_LAST_POINT = [12.339826, 45.433211];

const TWO_LOCATIONS = [
  { lon: 10, lat: 20 },
  { lon: 30, lat: 40 },
];

function mockResponse(json: unknown, ok = true, status = 200) {
  (callFetch as Mock).mockResolvedValue({
    ok,
    status,
    url: "https://api.maptiler.com/routing/v1/directions",
    json: () => Promise.resolve(json),
  });
}

function lastUrl(): URL {
  return new URL((callFetch as Mock).mock.calls[0][0]);
}

describe("routing.directionsGet() profile options", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
    mockResponse({ route: { summary: {}, legs: [] } });
  });

  it("adds every truck option, including all avoidance flags", async () => {
    await routing.directionsGet({
      profile: "truck",
      locations: TWO_LOCATIONS,
      profileOptions: {
        weight: 24,
        height: 4.5,
        axleLoad: 11,
        hazmat: true,
        topSpeed: 80,
        avoidances: { tolls: true, ferry: true, highway: false },
      },
    });

    const search = lastUrl().searchParams;

    expect(search.get("truck.weight")).toBe("24");
    expect(search.get("truck.height")).toBe("4.5");
    expect(search.get("truck.axleLoad")).toBe("11");
    expect(search.get("truck.hazmat")).toBe("true");
    expect(search.get("topSpeed")).toBe("80");
    expect(search.get("avoidances.tolls")).toBe("true");
    expect(search.get("avoidances.ferry")).toBe("true");
    expect(search.get("avoidances.highway")).toBe("false");
  });

  it("adds bicycle options", async () => {
    await routing.directionsGet({
      profile: "bicycle",
      locations: TWO_LOCATIONS,
      profileOptions: { type: "gravel", cyclingSpeed: 18 },
    });

    const search = lastUrl().searchParams;

    expect(search.get("bicycle.type")).toBe("gravel");
    expect(search.get("bicycle.cyclingSpeed")).toBe("18");
  });

  it("adds pedestrian options", async () => {
    await routing.directionsGet({
      profile: "pedestrian",
      locations: TWO_LOCATIONS,
      profileOptions: { walkingSpeed: 4.5 },
    });

    expect(lastUrl().searchParams.get("pedestrian.walkingSpeed")).toBe("4.5");
  });

  it("does not leak options of one profile into another", async () => {
    await routing.directionsGet({
      profile: "pedestrian",
      locations: TWO_LOCATIONS,
      profileOptions: { walkingSpeed: 4.5 },
    });

    const search = lastUrl().searchParams;

    expect(search.get("car.mode")).toBeNull();
    expect(search.get("topSpeed")).toBeNull();
    expect(search.get("truck.weight")).toBeNull();
  });

  it("keeps zero-valued options instead of dropping them", async () => {
    await routing.directionsGet({
      profile: "car",
      locations: TWO_LOCATIONS,
      profileOptions: { topSpeed: 0 },
      response: { alternates: 0 },
    });

    const search = lastUrl().searchParams;

    expect(search.get("topSpeed")).toBe("0");
    expect(search.get("alternates")).toBe("0");
  });

  it("adds id, departureTime and arrivalTime", async () => {
    await routing.directionsGet({
      profile: "car",
      locations: TWO_LOCATIONS,
      id: "my-request",
      departureTime: "2026-03-15T12:33",
      arrivalTime: "2026-03-15T18:00",
    });

    const search = lastUrl().searchParams;

    expect(search.get("id")).toBe("my-request");
    expect(search.get("departureTime")).toBe("2026-03-15T12:33");
    expect(search.get("arrivalTime")).toBe("2026-03-15T18:00");
  });
});

describe("routing geometry decoding", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("decodes Encoded Polyline leg geometry into [lon, lat] positions", async () => {
    mockResponse({
      route: {
        summary: {},
        legs: [{ summary: {}, geometry: ENCODED_GEOMETRY }],
      },
    });

    const result = await routing.directionsGet({
      profile: "car",
      locations: TWO_LOCATIONS,
    });

    const geometry = result.route.legs[0].geometry;

    expect(geometry).toHaveLength(16);
    expect(geometry[0]).toEqual(DECODED_FIRST_POINT);
    expect(geometry[15]).toEqual(DECODED_LAST_POINT);
  });

  it("decodes the geometry of alternate routes too", async () => {
    mockResponse({
      route: {
        summary: {},
        legs: [{ summary: {}, geometry: ENCODED_GEOMETRY }],
      },
      alternates: [
        { summary: {}, legs: [{ summary: {}, geometry: ENCODED_GEOMETRY }] },
      ],
    });

    const result = await routing.directionsPost({
      profile: "car",
      locations: TWO_LOCATIONS,
    });

    expect(result.alternates?.[0].legs[0].geometry[0]).toEqual(
      DECODED_FIRST_POINT,
    );
  });

  it("passes already-decoded geometry through untouched", async () => {
    const geometry = [
      [11, 12],
      [12, 23],
    ];

    mockResponse({
      route: { summary: {}, legs: [{ summary: {}, geometry }] },
    });

    const result = await routing.directionsPost({
      profile: "car",
      locations: TWO_LOCATIONS,
    });

    expect(result.route.legs[0].geometry).toEqual(geometry);
  });

  it("preserves the top-level response fields", async () => {
    mockResponse({
      id: "my-request",
      route: { summary: {}, legs: [] },
      attribution: "© MapTiler © OpenStreetMap contributors",
      units: "km",
      language: "cs",
    });

    const result = await routing.directionsGet({
      profile: "car",
      locations: TWO_LOCATIONS,
    });

    expect(result.id).toBe("my-request");
    expect(result.attribution).toBe(
      "© MapTiler © OpenStreetMap contributors",
    );
    expect(result.units).toBe("km");
    expect(result.language).toBe("cs");
  });
});

describe("routing error handling", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
  });

  it("surfaces the human-readable API error message", async () => {
    mockResponse(
      {
        code: "MT_MIN_LOCATIONS_LIMIT",
        message: "At least 2 locations are required",
        field: "locations",
      },
      false,
      400,
    );

    await expect(
      routing.directionsGet({ profile: "car", locations: TWO_LOCATIONS }),
    ).rejects.toThrow("At least 2 locations are required");
  });

  it("falls back to an empty message when the body has no message", async () => {
    mockResponse({ code: "INTERNAL_ERROR" }, false, 500);

    await expect(
      routing.directionsPost({ profile: "car", locations: TWO_LOCATIONS }),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("still throws a ServiceError when the error body is not JSON", async () => {
    (callFetch as Mock).mockResolvedValue({
      ok: false,
      status: 500,
      url: "https://api.maptiler.com/routing/v1/directions",
      json: () => Promise.reject(new SyntaxError("Unexpected token")),
    });

    await expect(
      routing.directionsPost({ profile: "car", locations: TWO_LOCATIONS }),
    ).rejects.toBeInstanceOf(ServiceError);
  });
});

describe("routing apiKey option", () => {
  beforeEach(() => {
    config.apiKey = "TEST_KEY";
    vi.clearAllMocks();
    mockResponse({ route: { summary: {}, legs: [] } });
  });

  it("uses the per-call apiKey over the global config in GET", async () => {
    await routing.directionsGet(
      { profile: "car", locations: TWO_LOCATIONS },
      { apiKey: "CALL_KEY" },
    );

    expect(lastUrl().searchParams.get("key")).toBe("CALL_KEY");
  });

  it("uses the per-call apiKey over the global config in POST", async () => {
    await routing.directionsPost(
      { profile: "car", locations: TWO_LOCATIONS },
      { apiKey: "CALL_KEY" },
    );

    expect(lastUrl().searchParams.get("key")).toBe("CALL_KEY");
  });
});
