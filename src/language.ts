/**
 * Languages. Note that not all the languages of this list are available but the compatibility list may be expanded in the future.
 */
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
  WELSH: "cy",
};

const languageCodeSet = new Set(Object.values(LanguageGeocoding));

type Values<T> = T[keyof T];

/**
 * Built-in languages values as strings
 */
type LanguageGeocodingString = Values<typeof LanguageGeocoding>;

function getAutoLanguageGeocoding(): LanguageGeocodingString {
  if (typeof navigator === "undefined") {
    return Intl.DateTimeFormat()
      .resolvedOptions()
      .locale.split("-")[0] as LanguageGeocodingString;
  }

  const canditatelangs = Array.from(
    new Set(navigator.languages.map((l) => l.split("-")[0])),
  ).filter((l) => languageCodeSet.has(l as LanguageGeocodingString));

  return canditatelangs.length
    ? (canditatelangs[0] as LanguageGeocodingString)
    : LanguageGeocoding.ENGLISH;
}

export { LanguageGeocoding, type LanguageGeocodingString, getAutoLanguageGeocoding };






type LanguageInfo = {
  /**
   * Two letter ISO code, such as `"en"` for English language.
   * Can be `null` if the language is a flag to be evaluated at runtime,
   * as it is the case for some "modes".
   */
  code: string | null,
  /**
   * The full OSM language flag, such as `"name:en"` for the English language.
   * Can also be a non-OSM flag if the language needs to be evaluated at runtime, such as `"auto"`,
   * as it is the case for some "modes".
   */
  flag: string,

  /**
   * English name of the language.
   */
  name: string,

  /**
   * English name in capital letters without whitespaces or special characters.
   */
  key: string,

  /**
   * Whether the language leverages only the latin charsets.
   */
  latin: boolean,

  /**
   * Some language descriptions corresponds to "modes" rather than to actual languages.
   * For instance the "visitor" mode consists in displaying bylingual labels.
   */
  isMode: boolean,
}

const VISITOR: LanguageInfo = { code: null, flag: "visitor", name: "Visitor", key: "VISITOR", latin: true, isMode: true };
const VISITOR_ENGLISH: LanguageInfo = { code: null, flag: "visitor_en", name: "Visitor English", key: "VISITOR_ENGLISH", latin: true, isMode: true };
const STYLE: LanguageInfo = { code: null, flag: "style", name: "Style", key: "STYLE", latin: false, isMode: true };
const AUTO: LanguageInfo = { code: null, flag: "auto", name: "Auto", key: "AUTO", latin: false, isMode: true };
const STYLE_LOCK: LanguageInfo = { code: null, flag: "style_lock", name: "Style Lock", key: "STYLE_LOCK", latin: false, isMode: true };
const LATIN: LanguageInfo = { code: "latin", flag: "name:latin", name: "Latin", key: "LATIN", latin: true, isMode: true };
const NON_LATIN: LanguageInfo = { code: "nonlatin", flag: "name:nonlatin", name: "Non Latin", key: "NON_LATIN", latin: false, isMode: true };
const LOCAL: LanguageInfo = { code: "", flag: "name", name: "Local", key: "LOCAL", latin: true, isMode: true };

const AMHARIC: LanguageInfo = { code: "am", flag: "name:am", name: "Amharic", key: "AMHARIC", latin: false, isMode: false };
const ARABIC: LanguageInfo = { code: "ar", flag: "name:ar", name: "Arabic", key: "ARABIC", latin: false, isMode: false };
const AZERBAIJANI: LanguageInfo = { code: "az", flag: "name:az", name: "Azerbaijani", key: "AZERBAIJANI", latin: true, isMode: false };
const BELARUSIAN: LanguageInfo = { code: "be", flag: "name:be", name: "Belarusian", key: "BELARUSIAN", latin: false, isMode: false };
const BULGARIAN: LanguageInfo = { code: "bg", flag: "bg", name: "Bulgarian", key: "BULGARIAN", latin: false, isMode: false };
const BENGALI: LanguageInfo = { code: "bn", flag: "name:bn", name: "Bengali", key: "BENGALI", latin: true, isMode: false };

// All the language infos as a list
const languageInfoList: LanguageInfo[] = [
  VISITOR,
  VISITOR_ENGLISH,
  STYLE,
  AUTO,
  STYLE_LOCK,
  LATIN,
  NON_LATIN,
  LOCAL,

  AMHARIC,
  ARABIC,
  AZERBAIJANI,
  BELARUSIAN,
  BULGARIAN,
  BENGALI,
] as const;

// All the language info as a map, where the key is the `key`
const languageInfoMap = new Map<string, LanguageInfo>();
for (const l of languageInfoList) {
  languageInfoMap.set(l.key, l);
}

// SDK-friendly struct of languages with keys being `key` and values being `flag`.
const Language = {
  VISITOR: "visitor",
  VISITOR_ENGLISH: "visitor_en",
  STYLE: "style",
  AUTO: "auto",
  STYLE_LOCK: "style_lock",
  LATIN: "name:latin",
  NON_LATIN: "name:nonlatin",
  LOCAL: "name",

  AMHARIC: "name:am",
  ARABIC: "name:ar",
  AZERBAIJANI: "name:az",
  BELARUSIAN: "name:be",
  BULGARIAN: "name:bg",
  BENGALI: "name:bn",
} as const;


