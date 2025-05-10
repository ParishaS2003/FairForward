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

export const translations: TranslationsType = {
  en: enTranslations,
  es: esTranslations,
  ar: arTranslations
};

export default translations; 