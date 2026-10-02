import { describe, it, expect, afterEach } from "vitest";

import { config } from "../src/config";

describe("config.useEuEndpoints", () => {
  afterEach(() => {
    config.useEuEndpoints = false;
  });

  it("defaults to the .com host", () => {
    expect(config.useEuEndpoints).toBe(false);
    expect(config.apiHost).toBe("api.maptiler.com");
    expect(config.apiURL).toBe("https://api.maptiler.com/");
  });

  it("switches to the .eu host when set to true", () => {
    config.useEuEndpoints = true;

    expect(config.useEuEndpoints).toBe(true);
    expect(config.apiHost).toBe("api.maptiler.eu");
    expect(config.apiURL).toBe("https://api.maptiler.eu/");
  });

  it("switches back to the .com host when set to false", () => {
    config.useEuEndpoints = true;
    config.useEuEndpoints = false;

    expect(config.useEuEndpoints).toBe(false);
    expect(config.apiHost).toBe("api.maptiler.com");
    expect(config.apiURL).toBe("https://api.maptiler.com/");
  });
});
