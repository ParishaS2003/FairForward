import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, MessageCircle, MapPin, Users, LogOut, User, Book, Scale } from 'lucide-react';
import { Button } from './ui/button';
import EmergencyButton from './EmergencyButton';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from './ui/navigation-menu';
import { cn } from '@/lib/utils';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('user');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/app" icon={<Home size={18} />} text="Home" />
            <NavLink to="/chat" icon={<MessageCircle size={18} />} text="LegalBot" />
            <NavLink to="/map" icon={<MapPin size={18} />} text="Safe Spaces" />
            <NavLink to="/community" icon={<Users size={18} />} text="Community" />
            <NavLink to="/pro-bono-qualification" icon={<Scale size={18} />} text="Pro Bono Lawyers" />
            <NavLink to="/glossary" icon={<Book size={18} />} text="Legal Terms" />
            
            <div className="flex items-center space-x-6">
              <EmergencyButton />
              <div className="h-6 border-l border-gray-200" />
            {isAuthenticated && (
              <NavLink to="/account" icon={<User size={18} />} text="Account" />
            )}
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
            <MobileNavLink to="/app" icon={<Home size={18} />} text="Home" onClick={toggleMenu} />
            <MobileNavLink to="/chat" icon={<MessageCircle size={18} />} text="LegalBot" onClick={toggleMenu} />
            <MobileNavLink to="/map" icon={<MapPin size={18} />} text="Safe Spaces" onClick={toggleMenu} />
            <MobileNavLink to="/community" icon={<Users size={18} />} text="Community" onClick={toggleMenu} />
            <MobileNavLink to="/pro-bono-qualification" icon={<Scale size={18} />} text="Pro Bono Lawyers" onClick={toggleMenu} />
            <MobileNavLink to="/glossary" icon={<Book size={18} />} text="Legal Terms" onClick={toggleMenu} />
            {isAuthenticated && (
              <MobileNavLink to="/account" icon={<User size={18} />} text="Account" onClick={toggleMenu} />
            )}
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
