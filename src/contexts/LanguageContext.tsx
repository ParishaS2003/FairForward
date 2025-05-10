import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '@/translations';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  numberFormat: {
    decimal: string;
    thousand: string;
    precision: number;
  };
  calendar: 'gregory' | 'islamic-civil';
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: {
      decimal: '.',
      thousand: ',',
      precision: 2
    },
    calendar: 'gregory'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: ',',
      thousand: '.',
      precision: 2
    },
    calendar: 'gregory'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: '٫',
      thousand: '٬',
      precision: 2
    },
    calendar: 'islamic-civil'
  },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', dateFormat: 'MM/DD/YYYY', numberFormat: { decimal: '.', thousand: ',', precision: 2 }, calendar: 'gregory' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr', dateFormat: 'MM/DD/YYYY', numberFormat: { decimal: '.', thousand: ',', precision: 2 }, calendar: 'gregory' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', dateFormat: 'MM/DD/YYYY', numberFormat: { decimal: '.', thousand: ',', precision: 2 }, calendar: 'gregory' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', dateFormat: 'MM/DD/YYYY', numberFormat: { decimal: '.', thousand: ',', precision: 2 }, calendar: 'gregory' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl', dateFormat: 'MM/DD/YYYY', numberFormat: { decimal: '.', thousand: ',', precision: 2 }, calendar: 'gregory' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', dateFormat: 'MM/DD/YYYY', numberFormat: { decimal: '.', thousand: ',', precision: 2 }, calendar: 'gregory' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', direction: 'rtl', dateFormat: 'MM/DD/YYYY', numberFormat: { decimal: '.', thousand: ',', precision: 2 }, calendar: 'gregory' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', direction: 'ltr', dateFormat: 'MM/DD/YYYY', numberFormat: { decimal: '.', thousand: ',', precision: 2 }, calendar: 'gregory' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', dateFormat: 'MM/DD/YYYY', numberFormat: { decimal: '.', thousand: ',', precision: 2 }, calendar: 'gregory' }
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string, params?: Record<string, string>) => string;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
  formatDate: (date: Date) => string;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  return (
    SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang) ||
    SUPPORTED_LANGUAGES[0]
  );
};

const formatNumberForLocale = (
  number: number,
  locale: string,
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat(locale, options).format(number);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage);
      return language || getBrowserLanguage();
    }
    return getBrowserLanguage();
  });

  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLanguage.code);
    document.documentElement.dir = currentLanguage.direction;
    document.documentElement.lang = currentLanguage.code;
    document.body.setAttribute('dir', currentLanguage.direction);
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

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      calendar: currentLanguage.calendar
    };

    return new Intl.DateTimeFormat(currentLanguage.code, options).format(date);
  };

  const formatNumber = (number: number): string => {
    return formatNumberForLocale(number, currentLanguage.code, {
      minimumFractionDigits: currentLanguage.numberFormat.precision,
      maximumFractionDigits: currentLanguage.numberFormat.precision
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return formatNumberForLocale(amount, currentLanguage.code, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol'
    });
  };

  const value = {
    currentLanguage,
    setLanguage,
    translate,
    direction: currentLanguage.direction,
    isRTL: currentLanguage.direction === 'rtl',
    formatDate,
    formatNumber,
    formatCurrency
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 