import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface EmergencyButtonProps {
  className?: string;
}

const EmergencyButton = ({ className = '' }: EmergencyButtonProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/emergency');
  };

  return (
    <Button 
      size="sm"
      variant="destructive"
      className={`bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-3 py-1.5 h-8 ${className}`}
      onClick={handleClick}
    >
      <Shield className="w-4 h-4" />
      <span className="font-medium">Emergency</span>
    </Button>
  );
};

export default EmergencyButton; 