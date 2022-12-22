(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.maptilerclient = {}));
})(this, (function (exports) { 'use strict';

  function tryGettingFetch() {
    if (typeof self !== "undefined") {
      return fetch.bind(self);
    }
    if (typeof global !== "undefined" && global.fetch) {
      return global.fetch;
    }
    return null;
  }
  class ClientConfig {
    constructor() {
      this._apiKey = "Not defined yet.";
      this._fetch = tryGettingFetch();
    }
    set apiKey(k) {
      this._apiKey = k;
    }
    get apiKey() {
      return this._apiKey;
    }
    set fetch(f) {
      this._fetch = f;
    }
    get fetch() {
      return this._fetch;
    }
  }
  const config = new ClientConfig();

  const LanguageGeocoding = {
    AUTO: "auto",
    ALBANIAN: "sq",
    ARABIC: "ar",
    ARMENIAN: "hy",
    AZERBAIJANI: "az",
    BELORUSSIAN: "be",
    BOSNIAN: "bs",
    BRETON: "br",
    BULGARIAN: "bg",
    CATALAN: "ca",
    CHINESE: "zh",
    CROATIAN: "hr",
    CZECH: "cs",
    DANISH: "da",
    DUTCH: "nl",
    ENGLISH: "en",
    ESPERANTO: "eo",
    ESTONIAN: "et",
    FINNISH: "fi",
    FRENCH: "fr",
    FRISIAN: "fy",
    GEORGIAN: "ka",
    GERMAN: "de",
    GREEK: "el",
    HEBREW: "he",
    HUNGARIAN: "hu",
    ICELANDIC: "is",
    IRISH: "ga",
    ITALIAN: "it",
    JAPANESE: "ja",
    KANNADA: "kn",
    KAZAKH: "kk",
    KOREAN: "ko",
    ROMAN_LATIN: "la",
    LATVIAN: "lv",
    LITHUANIAN: "lt",
    LUXEMBOURGISH: "lb",
    MACEDONIAN: "mk",
    MALTESE: "mt",
    NORWEGIAN: "no",
    POLISH: "pl",
    PORTUGUESE: "pt",
    ROMANIAN: "ro",
    ROMANSH: "rm",
    RUSSIAN: "ru",
    SCOTTISH_GAELIC: "gd",
    SERBIAN_CYRILLIC: "sr",
    SLOVAK: "sk",
    SLOVENE: "sl",
    SPANISH: "es",
    SWEDISH: "sv",
    THAI: "th",
    TURKISH: "tr",
    UKRAINIAN: "uk",
    WELSH: "cy"
  };
  const languageCodeSet = new Set(Object.values(LanguageGeocoding));
  function getAutoLanguageGeocoding() {
    if (typeof navigator === "undefined") {
      return Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];
    }
    const canditatelangs = Array.from(
      new Set(navigator.languages.map((l) => l.split("-")[0]))
    ).filter((l) => languageCodeSet.has(l));
    return canditatelangs.length ? canditatelangs[0] : LanguageGeocoding.ENGLISH;
  }

  var __async$4 = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  function callFetch(_0) {
    return __async$4(this, arguments, function* (resource, options = {}) {
      if (config.fetch === null) {
        throw new Error(
          "The fetch function was not found. If on NodeJS < 18 please specify the fetch function with config.fetch"
        );
      }
      return config.fetch(resource, options);
    });
  }

  const defaults = {
    maptilerApiURL: "https://api.maptiler.com/",
    mapStyle: "streets-v2"
  };
  Object.freeze(defaults);

  class ServiceError extends Error {
    constructor(res, customMessage = "") {
      super(
        `Call to enpoint ${res.url} failed with the status code ${res.status}. ${customMessage}`
      );
      this.res = res;
    }
  }

  var __async$3 = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  const customMessages$3 = {
    400: "Query too long / Invalid parameters",
    403: "Key is missing, invalid or restricted"
  };
  function forward(_0) {
    return __async$3(this, arguments, function* (query, options = {}) {
      var _a;
      if (typeof query !== "string" || query.trim().length === 0) {
        throw new Error("The query must be a non-empty string");
      }
      const endpoint = new URL(
        `geocoding/${encodeURIComponent(query)}.json`,
        defaults.maptilerApiURL
      );
      endpoint.searchParams.set("key", (_a = options.apiKey) != null ? _a : config.apiKey);
      if ("bbox" in options) {
        endpoint.searchParams.set("bbox", options.bbox.join(","));
      }
      if ("proximity" in options) {
        endpoint.searchParams.set("proximity", options.proximity.join(","));
      }
      if ("language" in options) {
        const languages = Array.from(
          new Set(
            (Array.isArray(options.language) ? options.language : [options.language]).map(
              (lang) => lang === LanguageGeocoding.AUTO ? getAutoLanguageGeocoding() : lang
            )
          )
        ).join(",");
        endpoint.searchParams.set("language", languages);
      }
      const urlWithParams = endpoint.toString();
      const res = yield callFetch(urlWithParams);
      if (!res.ok) {
        throw new ServiceError(
          res,
          res.status in customMessages$3 ? customMessages$3[res.status] : ""
        );
      }
      const obj = yield res.json();
      return obj;
    });
  }
  function reverse(_0) {
    return __async$3(this, arguments, function* (position, options = {}) {
      var _a;
      if (!Array.isArray(position) || position.length < 2) {
        throw new Error("The position must be an array of form [lng, lat].");
      }
      const endpoint = new URL(
        `geocoding/${position[0]},${position[1]}.json`,
        defaults.maptilerApiURL
      );
      endpoint.searchParams.set("key", (_a = options.apiKey) != null ? _a : config.apiKey);
      if ("language" in options) {
        const languages = Array.from(
          new Set(
            (Array.isArray(options.language) ? options.language : [options.language]).map(
              (lang) => lang === LanguageGeocoding.AUTO ? getAutoLanguageGeocoding() : lang
            )
          )
        ).join(",");
        endpoint.searchParams.set("language", languages);
      }
      const urlWithParams = endpoint.toString();
      const res = yield callFetch(urlWithParams);
      if (!res.ok) {
        throw new ServiceError(
          res,
          res.status in customMessages$3 ? customMessages$3[res.status] : ""
        );
      }
      const obj = yield res.json();
      return obj;
    });
  }
  const geocoding = {
    forward,
    reverse,
    language: LanguageGeocoding
  };

  var __async$2 = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  const customMessages$2 = {
    403: "Key is missing, invalid or restricted"
  };
  function info() {
    return __async$2(this, arguments, function* (options = {}) {
      var _a;
      const endpoint = new URL(`geolocation/ip.json`, defaults.maptilerApiURL);
      endpoint.searchParams.set("key", (_a = options.apiKey) != null ? _a : config.apiKey);
      const urlWithParams = endpoint.toString();
      const res = yield callFetch(urlWithParams);
      if (!res.ok) {
        throw new ServiceError(
          res,
          res.status in customMessages$2 ? customMessages$2[res.status] : ""
        );
      }
      const obj = yield res.json();
      return obj;
    });
  }
  const geolocation = {
    info
  };

  var __async$1 = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  const customMessages$1 = {
    403: "Key is missing, invalid or restricted"
  };
  function search(_0) {
    return __async$1(this, arguments, function* (query, options = {}) {
      var _a;
      if (typeof query !== "string" || query.trim().length === 0) {
        throw new Error("The query must be a non-empty string");
      }
      const endpoint = new URL(
        `coordinates/search/${query}.json`,
        defaults.maptilerApiURL
      );
      endpoint.searchParams.set("key", (_a = options.apiKey) != null ? _a : config.apiKey);
      if ("limit" in options) {
        endpoint.searchParams.set("limit", options.limit.toString());
      }
      if ("transformations" in options) {
        endpoint.searchParams.set(
          "transformations",
          options.transformations.toString()
        );
      }
      if ("exports" in options) {
        endpoint.searchParams.set("exports", options.exports.toString());
      }
      const urlWithParams = endpoint.toString();
      const res = yield callFetch(urlWithParams);
      if (!res.ok) {
        throw new ServiceError(
          res,
          res.status in customMessages$1 ? customMessages$1[res.status] : ""
        );
      }
      const obj = yield res.json();
      return obj;
    });
  }
  function transform(_0) {
    return __async$1(this, arguments, function* (positions, options = {}) {
      var _a;
      const coordinatesStr = (Array.isArray(positions[0]) ? positions : [positions]).map((coord) => `${coord[0]},${coord[1]}`).join(";");
      const endpoint = new URL(
        `coordinates/transform/${coordinatesStr}.json`,
        defaults.maptilerApiURL
      );
      endpoint.searchParams.set("key", (_a = options.apiKey) != null ? _a : config.apiKey);
      if ("sourceCrs" in options) {
        endpoint.searchParams.set("s_srs", options.sourceCrs.toString());
      }
      if ("targetCrs" in options) {
        endpoint.searchParams.set("t_srs", options.targetCrs.toString());
      }
      if ("operations" in options) {
        endpoint.searchParams.set(
          "ops",
          (Array.isArray(options.operations) ? options.operations : [options.operations]).join("|")
        );
      }
      const urlWithParams = endpoint.toString();
      const res = yield callFetch(urlWithParams);
      if (!res.ok) {
        throw new ServiceError(
          res,
          res.status in customMessages$1 ? customMessages$1[res.status] : ""
        );
      }
      const obj = yield res.json();
      return obj;
    });
  }
  const coordinates = {
    search,
    transform
  };

  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  const customMessages = {
    403: "Key is missing, invalid or restricted"
  };
  function get(_0) {
    return __async(this, arguments, function* (dataId, options = {}) {
      var _a;
      if (typeof dataId !== "string" || dataId.trim().length === 0) {
        throw new Error("The data ID must be a non-empty string");
      }
      const endpoint = new URL(
        `data/${encodeURIComponent(dataId)}/features.json`,
        defaults.maptilerApiURL
      );
      endpoint.searchParams.set("key", (_a = options.apiKey) != null ? _a : config.apiKey);
      const urlWithParams = endpoint.toString();
      const res = yield callFetch(urlWithParams);
      if (!res.ok) {
        throw new ServiceError(
          res,
          res.status in customMessages ? customMessages[res.status] : ""
        );
      }
      const obj = yield res.json();
      return obj;
    });
  }
  const data = {
    get
  };

  function getSqSegDist(p, p1, p2) {
    let x = p1[0], y = p1[1], dx = p2[0] - x, dy = p2[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        x = p2[0];
        y = p2[1];
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }
    dx = p[0] - x;
    dy = p[1] - y;
    return dx * dx + dy * dy;
  }
  function simplifyDPStep(points, first, last, sqTolerance, simplified) {
    let maxSqDist = sqTolerance, index;
    for (let i = first + 1; i < last; i++) {
      const sqDist = getSqSegDist(points[i], points[first], points[last]);
      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }
    if (maxSqDist > sqTolerance) {
      if (index - first > 1) {
        simplifyDPStep(points, first, index, sqTolerance, simplified);
      }
      simplified.push(points[index]);
      if (last - index > 1) {
        simplifyDPStep(points, index, last, sqTolerance, simplified);
      }
    }
  }
  function simplifyDouglasPeucker(points, sqTolerance) {
    const last = points.length - 1;
    const simplified = [points[0]];
    simplifyDPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);
    return simplified;
  }
  function simplify(points, tolerance) {
    if (points.length <= 2) {
      return points;
    }
    const sqTolerance = tolerance !== void 0 ? tolerance * tolerance : 1;
    const simplePoints = simplifyDouglasPeucker(points, sqTolerance);
    return simplePoints;
  }

  function staticMapMarkerToString(marker, includeColor = true) {
    let str = `${marker[0]},${marker[1]}`;
    if (marker.length === 3 && includeColor) {
      str += `,${marker[2]}`;
    }
    return str;
  }
  function simplifyAndStringify(path, maxNbChar = 3e3) {
    let str = path.map((point) => point.join(",")).join("|");
    let tolerance = 5e-6;
    const toleranceStep = 1e-5;
    while (str.length > maxNbChar) {
      const simplerPath = simplify(path, tolerance);
      str = simplerPath.map((point) => `${point[0]},${point[1]}`).join("|");
      tolerance += toleranceStep;
    }
    return str;
  }
  function centered(center, zoom, options = {}) {
    var _a, _b, _c, _d, _e, _f;
    const style = (_a = options.style) != null ? _a : defaults.mapStyle;
    const scale = options.hiDPI ? "@2x" : "";
    const format = (_b = options.format) != null ? _b : "png";
    let width = ~~((_c = options.width) != null ? _c : 1024);
    let height = ~~((_d = options.height) != null ? _d : 1024);
    if (options.hiDPI) {
      width = ~~(width / 2);
      height = ~~(height / 2);
    }
    const endpoint = new URL(
      `maps/${encodeURIComponent(style)}/static/${center[0]},${center[1]},${zoom}/${width}x${height}${scale}.${format}`,
      defaults.maptilerApiURL
    );
    if ("attribution" in options) {
      endpoint.searchParams.set("attribution", options.attribution.toString());
    }
    if ("markers" in options) {
      let markerStr = "";
      const hasIcon = "markerIcon" in options;
      if (hasIcon) {
        markerStr += `icon:${options.markerIcon}|`;
      }
      if (hasIcon && "markerAnchor" in options) {
        markerStr += `anchor:${options.markerAnchor}|`;
      }
      if (hasIcon && options.hiDPI) {
        markerStr += `scale:2|`;
      }
      const markerList = Array.isArray(options.markers[0]) ? options.markers : [options.markers];
      markerStr += markerList.map((m) => staticMapMarkerToString(m, !hasIcon)).join("|");
      endpoint.searchParams.set("markers", markerStr);
    }
    if ("path" in options) {
      let pathStr = "";
      pathStr += `fill:${(_e = options.pathFillColor) != null ? _e : "none"}|`;
      if ("pathStrokeColor" in options) {
        pathStr += `stroke:${options.pathStrokeColor}|`;
      }
      if ("pathWidth" in options) {
        const pathWidth = options.pathWidth / (options.hiDPI ? 2 : 1);
        pathStr += `width:${pathWidth.toString()}|`;
      }
      pathStr += simplifyAndStringify(options.path);
      endpoint.searchParams.set("path", pathStr);
    }
    endpoint.searchParams.set("key", (_f = options.apiKey) != null ? _f : config.apiKey);
    return endpoint.toString();
  }
  function bounded(boundingBox, options = {}) {
    var _a, _b, _c, _d, _e, _f;
    const style = (_a = options.style) != null ? _a : defaults.mapStyle;
    const scale = options.hiDPI ? "@2x" : "";
    const format = (_b = options.format) != null ? _b : "png";
    let width = ~~((_c = options.width) != null ? _c : 1024);
    let height = ~~((_d = options.height) != null ? _d : 1024);
    if (options.hiDPI) {
      width = ~~(width / 2);
      height = ~~(height / 2);
    }
    const endpoint = new URL(
      `maps/${encodeURIComponent(style)}/static/${boundingBox[0]},${boundingBox[1]},${boundingBox[2]},${boundingBox[3]}/${width}x${height}${scale}.${format}`,
      defaults.maptilerApiURL
    );
    if ("attribution" in options) {
      endpoint.searchParams.set("attribution", options.attribution.toString());
    }
    if ("padding" in options) {
      endpoint.searchParams.set("padding", options.padding.toString());
    }
    if ("markers" in options) {
      let markerStr = "";
      const hasIcon = "markerIcon" in options;
      if (hasIcon) {
        markerStr += `icon:${options.markerIcon}|`;
      }
      if (hasIcon && "markerAnchor" in options) {
        markerStr += `anchor:${options.markerAnchor}|`;
      }
      if (hasIcon && options.hiDPI) {
        markerStr += `scale:2|`;
      }
      const markerList = Array.isArray(options.markers[0]) ? options.markers : [options.markers];
      markerStr += markerList.map((m) => staticMapMarkerToString(m, !hasIcon)).join("|");
      endpoint.searchParams.set("markers", markerStr);
    }
    if ("path" in options) {
      let pathStr = "";
      pathStr += `fill:${(_e = options.pathFillColor) != null ? _e : "none"}|`;
      if ("pathStrokeColor" in options) {
        pathStr += `stroke:${options.pathStrokeColor}|`;
      }
      if ("pathWidth" in options) {
        const pathWidth = options.pathWidth / (options.hiDPI ? 2 : 1);
        pathStr += `width:${pathWidth.toString()}|`;
      }
      pathStr += simplifyAndStringify(options.path);
      endpoint.searchParams.set("path", pathStr);
    }
    endpoint.searchParams.set("key", (_f = options.apiKey) != null ? _f : config.apiKey);
    return endpoint.toString();
  }
  function automatic(options = {}) {
    var _a, _b, _c, _d, _e, _f;
    if (!("markers" in options) && !("path" in options)) {
      throw new Error(
        "Automatic static maps require markers and/or path to be created."
      );
    }
    const style = (_a = options.style) != null ? _a : defaults.mapStyle;
    const scale = options.hiDPI ? "@2x" : "";
    const format = (_b = options.format) != null ? _b : "png";
    let width = ~~((_c = options.width) != null ? _c : 1024);
    let height = ~~((_d = options.height) != null ? _d : 1024);
    if (options.hiDPI) {
      width = ~~(width / 2);
      height = ~~(height / 2);
    }
    const endpoint = new URL(
      `maps/${encodeURIComponent(
      style
    )}/static/auto/${width}x${height}${scale}.${format}`,
      defaults.maptilerApiURL
    );
    if ("attribution" in options) {
      endpoint.searchParams.set("attribution", options.attribution.toString());
    }
    if ("padding" in options) {
      endpoint.searchParams.set("padding", options.padding.toString());
    }
    if ("markers" in options) {
      let markerStr = "";
      const hasIcon = "markerIcon" in options;
      if (hasIcon) {
        markerStr += `icon:${options.markerIcon}|`;
      }
      if (hasIcon && "markerAnchor" in options) {
        markerStr += `anchor:${options.markerAnchor}|`;
      }
      if (hasIcon && options.hiDPI) {
        markerStr += `scale:2|`;
      }
      const markerList = Array.isArray(options.markers[0]) ? options.markers : [options.markers];
      markerStr += markerList.map((m) => staticMapMarkerToString(m, !hasIcon)).join("|");
      endpoint.searchParams.set("markers", markerStr);
    }
    if ("path" in options) {
      let pathStr = "";
      pathStr += `fill:${(_e = options.pathFillColor) != null ? _e : "none"}|`;
      if ("pathStrokeColor" in options) {
        pathStr += `stroke:${options.pathStrokeColor}|`;
      }
      if ("pathWidth" in options) {
        const pathWidth = options.pathWidth / (options.hiDPI ? 2 : 1);
        pathStr += `width:${pathWidth.toString()}|`;
      }
      pathStr += simplifyAndStringify(options.path);
      endpoint.searchParams.set("path", pathStr);
    }
    endpoint.searchParams.set("key", (_f = options.apiKey) != null ? _f : config.apiKey);
    return endpoint.toString();
  }
  const staticMaps = {
    centered,
    bounded,
    automatic
  };

  exports.ClientConfig = ClientConfig;
  exports.LanguageGeocoding = LanguageGeocoding;
  exports.ServiceError = ServiceError;
  exports.config = config;
  exports.coordinates = coordinates;
  exports.data = data;
  exports.geocoding = geocoding;
  exports.geolocation = geolocation;
  exports.staticMaps = staticMaps;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=maptiler-client.umd.js.map