/**
 * Get language infos from a provided language key.
 */
export function getLanguageInfo(languageKey: string): LanguageInfo | null {
  if (languageInfoMap.has(languageKey)) {
    return languageInfoMap.get(languageKey);
  }
  return null;
}

/**
 * Get the list of languages with the possibility to discard "modes".
 */
export function getlanguageList(
  options: { 
    /**
     * The languages that correspond to modes (rather than to actual languages)
     * will not be resturned if `true`.
     * Default: `false`
     */
    excludeModes?: boolean
  } = {}): LanguageInfo[] {
  const excludeModes = options.excludeModes ?? false;

  let tmpLanguageList = languageInfoList.slice();

  if (excludeModes) {
    tmpLanguageList = tmpLanguageList.filter((l) => !l.isMode);
  }

  return tmpLanguageList;
}


// const CountryLanguages: LanguageStruct[] = [
//   { code: "am", name: "Amharic", latin: false },
//   { code: "ar", name: "Arabic", latin: false },
//   { code: "az", name: "Azerbaijani", latin: true },
//   { code: "be", name: "Belarusian", latin: false },
//   { code: "bg", name: "Bulgarian", latin: false },
//   { code: "bn", name: "Bengali", latin: true },
//   { code: "br", name: "Breton", latin: true },
//   { code: "bs", name: "Bosnian", latin: true },
//   { code: "ca", name: "Catalan", latin: true },
//   { code: "co", name: "Corsican", latin: true },
//   { code: "cs", name: "Czech", latin: true },
//   { code: "cy", name: "Welsh", latin: true },
//   { code: "da", name: "Danish", latin: true },
//   { code: "de", name: "German", latin: true },
//   { code: "el", name: "Greek", latin: false },
//   { code: "en", name: "English", latin: true },
//   { code: "eo", name: "Esperanto", latin: true },
//   { code: "es", name: "Spanish", latin: true },
//   { code: "et", name: "Estonian", latin: true },
//   { code: "eu", name: "Basque", latin: true },
//   { code: "fi", name: "Finnish", latin: true },
//   { code: "fr", name: "French", latin: true },
//   { code: "fy", name: "Western Frisian", latin: true },
//   { code: "ga", name: "Irish", latin: true },
//   { code: "gd", name: "Scottish Gaelic", latin: true },
//   { code: "he", name: "Hebrew", latin: false },
//   { code: "hi", name: "Hindi", latin: false },
//   { code: "hr", name: "Croatian", latin: true },
//   { code: "hu", name: "Hungarian", latin: true },
//   { code: "hy", name: "Armenian", latin: false },
//   { code: "id", name: "Indonesian", latin: true },
//   { code: "is", name: "Icelandic", latin: true },
//   { code: "it", name: "Italian", latin: true },
//   { code: "ja", name: "Japanese", latin: false },
//   { code: "ja-Hira", name: "Japanese Hiragana form", latin: false },
//   { code: "ja-Latn", name: "Japanese (Latin 2018)", latin: true },
//   { code: "ja_kana", name: "Japanese (Kana)", latin: false },
//   { code: "ja_rm", name: "Japanese (Latin)", latin: true },
//   { code: "ka", name: "Georgian", latin: false },
//   { code: "kk", name: "Kazakh", latin: false },
//   { code: "kn", name: "Kannada", latin: false },
//   { code: "ko", name: "Korean", latin: false },
//   { code: "ko-Latn", name: "Korean (Latin)", latin: true },
//   { code: "ku", name: "Kurdish", latin: true },
//   { code: "la", name: "Latin", latin: true },
//   { code: "lb", name: "Luxembourgish", latin: true },
//   { code: "lt", name: "Lithuanian", latin: true },
//   { code: "lv", name: "Latvian", latin: true },
//   { code: "mk", name: "Macedonian", latin: false },
//   { code: "ml", name: "Malayalam", latin: false },
//   { code: "mt", name: "Maltese", latin: true },
//   { code: "nl", name: "Dutch", latin: true },
//   { code: "no", name: "Norwegian", latin: true },
//   { code: "oc", name: "Occitan", latin: true },
//   { code: "pl", name: "Polish", latin: true },
//   { code: "pt", name: "Portuguese", latin: true },
//   { code: "rm", name: "Romansh", latin: true },
//   { code: "ro", name: "Romania", latin: true },
//   { code: "ru", name: "Russian", latin: false },
//   { code: "sk", name: "Slovak", latin: true },
//   { code: "sl", name: "Slovene", latin: true },
//   { code: "sq", name: "Albanian", latin: true },
//   { code: "sr", name: "Serbian (Cyrillic)", latin: false },
//   { code: "sr-Latn", name: "Serbian (Latin)", latin: true },
//   { code: "sv", name: "Swedish", latin: true },
//   { code: "ta", name: "Tamil", latin: false },
//   { code: "te", name: "Telugu", latin: false },
//   { code: "th", name: "Thai", latin: false },
//   { code: "tr", name: "Turkish", latin: true },
//   { code: "uk", name: "Ukrainian", latin: false },
//   { code: "vi", name: "Vietnamese", latin: true },
//   { code: "zh", name: "Chinese", latin: false },
// ];

const Languages = [

]