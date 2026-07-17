import { describe, it, expect, afterEach } from "vitest";

import { config } from "../src/config";

describe("config.useEuEndpoints()", () => {
  afterEach(() => {
    config.useEuEndpoints(false);
  });

  it("defaults to the .com host", () => {
    expect(config.isUsingEuEndpoints).toBe(false);
    expect(config.apiHost).toBe("api.maptiler.com");
    expect(config.apiURL).toBe("https://api.maptiler.com/");
  });

  it("switches to the .eu host when called with no argument", () => {
    config.useEuEndpoints();

    expect(config.isUsingEuEndpoints).toBe(true);
    expect(config.apiHost).toBe("api.maptiler.eu");
    expect(config.apiURL).toBe("https://api.maptiler.eu/");
  });

  it("switches to the .eu host when called with true", () => {
    config.useEuEndpoints(true);

    expect(config.isUsingEuEndpoints).toBe(true);
    expect(config.apiHost).toBe("api.maptiler.eu");
    expect(config.apiURL).toBe("https://api.maptiler.eu/");
  });

  it("switches back to the .com host when called with false", () => {
    config.useEuEndpoints(true);
    config.useEuEndpoints(false);

    expect(config.isUsingEuEndpoints).toBe(false);
    expect(config.apiHost).toBe("api.maptiler.com");
    expect(config.apiURL).toBe("https://api.maptiler.com/");
  });
});
