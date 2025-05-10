import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage, SUPPORTED_LANGUAGES } from '@/contexts/LanguageContext';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const { currentLanguage, setLanguage, translate } = useLanguage();

  const handleLanguageChange = (languageCode: string) => {
    const newLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
    if (newLanguage) {
      setLanguage(newLanguage);
    }
  };

  return (
    <Select
      value={currentLanguage.code}
      onValueChange={handleLanguageChange}
    >
      <SelectTrigger className={className}>
        <SelectValue>
          {currentLanguage.nativeName} ({currentLanguage.name})
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((language) => (
          <SelectItem
            key={language.code}
            value={language.code}
            className={`flex items-center justify-between ${
              language.direction === 'rtl' ? 'text-right' : 'text-left'
            }`}
          >
            <span>
              {language.nativeName} ({language.name})
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}; 