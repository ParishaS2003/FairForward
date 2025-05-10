import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../translations/en.json';
import esTranslations from '../translations/es.json';
import arTranslations from '../translations/ar.json';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', direction: 'rtl' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', direction: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr' }
];

const translations: Record<string, any> = {
  en: enTranslations,
  es: esTranslations,
  ar: arTranslations
};

type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string, params?: Record<string, string>) => string;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage);
      return language || SUPPORTED_LANGUAGES[0];
    }
    return SUPPORTED_LANGUAGES[0];
  });

  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLanguage.code);
    document.documentElement.dir = currentLanguage.direction;
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const translate = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let translation: any = translations[currentLanguage.code];
    
    // Traverse the nested keys
    for (const k of keys) {
      translation = translation?.[k];
      if (!translation) break;
    }

    // Fallback to English if translation not found
    if (!translation) {
      translation = translations.en;
      for (const k of keys) {
        translation = translation?.[k];
        if (!translation) break;
      }
    }

    // Return the key itself if no translation found
    if (!translation) {
      console.warn(`Translation not found for key: ${key} in language: ${currentLanguage.code}`);
      return key;
    }

    // Replace parameters if they exist
    if (params) {
      return Object.entries(params).reduce(
        (text, [param, value]) => text.replace(`{${param}}`, value),
        translation
      );
    }

    return translation;
  };

  const value = {
    currentLanguage,
    setLanguage,
    translate,
    direction: currentLanguage.direction,
    isRTL: currentLanguage.direction === 'rtl'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 