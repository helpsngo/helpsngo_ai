import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SupportedLanguage, LanguageOption } from '../types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from './translations';
import { 
  initGoogleTranslate, 
  applyGoogleTranslateLanguage, 
  getStoredLanguage 
} from '../services/googleTranslateService';

interface I18nContextType {
  language: SupportedLanguage;
  currentLanguage: LanguageOption;
  setLanguage: (lang: SupportedLanguage) => Promise<boolean>;
  t: (key: string, defaultText?: string) => string;
  languages: LanguageOption[];
  isTranslating: boolean;
}

const LANGUAGE_STORAGE_KEY = 'helps_ngo_preferred_language_v2';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = getStoredLanguage() as SupportedLanguage;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        return stored;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  // Mount Google Translate widget & sync initial language
  useEffect(() => {
    initGoogleTranslate();

    // Re-apply translation after Google Translate script loads if non-English
    if (language && language !== 'en') {
      const timer = setTimeout(() => {
        applyGoogleTranslateLanguage(language);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [language]);

  const setLanguage = useCallback(async (lang: SupportedLanguage): Promise<boolean> => {
    setLanguageState(lang);
    setIsTranslating(true);
    
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // ignore
    }

    const success = await applyGoogleTranslateLanguage(lang);
    
    // Allow brief time for Google Translate to mutate DOM text
    setTimeout(() => {
      setIsTranslating(false);
    }, 600);

    return success;
  }, []);

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Helper translation function for immediate string lookup if available, otherwise fallback
  const t = useCallback((key: string, defaultText?: string): string => {
    // Check if dictionary has key for current language
    const langDict = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary
    const fallbackDict = TRANSLATIONS.en;
    if (fallbackDict && fallbackDict[key]) {
      return fallbackDict[key];
    }
    return defaultText || key;
  }, [language]);

  return (
    <I18nContext.Provider
      value={{
        language,
        currentLanguage,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        isTranslating
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
