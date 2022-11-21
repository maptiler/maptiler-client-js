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
    new Set(navigator.languages.map((l) => l.split("-")[0]))
  ).filter((l) => languageCodeSet.has(l as LanguageGeocodingString));

  return canditatelangs.length
    ? (canditatelangs[0] as LanguageGeocodingString)
    : LanguageGeocoding.ENGLISH;
}

export { LanguageGeocoding, LanguageGeocodingString, getAutoLanguageGeocoding };
