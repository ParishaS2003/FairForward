import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, MessageCircle, MapPin, FileText, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="sgc-container py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full bg-white object-contain" />
            <span className="font-bold text-xl hidden sm:block text-sgc-neutral-dark">SafeGround</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink to="/" icon={<Home size={18} />} text="Home" />
            <NavLink to="/chat" icon={<MessageCircle size={18} />} text="LegalBot" />
            <NavLink to="/map" icon={<MapPin size={18} />} text="Safe Spaces" />
            <NavLink to="/report" icon={<FileText size={18} />} text="Report" />
            <NavLink to="/learn" icon={<BookOpen size={18} />} text="Learn" />
            
            <div className="pl-4 border-l border-border">
              <Button className="sgc-button-primary">
                Emergency
              </Button>
            </div>
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
            <MobileNavLink to="/" icon={<Home size={18} />} text="Home" onClick={toggleMenu} />
            <MobileNavLink to="/chat" icon={<MessageCircle size={18} />} text="LegalBot" onClick={toggleMenu} />
            <MobileNavLink to="/map" icon={<MapPin size={18} />} text="Safe Spaces" onClick={toggleMenu} />
            <MobileNavLink to="/report" icon={<FileText size={18} />} text="Report" onClick={toggleMenu} />
            <MobileNavLink to="/learn" icon={<BookOpen size={18} />} text="Learn" onClick={toggleMenu} />
            
            <div className="pt-4 border-t border-border">
              <Button className="w-full sgc-button-primary">
                Emergency
              </Button>
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
