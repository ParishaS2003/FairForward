import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  to?: string;
  className?: string;
}

const BackButton = ({ to, className = '' }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`mb-4 hover:bg-gray-100 ${className}`}
      onClick={handleClick}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back
    </Button>
  );
};

export default BackButton; 