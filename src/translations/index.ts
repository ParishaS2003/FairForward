import { Language } from '../contexts/LanguageContext';
import enTranslations from './en.json';
import esTranslations from './es.json';
import arTranslations from './ar.json';

type DeepStringRecord = {
  [key: string]: string | DeepStringRecord;
};

interface TranslationsType {
  [key: string]: DeepStringRecord;
}

// Create a default translation for missing languages
const createDefaultTranslation = (lang: string): DeepStringRecord => {
  return {
    app: {
      welcome: `Welcome to FairForward (${lang})`,
      description: "Your platform for legal support and safety resources",
      loading: "Loading...",
      error: "An error occurred",
      not_signed_in: "You are not signed in."
    },
    nav: {
      home: "Home",
      legal_help: "Legal Help",
      safe_spaces: "Safe Spaces",
      resources: "Resources",
      account: "Account",
      profile: "Profile",
      safety: "Safety",
      activity: "Activity"
    }
  };
};

// Get all supported language codes from LanguageContext
const supportedLanguages = ['en', 'es', 'ar', 'hi', 'zh', 'fr', 'ru', 'ur', 'bn', 'fa', 'vi', 'ko'];

// Create translations object with fallbacks for missing languages
export const translations: TranslationsType = {
  en: enTranslations,
  es: esTranslations,
  ar: arTranslations,
  // Add default translations for other supported languages
  ...Object.fromEntries(
    supportedLanguages
      .filter(lang => !['en', 'es', 'ar'].includes(lang))
      .map(lang => [lang, createDefaultTranslation(lang)])
  )
};

export default translations; 