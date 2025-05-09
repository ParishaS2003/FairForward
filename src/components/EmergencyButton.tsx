import React, { useState } from 'react';
import { Phone, Shield, X, AlertTriangle, MapPin, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface EmergencyButtonProps {
  variant?: 'navbar' | 'floating' | 'inline';
  className?: string;
}

const EmergencyButton = ({ variant = 'inline', className = '' }: EmergencyButtonProps) => {
  const [isSilentMode, setSilentMode] = useState(false);

  const handleEmergencyCall = () => {
    // In production, this would use a proper emergency calling service
    window.location.href = 'tel:911';
  };

  const handleSendLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // In production, this would send to emergency services
        console.log(`Location: ${latitude}, ${longitude}`);
      });
    }
  };

  const handleQuickExit = () => {
    // Redirect to a safe website
    window.location.href = 'https://weather.com';
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'navbar':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'floating':
        return 'fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg z-50';
      default:
        return 'bg-red-600 hover:bg-red-700 text-white w-full';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className={`${getButtonStyles()} ${className} animate-pulse-soft group relative`}
        >
          <Shield className="w-4 h-4 mr-2" />
          Emergency
          {variant === 'floating' && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Emergency Support
          </DialogTitle>
          <DialogDescription>
            Select the type of emergency assistance you need
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Button
            onClick={handleEmergencyCall}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Call Emergency Services (911)
          </Button>
          
          <Button
            onClick={handleSendLocation}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Share Location with Safe Space
          </Button>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setSilentMode(!isSilentMode)}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isSilentMode ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  Silent Mode On
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  Silent Mode Off
                </>
              )}
            </Button>
            
            <Button
              onClick={handleQuickExit}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 border-red-200 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
              Quick Exit
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p className="mb-2">
            If you're in immediate danger, please call emergency services directly.
          </p>
          <p>
            Your safety is our priority. All actions are logged for security purposes.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyButton; 