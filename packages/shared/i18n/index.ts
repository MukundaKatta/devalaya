import i18next from "i18next";
import en from "./en.json";
import hi from "./hi.json";
import te from "./te.json";
import ta from "./ta.json";
import kn from "./kn.json";

export const SUPPORTED_LANGUAGES = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  kn: "Kannada",
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export const resources = {
  en: { translation: en },
  hi: { translation: hi },
  te: { translation: te },
  ta: { translation: ta },
  kn: { translation: kn },
} as const;

export function createI18nInstance(defaultLanguage: SupportedLanguage = "en") {
  const instance = i18next.createInstance();

  instance.init({
    resources,
    lng: defaultLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

  return instance;
}

export const i18n = createI18nInstance();

export function getTranslation(
  key: string,
  language: SupportedLanguage = "en",
  params?: Record<string, string | number>
): string {
  return i18n.t(key, { lng: language, ...params });
}

export { en, hi, te, ta, kn };
