import React from 'react';
import { useNavigate } from 'react-router-dom';
import LegalGlossary from '@/components/LegalGlossary';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const GlossaryPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('user') !== null;

  const handleBack = () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 hover:bg-gray-100"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {translate('button.back')}
        </Button>
      </div>
      <LegalGlossary />
    </div>
  );
};

export default GlossaryPage; 