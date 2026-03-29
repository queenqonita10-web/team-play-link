import React, { createContext, useContext, useState, useCallback } from "react";
import { en } from "./en";
import { id } from "./id";

type Language = "en" | "id";

// Use a generic structure instead of literal types
type TranslationStrings = {
  [section: string]: {
    [key: string]: string;
  };
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const translations: Record<Language, TranslationStrings> = { en, id };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("fg-lang");
    return (saved === "en" || saved === "id") ? saved : "id";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("fg-lang", lang);
  }, []);

  const t = translations[language] as typeof en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
