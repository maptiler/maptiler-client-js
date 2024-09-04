export type LanguageInfo = {
  /**
   * Two letter ISO code, such as `"en"` for English language.
   * Can be `null` if the language is a flag to be evaluated at runtime,
   * as it is the case for some "modes".
   */
  code: string | null;

  /**
   * The full OSM language flag, such as `"name:en"` for the English language.
   * Can also be a non-OSM flag if the language needs to be evaluated at runtime, such as `"auto"`,
   * as it is the case for some "modes".
   */
  flag: string;

  /**
   * English name of the language.
   */
  name: string;

  /**
   * Whether the language leverages only the latin charsets.
   */
  latin: boolean;

  /**
   * Some language descriptions corresponds to "modes" rather than to actual languages.
   * For instance the "visitor" mode consists in displaying bylingual labels.
   */
  isMode: boolean;

  /**
   * Whether the language is compatible with the geocoding API
   */
  geocoding: boolean;
};

/**
 * The complete list of languages
 */
export const Language = {
  /**
   * Language mode to display the labels in the end user's device language.
   */
  AUTO: {
    code: null,
    flag: "auto",
    name: "Auto",
    latin: false,
    isMode: true,
    geocoding: true,
  } as LanguageInfo,

  /**
   * The OSM language using latin script. MapTiler discourages its use as a primary language setting due to the lack of actual linguistic specificity,
   * though it can be an handy fallback. This is not to be confused with the "Classical Latin" language, which is available under the tag `.CLASSICAL_LATIN`.
   */
  LATIN: {
    code: "latin",
    flag: "name:latin",
    name: "Latin",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * The OSM language using non-latin script. MapTiler discourages its use as a primary language setting due to the lack of actual linguistic specificity,
   * though it can be an handy fallback.
   */
  NON_LATIN: {
    code: "nonlatin",
    flag: "name:nonlatin",
    name: "Non Latin",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Using the local language generaly (but not always) means that every labels of a given region will use the dominant local language.
   */
  LOCAL: {
    code: null,
    flag: "name",
    name: "Local",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Amharic language
   */
  AMHARIC: {
    code: "am",
    flag: "name:am",
    name: "Amharic",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Arabic language (right-to-left script)
   */
  ARABIC: {
    code: "ar",
    flag: "name:ar",
    name: "Arabic",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Azerbaijani language
   */
  AZERBAIJANI: {
    code: "az",
    flag: "name:az",
    name: "Azerbaijani",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Belarusian langauge
   */
  BELARUSIAN: {
    code: "be",
    flag: "name:be",
    name: "Belarusian",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Bulgarian language
   */
  BULGARIAN: {
    code: "bg",
    flag: "bg",
    name: "Bulgarian",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Bengali language
   */
  BENGALI: {
    code: "bn",
    flag: "name:bn",
    name: "Bengali",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Breton language
   */
  BRETON: {
    code: "br",
    flag: "name:br",
    name: "Breton",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Bosnian language
   */
  BOSNIAN: {
    code: "bs",
    flag: "name:bs",
    name: "Bosnian",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Catalan language
   */
  CATALAN: {
    code: "ca",
    flag: "name:ca",
    name: "Catalan",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Chinese language
   */
  CHINESE: {
    code: "zh",
    flag: "name:zh",
    name: "Chinese",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Traditional Chinese language
   */
  TRADITIONAL_CHINESE: {
    code: "zh-Hant",
    flag: "name:zh-Hant",
    name: "Chinese (traditional)",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Simplified Chinese language
   */
  SIMPLIFIED_CHINESE: {
    code: "zh-Hans",
    flag: "name:zh-Hans",
    name: "Chinese (simplified)",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Corsican language
   */
  CORSICAN: {
    code: "co",
    flag: "name:co",
    name: "Corsican",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Czech language
   */
  CZECH: {
    code: "cs",
    flag: "name:cs",
    name: "Czech",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Welsh language
   */
  WELSH: {
    code: "cy",
    flag: "name:cy",
    name: "WELSH",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Danish language
   */
  DANISH: {
    code: "da",
    flag: "name:da",
    name: "Danish",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * German language
   */
  GERMAN: {
    code: "de",
    flag: "name:de",
    name: "German",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Greek language
   */
  GREEK: {
    code: "el",
    flag: "name:el",
    name: "Greek",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * English language
   */
  ENGLISH: {
    code: "en",
    flag: "name:en",
    name: "English",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Esperanto language
   */
  ESPERANTO: {
    code: "eo",
    flag: "name:eo",
    name: "Esperanto",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Spanish language
   */
  SPANISH: {
    code: "es",
    flag: "name:es",
    name: "Spanish",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Estonian language
   */
  ESTONIAN: {
    code: "et",
    flag: "name:et",
    name: "Estonian",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Basque language
   */
  BASQUE: {
    code: "eu",
    flag: "name:eu",
    name: "Basque",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Finnish language
   */
  FINNISH: {
    code: "fi",
    flag: "name:fi",
    name: "Finnish",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * French language
   */
  FRENCH: {
    code: "fr",
    flag: "name:fr",
    name: "French",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Frisian language
   */
  FRISIAN: {
    code: "fy",
    flag: "name:fy",
    name: "Frisian (West)",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Irish language
   */
  IRISH: {
    code: "ga",
    flag: "name:ga",
    name: "Irish",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Scottish Gaelic language
   */
  SCOTTISH_GAELIC: {
    code: "gd",
    flag: "name:gd",
    name: "Scottish Gaelic",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Hebrew language (right-to-left non-latin script)
   */
  HEBREW: {
    code: "he",
    flag: "name:he",
    name: "Hebrew",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Hindi language
   */
  HINDI: {
    code: "hi",
    flag: "name:hi",
    name: "Hindi",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Croatian language
   */
  CROATIAN: {
    code: "hr",
    flag: "name:hr",
    name: "Croatian",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Hungarian language
   */
  HUNGARIAN: {
    code: "hu",
    flag: "name:hu",
    name: "Hungarian",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Armenian language
   */
  ARMENIAN: {
    code: "hy",
    flag: "name:hy",
    name: "Armenian",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Indonesian language
   */
  INDONESIAN: {
    code: "id",
    flag: "name:id",
    name: "Indonesian",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Icelandic language
   */
  ICELANDIC: {
    code: "is",
    flag: "name:is",
    name: "Icelandic",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Italian language
   */
  ITALIAN: {
    code: "it",
    flag: "name:it",
    name: "Italian",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Japanese language
   */
  JAPANESE: {
    code: "ja",
    flag: "name:ja",
    name: "Japanese",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Japanese language in Hiragana form
   */
  JAPANESE_HIRAGANA: {
    code: "ja-Hira",
    flag: "name:ja-Hira",
    name: "Japanese Hiragana form",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Japanese language (latin script)
   */
  JAPANESE_2018: {
    code: "ja-Latn",
    flag: "name:ja-Latn",
    name: "Japanese (Latin 2018)",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Japanese language in Kana form (non-latin script)
   */
  JAPANESE_KANA: {
    code: "ja_kana",
    flag: "name:ja_kana",
    name: "Japanese (Kana)",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Japanse language, romanized (latin script)
   */
  JAPANESE_LATIN: {
    code: "ja_rm",
    flag: "name:ja_rm",
    name: "Japanese (Latin script)",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Georgian language
   */
  GEORGIAN: {
    code: "ka",
    flag: "name:ka",
    name: "Georgian",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Kazakh language
   */
  KAZAKH: {
    code: "kk",
    flag: "name:kk",
    name: "Kazakh",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Kannada language
   */
  KANNADA: {
    code: "kn",
    flag: "name:kn",
    name: "Kannada",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Korean language
   */
  KOREAN: {
    code: "ko",
    flag: "name:ko",
    name: "Korean",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Korean language (latin script)
   */
  KOREAN_LATIN: {
    code: "ko-Latn",
    flag: "name:ko-Latn",
    name: "Korean (Latin script)",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Kurdish language
   */
  KURDISH: {
    code: "ku",
    flag: "name:ku",
    name: "Kurdish",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Classical Latin language
   */
  CLASSICAL_LATIN: {
    code: "la",
    flag: "name:la",
    name: "Latin",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Luxembourgish language
   */
  LUXEMBOURGISH: {
    code: "lb",
    flag: "name:lb",
    name: "Luxembourgish",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Lithuanian language
   */
  LITHUANIAN: {
    code: "lt",
    flag: "name:lt",
    name: "Lithuanian",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Latvian language
   */
  LATVIAN: {
    code: "lv",
    flag: "name:lv",
    name: "Latvian",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Macedonian language
   */
  MACEDONIAN: {
    code: "mk",
    flag: "name:mk",
    name: "Macedonian",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Malayalm language
   */
  MALAYALAM: {
    code: "ml",
    flag: "name:ml",
    name: "Malayalam",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Maltese language
   */
  MALTESE: {
    code: "mt",
    flag: "name:mt",
    name: "Maltese",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Dutch language
   */
  DUTCH: {
    code: "nl",
    flag: "name:nl",
    name: "Dutch",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Norwegian language
   */
  NORWEGIAN: {
    code: "no",
    flag: "name:no",
    name: "Norwegian",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Occitan language
   */
  OCCITAN: {
    code: "oc",
    flag: "name:oc",
    name: "Occitan",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Polish language
   */
  POLISH: {
    code: "pl",
    flag: "name:pl",
    name: "Polish",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Persian language
   */
  PERSIAN: {
    code: "fa",
    flag: "name:fa",
    name: "Persian",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Punjabi language
   */
  PUNJABI: {
    code: "pa",
    flag: "name:pa",
    name: "Punjabi",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Western Punjabi language
   */
  WESTERN_PUNJABI: {
    code: "pnb",
    flag: "name:pnb",
    name: "Western Punjabi",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Portuguese language
   */
  PORTUGUESE: {
    code: "pt",
    flag: "name:pt",
    name: "Portuguese",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Romansh language
   */
  ROMANSH: {
    code: "rm",
    flag: "name:rm",
    name: "Romansh",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Romanian language
   */
  ROMANIAN: {
    code: "ro",
    flag: "name:ro",
    name: "Romanian",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Russian language
   */
  RUSSIAN: {
    code: "ru",
    flag: "name:ru",
    name: "Russian",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Slovak language
   */
  SLOVAK: {
    code: "sk",
    flag: "name:sk",
    name: "Slovak",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Slovene language
   */
  SLOVENE: {
    code: "sl",
    flag: "name:sl",
    name: "Slovene",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Albanian language
   */
  ALBANIAN: {
    code: "sq",
    flag: "name:sq",
    name: "Albanian",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Serbian language (cyrillic script)
   */
  SERBIAN_CYRILLIC: {
    code: "sr",
    flag: "name:sr",
    name: "Serbian (Cyrillic script)",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Serbian language (latin script)
   */
  SERBIAN_LATIN: {
    code: "sr-Latn",
    flag: "name:sr-Latn",
    name: "Serbian (Latin script)",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Swedish language
   */
  SWEDISH: {
    code: "sv",
    flag: "name:sv",
    name: "Swedish",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Tamil language
   */
  TAMIL: {
    code: "ta",
    flag: "name:ta",
    name: "Tamil",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Telugu language
   */
  TELUGU: {
    code: "te",
    flag: "name:te",
    name: "Telugu",
    latin: false,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,

  /**
   * Thai language
   */
  THAI: {
    code: "th",
    flag: "name:th",
    name: "Thai",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Turkish language
   */
  TURKISH: {
    code: "tr",
    flag: "name:tr",
    name: "Turkish",
    latin: true,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Ukrainian language
   */
  UKRAINIAN: {
    code: "uk",
    flag: "name:uk",
    name: "Ukrainian",
    latin: false,
    isMode: false,
    geocoding: true,
  } as LanguageInfo,

  /**
   * Vietnamese language (latin script)
   */
  VIETNAMESE: {
    code: "vi",
    flag: "name:vi",
    name: "Vietnamese (Latin script)",
    latin: true,
    isMode: false,
    geocoding: false,
  } as LanguageInfo,
} as const;

/**
 * Get language infos from a provided language key, the key being the no-whitespace capital name.
 * By default, the language dictionnary to look into is the one defined in this library, but another one could be provided
 * Returns `null` if not found.
 */
export function getLanguageInfoFromKey(
  languageKey: string,
  languageDictionnary: { [k: string]: LanguageInfo } = Language,
): LanguageInfo | null {
  if (languageKey in languageDictionnary) {
    return languageKey[languageKey];
  }
  return null;
}

/**
 * Get the language info from a provided 2-character iso code.
 * By default, the language dictionnary to look into is the one defined in this library, but another one could be provided
 * Returns `null` if not found.
 */
export function getLanguageInfoFromCode(
  languageCode: string,
  languageDictionnary: { [k: string]: LanguageInfo } = Language,
): LanguageInfo | null {
  for (const lang of Object.values(languageDictionnary)) {
    if (lang.code === languageCode) {
      return lang;
    }
  }
  return null;
}

/**
 * Get the language info from a language flag (eg. `"name:en"`).
 * This is also handy to check is a given language flag is a supported language.
 * By default, the language dictionnary to look into is the one defined in this library, but another one could be provided
 * Returns `null` if not found.
 */
export function getLanguageInfoFromFlag(
  languageFlag: string,
  languageDictionnary: { [k: string]: LanguageInfo } = Language,
): LanguageInfo | null {
  for (const lang of Object.values(languageDictionnary)) {
    if (lang.flag === languageFlag) {
      return lang;
    }
  }
  return null;
}

/**
 * Get the default language of the device, as a LanguageInfo object.
 */
export function getAutoLanguage(): LanguageInfo {
  if (typeof navigator === "undefined") {
    const code = Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];
    const langInfo = getLanguageInfoFromCode(code);
    return langInfo ?? Language.ENGLISH;
  }

  const canditatelangs = Array.from(
    new Set(navigator.languages.map((l) => l.split("-")[0])),
  )
    .map((code) => getLanguageInfoFromCode(code))
    .filter((li) => li);

  return canditatelangs[0] ?? Language.ENGLISH;
}

export function isLanguageInfo(obj: unknown): obj is LanguageInfo {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "code" in obj &&
    "flag" in obj &&
    "name" in obj &&
    "latin" in obj &&
    "isMode" in obj &&
    "geocoding" in obj &&
    (typeof obj.code === "string" || obj.code === null) &&
    typeof obj.flag === "string" &&
    typeof obj.name === "string" &&
    typeof obj.latin === "boolean" &&
    typeof obj.isMode === "boolean" &&
    typeof obj.geocoding === "boolean"
  );
}

/**
 * By default, the language dictionnary to look into is the one defined in this library, but another one could be provided
 */
export function toLanguageInfo(
  lang: LanguageInfo | string,
  languageDictionnary: { [k: string]: LanguageInfo } = Language,
): LanguageInfo | null {
  // Could be directly an object of type LanguageInfo
  if (isLanguageInfo(lang)) {
    // Yet we want to make sure the provided languageInfo obj is not corrupted or incomplete,
    // so we ask for the equivalent original:
    return getLanguageInfoFromFlag(lang.flag, languageDictionnary); // possibly returns null, which is fine.
  }

  // If it's not even a string, then it does not represent a language
  if (typeof lang !== "string") {
    return null;
  }

  return (
    getLanguageInfoFromKey(lang, languageDictionnary) ||
    getLanguageInfoFromCode(lang, languageDictionnary) ||
    getLanguageInfoFromFlag(lang, languageDictionnary) ||
    null
  );
}

/**
 * Tells if two languages are the same, even though possibly provided under different forms.
 * Note: this is not comparing object references, but values.
 */
export function areSameLanguages(
  langA: string | LanguageInfo,
  langB: string | LanguageInfo,
  languageDictionnary: { [k: string]: LanguageInfo } = Language,
): boolean {
  const langAObj = toLanguageInfo(langA, languageDictionnary);
  const langBObj = toLanguageInfo(langB, languageDictionnary);

  return langAObj && langBObj && langAObj.flag === langBObj.flag;
}
