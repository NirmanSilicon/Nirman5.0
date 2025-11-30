import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Language, LANGUAGES, initializeLanguage, setLanguage as setLangStore, getCurrentLanguage } from "@/utils/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  isLoading: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const lang = await initializeLanguage();
      setLanguageState(lang);
      setIsLoading(false);
    };
    init();
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setLangStore(lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export { LANGUAGES };
