import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// 💡 Correctly import your JSON files
import en from "./locales/en.json"; 
import hi from "./locales/hi.json";

i18n
  .use(initReactI18next)
  .init({
    // Provide the translation files as resources
    resources: {
      en: { translation: en },
      hi: { translation: hi }
    },
    // Set the default language
    lng: "en",
    // Fallback if a specific key is missing in the current language
    fallbackLng: "en",
    // Prevents XSS attacks (usually kept as false for React)
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;