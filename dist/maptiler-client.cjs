'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
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
    /**
     * MapTiler Cloud API key
     */
    __publicField$1(this, "_apiKey", "");
    /**
     * The fetch function. To be set if in Node < 18, otherwise
     * will be automatically resolved.
     */
    __publicField$1(this, "_fetch", tryGettingFetch());
  }
  /**
   * Set the MapTiler Cloud API key
   */
  set apiKey(k) {
    this._apiKey = k;
  }
  /**
   * Get the MapTiler Cloud API key
   */
  get apiKey() {
    return this._apiKey;
  }
  /**
   * Set a the custom fetch function to replace the default one
   */
  set fetch(f) {
    this._fetch = f;
  }
  /**
   * Get the fetch fucntion
   */
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

var __async$5 = (__this, __arguments, generator) => {
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
  return __async$5(this, arguments, function* (resource, options = {}) {
    if (config.fetch === null) {
      throw new Error(
        "The fetch function was not found. If on NodeJS < 18 please specify the fetch function with config.fetch"
      );
    }
    if (new URL(resource).searchParams.get("key").trim() === "") {
      throw new Error(
        "The MapTiler Cloud API key is missing. Set it in `config.apiKey` or get one for free at https://maptiler.com"
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
const customMessages$3 = {
  400: "Query too long / Invalid parameters",
  403: "Key is missing, invalid or restricted"
};
function addLanguageGeocodingOptions(searchParams, options) {
  if (options.language == void 0) {
    return;
  }
  const languages = Array.from(
    new Set(
      (Array.isArray(options.language) ? options.language : [options.language]).map(
        (lang) => lang === LanguageGeocoding.AUTO ? getAutoLanguageGeocoding() : lang
      )
    )
  ).join(",");
  searchParams.set("language", languages);
}
function addCommonForwardAndReverseGeocodingOptions(searchParams, options) {
  var _a;
  searchParams.set("key", (_a = options.apiKey) != null ? _a : config.apiKey);
  if (options.limit != void 0) {
    searchParams.set("limit", String(options.limit));
  }
  if (options.types != void 0) {
    searchParams.set("types", options.types.join(","));
  }
  addLanguageGeocodingOptions(searchParams, options);
}
function addForwardGeocodingOptions(searchParams, options) {
  addCommonForwardAndReverseGeocodingOptions(searchParams, options);
  if (options.bbox != void 0) {
    searchParams.set("bbox", options.bbox.join(","));
  }
  if (options.proximity != void 0) {
    searchParams.set("proximity", options.proximity.join(","));
  }
  if (options.country != void 0) {
    searchParams.set("country", options.country.join(","));
  }
  if (options.fuzzyMatch != void 0) {
    searchParams.set("fuzzyMatch", options.fuzzyMatch ? "true" : "false");
  }
  if (options.autocomplete != void 0) {
    searchParams.set("autocomplete", options.autocomplete ? "true" : "false");
  }
}
function forward(_0) {
  return __async$4(this, arguments, function* (query, options = {}) {
    var _a;
    if (typeof query !== "string" || query.trim().length === 0) {
      throw new Error("The query must be a non-empty string");
    }
    const endpoint = new URL(
      `geocoding/${encodeURIComponent(query)}.json`,
      defaults.maptilerApiURL
    );
    const { searchParams } = endpoint;
    addForwardGeocodingOptions(searchParams, options);
    const urlWithParams = endpoint.toString();
    const res = yield callFetch(urlWithParams);
    if (!res.ok) {
      throw new ServiceError(res, (_a = customMessages$3[res.status]) != null ? _a : "");
    }
    const obj = yield res.json();
    return obj;
  });
}
function reverse(_0) {
  return __async$4(this, arguments, function* (position, options = {}) {
    var _a;
    if (!Array.isArray(position) || position.length < 2) {
      throw new Error("The position must be an array of form [lng, lat].");
    }
    const endpoint = new URL(
      `geocoding/${position[0]},${position[1]}.json`,
      defaults.maptilerApiURL
    );
    addCommonForwardAndReverseGeocodingOptions(endpoint.searchParams, options);
    const urlWithParams = endpoint.toString();
    const res = yield callFetch(urlWithParams);
    if (!res.ok) {
      throw new ServiceError(res, (_a = customMessages$3[res.status]) != null ? _a : "");
    }
    const obj = yield res.json();
    return obj;
  });
}
function byId(_0) {
  return __async$4(this, arguments, function* (id, options = {}) {
    var _a;
    const endpoint = new URL(`geocoding/${id}.json`, defaults.maptilerApiURL);
    addLanguageGeocodingOptions(endpoint.searchParams, options);
    const urlWithParams = endpoint.toString();
    const res = yield callFetch(urlWithParams);
    if (!res.ok) {
      throw new ServiceError(res, (_a = customMessages$3[res.status]) != null ? _a : "");
    }
    const obj = yield res.json();
    return obj;
  });
}
function batch(_0) {
  return __async$4(this, arguments, function* (queries, options = {}) {
    var _a;
    if (!queries.length) {
      return [];
    }
    const joinedQuery = queries.map((query) => encodeURIComponent(query)).join(";");
    const endpoint = new URL(
      `geocoding/${joinedQuery}.json`,
      defaults.maptilerApiURL
    );
    const { searchParams } = endpoint;
    addForwardGeocodingOptions(searchParams, options);
    const urlWithParams = endpoint.toString();
    const res = yield callFetch(urlWithParams);
    if (!res.ok) {
      throw new ServiceError(res, (_a = customMessages$3[res.status]) != null ? _a : "");
    }
    const obj = yield res.json();
    return queries.length === 1 ? [obj] : obj;
  });
}
const geocoding = {
  forward,
  reverse,
  byId,
  batch,
  language: LanguageGeocoding
};

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
const customMessages$2 = {
  403: "Key is missing, invalid or restricted"
};
function info() {
  return __async$3(this, arguments, function* (options = {}) {
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
const customMessages$1 = {
  403: "Key is missing, invalid or restricted"
};
function search(_0) {
  return __async$2(this, arguments, function* (query, options = {}) {
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
  return __async$2(this, arguments, function* (positions, options = {}) {
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
const customMessages = {
  403: "Key is missing, invalid or restricted"
};
function get(_0) {
  return __async$1(this, arguments, function* (dataId, options = {}) {
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

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function expandMapStyle(style) {
  const maptilerDomainRegex = /^maptiler:\/\/(.*)/;
  let match;
  const trimmed = style.trim();
  let expandedStyle;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    expandedStyle = trimmed;
  } else if ((match = maptilerDomainRegex.exec(trimmed)) !== null) {
    expandedStyle = `https://api.maptiler.com/maps/${match[1]}/style.json`;
  } else {
    expandedStyle = `https://api.maptiler.com/maps/${trimmed}/style.json`;
  }
  return expandedStyle;
}
class MapStyleVariant {
  constructor(name, variantType, id, referenceStyle, description, imageURL) {
    this.name = name;
    this.variantType = variantType;
    this.id = id;
    this.referenceStyle = referenceStyle;
    this.description = description;
    this.imageURL = imageURL;
  }
  /**
   * Get the human-friendly name
   * @returns
   */
  getName() {
    return this.name;
  }
  getFullName() {
    return `${this.referenceStyle.getName()} ${this.name}`;
  }
  /**
   * Get the variant type (eg. "DEFAULT", "DARK", "PASTEL", etc.)
   * @returns
   */
  getType() {
    return this.variantType;
  }
  /**
   * Get the MapTiler Cloud id
   * @returns
   */
  getId() {
    return this.id;
  }
  /**
   * Get the human-friendly description
   */
  getDescription() {
    return this.description;
  }
  /**
   * Get the reference style this variant belongs to
   * @returns
   */
  getReferenceStyle() {
    return this.referenceStyle;
  }
  /**
   * Check if a variant of a given type exists for _this_ variants
   * (eg. if this is a "DARK", then we can check if there is a "LIGHT" variant of it)
   * @param variantType
   * @returns
   */
  hasVariant(variantType) {
    return this.referenceStyle.hasVariant(variantType);
  }
  /**
   * Retrieve the variant of a given type. If not found, will return the "DEFAULT" variant.
   * (eg. _this_ "DARK" variant does not have any "PASTEL" variant, then the "DEFAULT" is returned)
   * @param variantType
   * @returns
   */
  getVariant(variantType) {
    return this.referenceStyle.getVariant(variantType);
  }
  /**
   * Get all the variants for _this_ variants, except _this_ current one
   * @returns
   */
  getVariants() {
    return this.referenceStyle.getVariants().filter((v) => v !== this);
  }
  /**
   * Get the image URL that represent _this_ variant
   * @returns
   */
  getImageURL() {
    return this.imageURL;
  }
  /**
   * Get the style as usable by MapLibre, a string (URL) or a plain style description (StyleSpecification)
   * @returns
   */
  getExpandedStyleURL() {
    return expandMapStyle(this.getId());
  }
}
class ReferenceMapStyle {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    /**
     * Variants that belong to this reference style, key being the reference type
     */
    __publicField(this, "variants", {});
    /**
     * Variants that belong to this reference style, ordered by relevance
     */
    __publicField(this, "orderedVariants", []);
  }
  /**
   * Get the human-friendly name of this reference style
   * @returns
   */
  getName() {
    return this.name;
  }
  /**
   * Get the id of _this_ reference style
   * @returns
   */
  getId() {
    return this.id;
  }
  /**
   * Add a variant to _this_ reference style
   * @param v
   */
  addVariant(v) {
    this.variants[v.getType()] = v;
    this.orderedVariants.push(v);
  }
  /**
   * Check if a given variant type exists for this reference style
   * @param variantType
   * @returns
   */
  hasVariant(variantType) {
    return variantType in this.variants;
  }
  /**
   * Get a given variant. If the given type of variant does not exist for this reference style,
   * then the most relevant default variant is returned instead
   * @param variantType
   * @returns
   */
  getVariant(variantType) {
    return variantType in this.variants ? this.variants[variantType] : this.orderedVariants[0];
  }
  /**
   * Get the list of variants for this reference style
   * @returns
   */
  getVariants() {
    return Object.values(this.variants);
  }
  /**
   * Get the defualt variant for this reference style
   * @returns
   */
  getDefaultVariant() {
    return this.orderedVariants[0];
  }
}
const mapStylePresetList = [
  {
    referenceStyleID: "STREETS",
    name: "Streets",
    description: "",
    variants: [
      {
        id: "streets-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      },
      {
        id: "streets-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: ""
      },
      {
        id: "streets-v2-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: ""
      },
      {
        id: "streets-v2-night",
        name: "Night",
        variantType: "NIGHT",
        description: "",
        imageURL: ""
      },
      {
        id: "streets-v2-pastel",
        name: "Pastel",
        variantType: "PASTEL",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "OUTDOOR",
    name: "Outdoor",
    description: "",
    variants: [
      {
        id: "outdoor-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      },
      {
        id: "outdoor-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "WINTER",
    name: "Winter",
    description: "",
    variants: [
      {
        id: "winter-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      },
      {
        id: "winter-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "SATELLITE",
    name: "Satellite",
    description: "",
    variants: [
      {
        id: "satellite",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "HYBRID",
    name: "Hybrid",
    description: "",
    variants: [
      {
        id: "hybrid",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "BASIC",
    name: "Basic",
    description: "",
    variants: [
      {
        id: "basic-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      },
      {
        id: "basic-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: ""
      },
      {
        id: "basic-v2-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "BRIGHT",
    name: "Bright",
    description: "",
    variants: [
      {
        id: "bright-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      },
      {
        id: "bright-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: ""
      },
      {
        id: "bright-v2-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: ""
      },
      {
        id: "bright-v2-pastel",
        name: "Pastel",
        variantType: "PASTEL",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "OPENSTREETMAP",
    name: "OpenStreetMap",
    description: "",
    variants: [
      {
        id: "openstreetmap",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "TOPO",
    name: "Topo",
    description: "",
    variants: [
      {
        id: "topo-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      },
      {
        id: "topo-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: ""
      },
      {
        id: "topo-v2-shiny",
        name: "Shiny",
        variantType: "SHINY",
        description: "",
        imageURL: ""
      },
      {
        id: "topo-v2-pastel",
        name: "Pastel",
        variantType: "PASTEL",
        description: "",
        imageURL: ""
      },
      {
        id: "topo-v2-topographique",
        name: "Topographique",
        variantType: "TOPOGRAPHIQUE",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "VOYAGER",
    name: "Voyager",
    description: "",
    variants: [
      {
        id: "voyager-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      },
      {
        id: "voyager-v2-darkmatter",
        name: "Darkmatter",
        variantType: "DARK",
        description: "",
        imageURL: ""
      },
      {
        id: "voyager-v2-positron",
        name: "Positron",
        variantType: "LIGHT",
        description: "",
        imageURL: ""
      },
      {
        id: "voyager-v2-vintage",
        name: "Vintage",
        variantType: "VINTAGE",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "TONER",
    name: "Toner",
    description: "",
    variants: [
      {
        id: "toner-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      },
      {
        id: "toner-v2-background",
        name: "Background",
        variantType: "BACKGROUND",
        description: "",
        imageURL: ""
      },
      {
        id: "toner-v2-lite",
        name: "Lite",
        variantType: "LITE",
        description: "",
        imageURL: ""
      },
      {
        id: "toner-v2-lines",
        name: "Lines",
        variantType: "LINES",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "DATAVIZ",
    name: "Dataviz",
    description: "",
    variants: [
      {
        id: "dataviz",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      },
      {
        id: "dataviz-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: ""
      },
      {
        id: "dataviz-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "BACKDROP",
    name: "Backdrop",
    description: "",
    variants: [
      {
        id: "backdrop",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      },
      {
        id: "backdrop-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: ""
      },
      {
        id: "backdrop-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: ""
      }
    ]
  },
  {
    referenceStyleID: "OCEAN",
    name: "Ocean",
    description: "",
    variants: [
      {
        id: "ocean",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: ""
      }
    ]
  }
];
function makeReferenceStyleProxy(referenceStyle) {
  return new Proxy(referenceStyle, {
    get(target, prop, receiver) {
      if (target.hasVariant(prop)) {
        return target.getVariant(prop);
      }
      if (prop.toString().toUpperCase() === prop) {
        return referenceStyle.getDefaultVariant();
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
function buildMapStyles() {
  const mapStyle = {};
  for (let i = 0; i < mapStylePresetList.length; i += 1) {
    const refStyleInfo = mapStylePresetList[i];
    const refStyle = makeReferenceStyleProxy(
      new ReferenceMapStyle(refStyleInfo.name, refStyleInfo.referenceStyleID)
    );
    for (let j = 0; j < refStyleInfo.variants.length; j += 1) {
      const variantInfo = refStyleInfo.variants[j];
      const variant = new MapStyleVariant(
        variantInfo.name,
        // name
        variantInfo.variantType,
        // variantType
        variantInfo.id,
        // id
        refStyle,
        // referenceStyle
        variantInfo.description,
        variantInfo.imageURL
        // imageURL
      );
      refStyle.addVariant(variant);
    }
    mapStyle[refStyleInfo.referenceStyleID] = refStyle;
  }
  return mapStyle;
}
function styleToStyle(style) {
  if (!style) {
    return MapStyle[mapStylePresetList[0].referenceStyleID].getDefaultVariant().getId();
  }
  if (typeof style === "string" || style instanceof String) {
    return style.trim().toLowerCase();
  }
  if (style instanceof MapStyleVariant) {
    return style.getId();
  }
  if (style instanceof ReferenceMapStyle) {
    return style.getDefaultVariant().getId();
  }
}
const MapStyle = buildMapStyles();

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
  var _a, _b, _c, _d, _e;
  const style = styleToStyle(options.style);
  const scale = options.hiDPI ? "@2x" : "";
  const format = (_a = options.format) != null ? _a : "png";
  let width = ~~((_b = options.width) != null ? _b : 1024);
  let height = ~~((_c = options.height) != null ? _c : 1024);
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
    pathStr += `fill:${(_d = options.pathFillColor) != null ? _d : "none"}|`;
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
  endpoint.searchParams.set("key", (_e = options.apiKey) != null ? _e : config.apiKey);
  return endpoint.toString();
}
function bounded(boundingBox, options = {}) {
  var _a, _b, _c, _d, _e;
  const style = styleToStyle(options.style);
  const scale = options.hiDPI ? "@2x" : "";
  const format = (_a = options.format) != null ? _a : "png";
  let width = ~~((_b = options.width) != null ? _b : 1024);
  let height = ~~((_c = options.height) != null ? _c : 1024);
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
    pathStr += `fill:${(_d = options.pathFillColor) != null ? _d : "none"}|`;
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
  endpoint.searchParams.set("key", (_e = options.apiKey) != null ? _e : config.apiKey);
  return endpoint.toString();
}
function automatic(options = {}) {
  var _a, _b, _c, _d, _e;
  if (!("markers" in options) && !("path" in options)) {
    throw new Error(
      "Automatic static maps require markers and/or path to be created."
    );
  }
  const style = styleToStyle(options.style);
  const scale = options.hiDPI ? "@2x" : "";
  const format = (_a = options.format) != null ? _a : "png";
  let width = ~~((_b = options.width) != null ? _b : 1024);
  let height = ~~((_c = options.height) != null ? _c : 1024);
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
    pathStr += `fill:${(_d = options.pathFillColor) != null ? _d : "none"}|`;
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
  endpoint.searchParams.set("key", (_e = options.apiKey) != null ? _e : config.apiKey);
  return endpoint.toString();
}
const staticMaps = {
  centered,
  bounded,
  automatic
};

function d(n){return n*Math.PI/180}function _(n){return n%1!==0}var I={};function y(n,t){if(n<0||n>30)throw Error("Invalid zoom level");return _(n)?L(n,t):(I[t]===void 0&&(I[t]={}),Array.isArray(I[t][n])||(I[t][n]=L(n,t)),I[t][n])}function L(n,t){let r=t*Math.pow(2,n);return [r/360,r/(2*Math.PI),r/2,r]}function l(n,t,r=!1,u=512){let{min:o,max:e,sin:s,log:m,round:c}=Math,[a,p,A,i]=y(t,u),M=r?2:1,R=A,f=o(e(s(d(n[1])),-.9999),.9999),P=R+n[0]*a,b=R+.5*m((1+f)/(1-f))*-p;return _(t)||(P=c(P),b=c(b)),P>i*M&&(P=i*M),b>i&&(b=i),[P,b]}function g(n,t=512){let{floor:r}=Math,u=r(n[0]/t),o=r(n[1]/t);return [u,o]}function Z(n,t,r=512){let u=l(n,t,!1,r);return g(u,r)}function w(n,t,r=512){let[u,o,e]=t,s=l(n,u,!1,r),m=o*r,c=e*r;return [(s[0]-m)/r,(s[1]-c)/r]}

var __pow = Math.pow;
const earthRadius = 63710088e-1;
function mToFt(m) {
  return m * 3.28084;
}
function degToRad(degrees) {
  return degrees % 360 * Math.PI / 180;
}
function radToDeg(radians) {
  return radians * 180 / Math.PI;
}
function getZoomLevelResolution(latitude, zoom, tileSize = 512) {
  return Math.cos(latitude * Math.PI / 180) * 2 * Math.PI * 6378137 / (tileSize * __pow(2, zoom)) * 3;
}
function xyzToTileID(x, y, zoom) {
  return ((1 << zoom) * y + x) * 32 + zoom;
}

function area(area2) {
  const geometry = "geometry" in area2 ? area2.geometry : area2;
  const type = geometry.type;
  if (type === "MultiPolygon") {
    return multiPolygonArea(geometry.coordinates);
  }
  return polygonArea(geometry.coordinates);
}
function multiPolygonArea(multiPoly) {
  const coords = "coordinates" in multiPoly ? multiPoly.coordinates : multiPoly;
  let total = 0;
  for (const polygon of coords) {
    total += polygonArea(polygon);
  }
  return total;
}
function polygonArea(poly) {
  const coords = "coordinates" in poly ? poly.coordinates : poly;
  let total = 0;
  for (const ring of coords) {
    total += ringArea(ring);
  }
  return total;
}
function ringArea(coords) {
  let p1;
  let p2;
  let p3;
  let lowerIndex;
  let middleIndex;
  let upperIndex;
  let i;
  let total = 0;
  const coordsLength = coords.length;
  if (coordsLength > 2) {
    for (i = 0; i < coordsLength; i++) {
      if (i === coordsLength - 2) {
        lowerIndex = coordsLength - 2;
        middleIndex = coordsLength - 1;
        upperIndex = 0;
      } else if (i === coordsLength - 1) {
        lowerIndex = coordsLength - 1;
        middleIndex = 0;
        upperIndex = 1;
      } else {
        lowerIndex = i;
        middleIndex = i + 1;
        upperIndex = i + 2;
      }
      p1 = coords[lowerIndex];
      p2 = coords[middleIndex];
      p3 = coords[upperIndex];
      total += (degToRad(p3[0]) - degToRad(p1[0])) * Math.sin(degToRad(p2[1]));
    }
    total = total * earthRadius * earthRadius / 2;
  }
  return Math.abs(total);
}

function lineDistance(line) {
  const coordinates = "geometry" in line ? line.geometry.coordinates : "coordinates" in line ? line.coordinates : line;
  let distance = 0;
  let prevCoord;
  for (const coordinate of coordinates) {
    if (prevCoord !== void 0) {
      distance += pointDistance(prevCoord, coordinate);
    }
    prevCoord = coordinate;
  }
  return distance;
}
function pointDistance(from, to) {
  const { pow, sin, cos, sqrt, atan2 } = Math;
  const dLat = degToRad(to[1] - from[1]);
  const dLon = degToRad(to[0] - from[0]);
  const lat1 = degToRad(from[1]);
  const lat2 = degToRad(to[1]);
  const a = pow(sin(dLat / 2), 2) + pow(sin(dLon / 2), 2) * cos(lat1) * cos(lat2);
  return 2 * atan2(sqrt(a), sqrt(1 - a)) * earthRadius;
}

function tileCover(coordinates, zoom, tileSize) {
  const tileHash = /* @__PURE__ */ new Map();
  const tiles = [];
  const coords = [];
  const resolution = getZoomLevelResolution(coordinates[0][1], zoom, tileSize);
  const samples = sampleProfileLine(coordinates, resolution);
  for (const sample of samples) {
    const coordinate = sample;
    const [tileX, tileY] = Z(coordinate, zoom, tileSize);
    const id = xyzToTileID(tileX, tileY, zoom);
    const tile = { id, x: tileX, y: tileY, z: zoom };
    tileHash.set(id, tile);
    coords.push({ coordinate, tile });
  }
  for (const tile of tileHash.values())
    tiles.push(tile);
  return { coords, tiles };
}
function sampleProfileLine(coordinates, resolution) {
  const samples = [];
  let prevCoord;
  for (const coord of coordinates) {
    if (prevCoord !== void 0) {
      const dist = pointDistance(
        prevCoord,
        coord
      );
      const numSamples = Math.ceil(dist / resolution);
      for (let i = 0; i <= numSamples - 1; i++) {
        const sample = [
          prevCoord[0] + (coord[0] - prevCoord[0]) * (i / numSamples),
          prevCoord[1] + (coord[1] - prevCoord[1]) * (i / numSamples)
        ];
        samples.push(sample);
      }
    } else {
      samples.push(coord);
    }
    prevCoord = coord;
  }
  return samples;
}

function getElevation(coord, tile, tileSize, tileImage, elevationParser = defaultElevationParser) {
  const { channels, image } = tileImage;
  let [x, y] = w(coord, tile, tileSize);
  x = clampPixel(x, tileSize);
  y = clampPixel(y, tileSize);
  const index = (y * tileSize + x) * channels;
  return elevationParser(
    image[index],
    image[index + 1],
    image[index + 2],
    channels === 4 ? image[index + 3] : 0
  );
}
function clampPixel(n, tileSize) {
  return Math.max(0, Math.min(tileSize, Math.floor(n * tileSize)));
}
function defaultElevationParser(r, g, b) {
  return -1e4 + (r * 256 * 256 + g * 256 + b) * 0.1;
}

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
function profileLineString(path, options) {
  return __async(this, null, function* () {
    var _a, _b, _c;
    const coordinates = "geometry" in path ? path.geometry.coordinates : path.coordinates;
    const { coords, tiles } = tileCover(
      coordinates,
      (_a = options.zoom) != null ? _a : 13,
      (_b = options.tileSize) != null ? _b : 512
    );
    const tileCache = yield getTiles(tiles, options.tileRequest);
    let points = getElevations(
      coords,
      tileCache,
      (_c = options.tileSize) != null ? _c : 512,
      options.elevationParser
    );
    if (options.smooth === true)
      points = smoothElevation(points);
    let output = buildOutput(points);
    if (options.metric === "ft")
      output = toFeet(output);
    return output;
  });
}
function getTiles(tiles, tileRequest) {
  return __async(this, null, function* () {
    const tileCache = /* @__PURE__ */ new Map();
    const requests = [];
    for (const tile of tiles) {
      requests.push(
        tileRequest(tile.x, tile.y, tile.z).then((res) => {
          tileCache.set(tile.id, res);
          return res;
        }).catch((err) => {
          console.error(err);
          return void 0;
        })
      );
    }
    yield Promise.allSettled(requests);
    return tileCache;
  });
}
function getElevations(coords, tileCache, tileSize, elevationParser) {
  const points = [];
  let curDistance = 0;
  let prevCoord;
  for (const { tile, coordinate } of coords) {
    const cTile = tileCache.get(tile.id);
    if (cTile === void 0)
      throw new Error(
        `Missing tile ${tile.id} (${tile.x}-${tile.y}-${tile.z})`
      );
    const elevation = getElevation(
      coordinate,
      [tile.z, tile.x, tile.y],
      tileSize,
      cTile,
      elevationParser
    );
    points.push({
      distance: curDistance,
      elevation,
      coordinate,
      tile
    });
    if (prevCoord !== void 0) {
      curDistance += pointDistance(prevCoord, coordinate);
    }
    prevCoord = coordinate;
  }
  return points;
}
function buildOutput(points) {
  let minElevation = Infinity;
  let maxElevation = -Infinity;
  let totalElevation = 0;
  for (const point of points) {
    if (point.elevation < minElevation)
      minElevation = point.elevation;
    if (point.elevation > maxElevation)
      maxElevation = point.elevation;
    totalElevation += point.elevation;
  }
  return {
    distance: points[points.length - 1].distance,
    minElevation,
    maxElevation,
    avgElevation: totalElevation / points.length,
    startElevation: points[0].elevation,
    endElevation: points[points.length - 1].elevation,
    points
  };
}
function smoothElevation(points) {
  var _a;
  const newPoints = [];
  let prevPoint;
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const nextPoint = (_a = points[i + 1]) != null ? _a : points[i];
    if (prevPoint === void 0) {
      newPoints.push(point);
    } else {
      const newPoint = {
        distance: point.distance,
        elevation: (prevPoint.elevation + point.elevation + nextPoint.elevation) / 3,
        coordinate: point.coordinate,
        tile: point.tile
      };
      newPoints.push(newPoint);
    }
    prevPoint = point;
  }
  return newPoints;
}
function toFeet(input) {
  const output = {
    distance: mToFt(input.distance),
    minElevation: mToFt(input.minElevation),
    maxElevation: mToFt(input.maxElevation),
    avgElevation: mToFt(input.avgElevation),
    startElevation: mToFt(input.startElevation),
    endElevation: mToFt(input.endElevation),
    points: input.points.map(({ distance, elevation, coordinate, tile }) => ({
      distance: mToFt(distance),
      elevation: mToFt(elevation),
      coordinate,
      tile
    }))
  };
  return output;
}

exports.ClientConfig = ClientConfig;
exports.LanguageGeocoding = LanguageGeocoding;
exports.MapStyle = MapStyle;
exports.MapStyleVariant = MapStyleVariant;
exports.ReferenceMapStyle = ReferenceMapStyle;
exports.ServiceError = ServiceError;
exports.area = area;
exports.config = config;
exports.coordinates = coordinates;
exports.data = data;
exports.defaultElevationParser = defaultElevationParser;
exports.degToRad = degToRad;
exports.earthRadius = earthRadius;
exports.expandMapStyle = expandMapStyle;
exports.geocoding = geocoding;
exports.geolocation = geolocation;
exports.getZoomLevelResolution = getZoomLevelResolution;
exports.lineDistance = lineDistance;
exports.mToFt = mToFt;
exports.mapStylePresetList = mapStylePresetList;
exports.multiPolygonArea = multiPolygonArea;
exports.pointDistance = pointDistance;
exports.polygonArea = polygonArea;
exports.profileLineString = profileLineString;
exports.radToDeg = radToDeg;
exports.staticMaps = staticMaps;
exports.xyzToTileID = xyzToTileID;
//# sourceMappingURL=maptiler-client.cjs.map
