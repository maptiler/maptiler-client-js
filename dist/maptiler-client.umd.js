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

  var Language = /* @__PURE__ */ ((Language2) => {
    Language2["LATIN"] = "latin";
    Language2["NON_LATIN"] = "nonlatin";
    Language2["LOCAL"] = "";
    Language2["AFAR"] = "aa";
    Language2["ABKHAZIAN"] = "ab";
    Language2["AVESTAN"] = "ae";
    Language2["AFRIKAANS"] = "af";
    Language2["AKAN"] = "ak";
    Language2["AMHARIC"] = "am";
    Language2["ARAGONESE"] = "an";
    Language2["ARABIC"] = "ar";
    Language2["ASSAMESE"] = "as";
    Language2["AVARIC"] = "av";
    Language2["AYMARA"] = "ay";
    Language2["AZERBAIJANI"] = "az";
    Language2["BASHKIR"] = "ba";
    Language2["BELARUSIAN"] = "be";
    Language2["BULGARIAN"] = "bg";
    Language2["BIHARI"] = "bh";
    Language2["BISLAMA"] = "bi";
    Language2["BAMBARA"] = "bm";
    Language2["BENGALI"] = "bn";
    Language2["TIBETAN"] = "bo";
    Language2["BRETON"] = "br";
    Language2["BOSNIAN"] = "bs";
    Language2["CATALAN"] = "ca";
    Language2["CHECHEN"] = "ce";
    Language2["CHAMORRO"] = "ch";
    Language2["CORSICAN"] = "co";
    Language2["CREE"] = "cr";
    Language2["CZECH"] = "cs";
    Language2["CHURCH_SLAVIC"] = "cu";
    Language2["CHUVASH"] = "cv";
    Language2["WELSH"] = "cy";
    Language2["DANISH"] = "da";
    Language2["GERMAN"] = "de";
    Language2["MALDIVIAN"] = "dv";
    Language2["DZONGKHA"] = "dz";
    Language2["EWE"] = "ee";
    Language2["GREEK"] = "el";
    Language2["ENGLISH"] = "en";
    Language2["ESPERANTO"] = "eo";
    Language2["SPANISH"] = "es";
    Language2["ESTONIAN"] = "et";
    Language2["BASQUE"] = "eu";
    Language2["PERSIAN"] = "fa";
    Language2["FULAH"] = "ff";
    Language2["FINNISH"] = "fi";
    Language2["FIJIAN"] = "fj";
    Language2["FAROESE"] = "fo";
    Language2["FRENCH"] = "fr";
    Language2["WESTERN_FRISIAN"] = "fy";
    Language2["IRISH"] = "ga";
    Language2["GAELIC"] = "gd";
    Language2["GALICIAN"] = "gl";
    Language2["GUARANI"] = "gn";
    Language2["GUJARATI"] = "gu";
    Language2["MANX"] = "gv";
    Language2["HAUSA"] = "ha";
    Language2["HEBREW"] = "he";
    Language2["HINDI"] = "hi";
    Language2["HIRI_MOTU"] = "ho";
    Language2["CROATIAN"] = "hr";
    Language2["HAITIAN"] = "ht";
    Language2["HUNGARIAN"] = "hu";
    Language2["ARMENIAN"] = "hy";
    Language2["HERERO"] = "hz";
    Language2["INTERLINGUA"] = "ia";
    Language2["INDONESIAN"] = "id";
    Language2["INTERLINGUE"] = "ie";
    Language2["IGBO"] = "ig";
    Language2["SICHUAN_YI"] = "ii";
    Language2["INUPIAQ"] = "ik";
    Language2["IDO"] = "io";
    Language2["ICELANDIC"] = "is";
    Language2["ITALIAN"] = "it";
    Language2["INUKTITUT"] = "iu";
    Language2["JAPANESE"] = "ja";
    Language2["JAVANESE"] = "jv";
    Language2["GEORGIAN"] = "ka";
    Language2["KONGO"] = "kg";
    Language2["KIKUYU"] = "ki";
    Language2["KUANYAMA"] = "kj";
    Language2["KAZAKH"] = "kk";
    Language2["KALAALLISUT"] = "kl";
    Language2["CENTRAL_KHMER"] = "km";
    Language2["KANNADA"] = "kn";
    Language2["KOREAN"] = "ko";
    Language2["KANURI"] = "kr";
    Language2["KASHMIRI"] = "ks";
    Language2["KURDISH"] = "ku";
    Language2["KOMI"] = "kv";
    Language2["CORNISH"] = "kw";
    Language2["KIRGHIZ"] = "ky";
    Language2["LUXEMBOURGISH"] = "lb";
    Language2["GANDA"] = "lg";
    Language2["LIMBURGAN"] = "li";
    Language2["LINGALA"] = "ln";
    Language2["LAO"] = "lo";
    Language2["LITHUANIAN"] = "lt";
    Language2["LUBA_KATANGA"] = "lu";
    Language2["LATVIAN"] = "lv";
    Language2["MALAGASY"] = "mg";
    Language2["MARSHALLESE"] = "mh";
    Language2["MAORI"] = "mi";
    Language2["MACEDONIAN"] = "mk";
    Language2["MALAYALAM"] = "ml";
    Language2["MONGOLIAN"] = "mn";
    Language2["MARATHI"] = "mr";
    Language2["MALAY"] = "ms";
    Language2["MALTESE"] = "mt";
    Language2["BURMESE"] = "my";
    Language2["NAURU"] = "na";
    Language2["NORWEGIAN"] = "no";
    Language2["NORTH_NDEBELE"] = "nd";
    Language2["NEPALI"] = "ne";
    Language2["NDONGA"] = "ng";
    Language2["DUTCH"] = "nl";
    Language2["SOUTH_NDEBELE"] = "nr";
    Language2["NAVAJO"] = "nv";
    Language2["CHICHEWA"] = "ny";
    Language2["OCCITAN"] = "oc";
    Language2["OJIBWA"] = "oj";
    Language2["OROMO"] = "om";
    Language2["ORIYA"] = "or";
    Language2["OSSETIC"] = "os";
    Language2["PANJABI"] = "pa";
    Language2["PALI"] = "pi";
    Language2["POLISH"] = "pl";
    Language2["PUSHTO"] = "ps";
    Language2["PORTUGUESE"] = "pt";
    Language2["QUECHUA"] = "qu";
    Language2["ROMANSH"] = "rm";
    Language2["RUNDI"] = "rn";
    Language2["ROMANIAN"] = "ro";
    Language2["RUSSIAN"] = "ru";
    Language2["KINYARWANDA"] = "rw";
    Language2["SANSKRIT"] = "sa";
    Language2["SARDINIAN"] = "sc";
    Language2["SINDHI"] = "sd";
    Language2["NORTHERN_SAMI"] = "se";
    Language2["SANGO"] = "sg";
    Language2["SINHALA"] = "si";
    Language2["SLOVAK"] = "sk";
    Language2["SLOVENIAN"] = "sl";
    Language2["SAMOAN"] = "sm";
    Language2["SHONA"] = "sn";
    Language2["SOMALI"] = "so";
    Language2["ALBANIAN"] = "sq";
    Language2["SERBIAN"] = "sr";
    Language2["SWATI"] = "ss";
    Language2["SOTHO_SOUTHERN"] = "st";
    Language2["SUNDANESE"] = "su";
    Language2["SWEDISH"] = "sv";
    Language2["SWAHILI"] = "sw";
    Language2["TAMIL"] = "ta";
    Language2["TELUGU"] = "te";
    Language2["TAJIK"] = "tg";
    Language2["THAI"] = "th";
    Language2["TIGRINYA"] = "ti";
    Language2["TURKMEN"] = "tk";
    Language2["TAGALOG"] = "tl";
    Language2["TSWANA"] = "tn";
    Language2["TONGA"] = "to";
    Language2["TURKISH"] = "tr";
    Language2["TSONGA"] = "ts";
    Language2["TATAR"] = "tt";
    Language2["TWI"] = "tw";
    Language2["TAHITIAN"] = "ty";
    Language2["UIGHUR"] = "ug";
    Language2["UKRAINIAN"] = "uk";
    Language2["URDU"] = "ur";
    Language2["UZBEK"] = "uz";
    Language2["VENDA"] = "ve";
    Language2["VIETNAMESE"] = "vi";
    Language2["VOLAPUK"] = "vo";
    Language2["WALLOON"] = "wa";
    Language2["WOLOF"] = "wo";
    Language2["XHOSA"] = "xh";
    Language2["YIDDISH"] = "yi";
    Language2["YORUBA"] = "yo";
    Language2["ZHUANG"] = "za";
    Language2["CHINESE"] = "zh";
    Language2["ZULU"] = "zu";
    return Language2;
  })(Language || {});

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
      const endpoint = new URL(
        `geocoding/${encodeURIComponent(query)}.json`,
        defaults.maptilerApiURL
      );
      endpoint.searchParams.set("key", config.apiKey);
      if ("bbox" in options) {
        endpoint.searchParams.set(
          "bbox",
          [
            options.bbox.southWest.lng,
            options.bbox.southWest.lat,
            options.bbox.northEast.lng,
            options.bbox.northEast.lat
          ].join(",")
        );
      }
      if ("proximity" in options) {
        endpoint.searchParams.set(
          "proximity",
          [options.proximity.lng, options.proximity.lat].join(",")
        );
      }
      if ("language" in options) {
        const languages = (Array.isArray(options.language) ? options.language : [options.language]).join(",");
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
    return __async$3(this, arguments, function* (lngLat, options = {}) {
      const endpoint = new URL(
        `geocoding/${lngLat.lng},${lngLat.lat}.json`,
        defaults.maptilerApiURL
      );
      endpoint.searchParams.set("key", config.apiKey);
      if ("bbox" in options) {
        endpoint.searchParams.set(
          "bbox",
          [
            options.bbox.southWest.lng,
            options.bbox.southWest.lat,
            options.bbox.northEast.lng,
            options.bbox.northEast.lat
          ].join(",")
        );
      }
      if ("proximity" in options) {
        endpoint.searchParams.set(
          "proximity",
          [options.proximity.lng, options.proximity.lat].join(",")
        );
      }
      if ("language" in options) {
        const languages = (Array.isArray(options.language) ? options.language : [options.language]).join(",");
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
    reverse
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
    return __async$2(this, null, function* () {
      const endpoint = new URL(`geolocation/ip.json`, defaults.maptilerApiURL);
      endpoint.searchParams.set("key", config.apiKey);
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
      const endpoint = new URL(
        `coordinates/search/${query}.json`,
        defaults.maptilerApiURL
      );
      endpoint.searchParams.set("key", config.apiKey);
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
    return __async$1(this, arguments, function* (coordinates2, options = {}) {
      const coordinatesStr = (Array.isArray(coordinates2) ? coordinates2 : [coordinates2]).map((coord) => `${coord.lng},${coord.lat}`).join(";");
      const endpoint = new URL(
        `coordinates/transform/${coordinatesStr}.json`,
        defaults.maptilerApiURL
      );
      endpoint.searchParams.set("key", config.apiKey);
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
  function get(dataId) {
    return __async(this, null, function* () {
      const endpoint = new URL(
        `data/${encodeURIComponent(dataId)}/features.json`,
        defaults.maptilerApiURL
      );
      endpoint.searchParams.set("key", config.apiKey);
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
    let str = `${marker.lng},${marker.lat}`;
    if (marker.color && includeColor) {
      str += `,${marker.color}`;
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
    var _a, _b, _c, _d, _e;
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
      `maps/${encodeURIComponent(style)}/static/${center.lng},${center.lat},${zoom}/${width}x${height}${scale}.${format}`,
      defaults.maptilerApiURL
    );
    if ("attribution" in options) {
      endpoint.searchParams.set("attribution", options.attribution.toString());
    }
    if ("marker" in options) {
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
      const markerList = Array.isArray(options.marker) ? options.marker : [options.marker];
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
    endpoint.searchParams.set("key", config.apiKey);
    return endpoint.toString();
  }
  function bounded(boundingBox, options = {}) {
    var _a, _b, _c, _d, _e;
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
      `maps/${encodeURIComponent(style)}/static/${boundingBox.southWest.lng},${boundingBox.southWest.lat},${boundingBox.northEast.lng},${boundingBox.northEast.lat}/${width}x${height}${scale}.${format}`,
      defaults.maptilerApiURL
    );
    if ("attribution" in options) {
      endpoint.searchParams.set("attribution", options.attribution.toString());
    }
    if ("padding" in options) {
      endpoint.searchParams.set("padding", options.padding.toString());
    }
    if ("marker" in options) {
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
      const markerList = Array.isArray(options.marker) ? options.marker : [options.marker];
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
    endpoint.searchParams.set("key", config.apiKey);
    return endpoint.toString();
  }
  function automatic(options = {}) {
    var _a, _b, _c, _d, _e;
    if (!("marker" in options) && !("path" in options)) {
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
    if ("marker" in options) {
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
      const markerList = Array.isArray(options.marker) ? options.marker : [options.marker];
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
    endpoint.searchParams.set("key", config.apiKey);
    return endpoint.toString();
  }
  const staticMaps = {
    centered,
    bounded,
    automatic
  };

  exports.ClientConfig = ClientConfig;
  exports.Language = Language;
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
