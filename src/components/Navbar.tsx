import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, MessageCircle, MapPin, Users, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import EmergencyButton from './EmergencyButton';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('user');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="sgc-container py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="FairForward Logo" className="h-full w-full object-contain" />
            </div>
            <span className="font-bold text-xl hidden sm:block text-sgc-neutral-dark">FairForward</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink to="/app" icon={<Home size={18} />} text="Home" />
            <NavLink to="/chat" icon={<MessageCircle size={18} />} text="LegalBot" />
            <NavLink to="/map" icon={<MapPin size={18} />} text="Safe Spaces" />
            <NavLink to="/community" icon={<Users size={18} />} text="Community" />
            
            <div className="pl-4 border-l border-border">
              <EmergencyButton variant="navbar" />
            </div>
            {isAuthenticated && (
              <Button variant="outline" className="ml-4 flex items-center gap-2" onClick={handleSignOut}>
                <LogOut size={16} />
                Sign Out
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="p-2 rounded-md md:hidden text-sgc-neutral-dark focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border animate-fade-in-up">
          <div className="sgc-container py-4 space-y-4">
            <MobileNavLink to="/app" icon={<Home size={18} />} text="Home" onClick={toggleMenu} />
            <MobileNavLink to="/chat" icon={<MessageCircle size={18} />} text="LegalBot" onClick={toggleMenu} />
            <MobileNavLink to="/map" icon={<MapPin size={18} />} text="Safe Spaces" onClick={toggleMenu} />
            <MobileNavLink to="/community" icon={<Users size={18} />} text="Community" onClick={toggleMenu} />
            {isAuthenticated && (
              <Button variant="outline" className="w-full flex items-center gap-2 mt-2" onClick={() => { handleSignOut(); toggleMenu(); }}>
                <LogOut size={16} />
                Sign Out
              </Button>
            )}
            <div className="pt-4 border-t border-border">
              <EmergencyButton variant="inline" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) => (
  <Link 
    to={to} 
    className="flex items-center space-x-1 text-sgc-neutral hover:text-sgc-purple transition-colors"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

const MobileNavLink = ({ 
  to, 
  icon, 
  text, 
  onClick 
}: { 
  to: string; 
  icon: React.ReactNode; 
  text: string; 
  onClick: () => void 
}) => (
  <Link 
    to={to} 
    className="flex items-center space-x-3 p-3 rounded-md hover:bg-sgc-purple-light transition-colors"
    onClick={onClick}
  >
    <span className="text-sgc-purple">{icon}</span>
    <span className="font-medium text-sgc-neutral-dark">{text}</span>
  </Link>
);

export default Navbar;
