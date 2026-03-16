import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "@devalaya/shared/i18n";
import * as SecureStore from "expo-secure-store";

const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const savedLang = await SecureStore.getItemAsync("user-language");
      if (savedLang) {
        callback(savedLang);
        return;
      }
    } catch {
      // fallback
    }
    callback("en");
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await SecureStore.setItemAsync("user-language", lng);
    } catch {
      // ignore
    }
  },
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: "v4",
  });

export default i18next;
