import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Index from './pages/Index';
import Login from './components/Login';
import Signup from './components/Signup';
import NotFound from './pages/NotFound';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LegalBot from "./components/LegalBot";
import SafeSpaces from "./components/SafeSpaces";
import Dashboard from "./components/Dashboard";
import LegalHelp from '@/pages/LegalHelp';
import Community from '@/pages/Community';
import EmergencyPage from '@/pages/EmergencyPage';
import Account from '@/pages/Account';
import GlossaryPage from '@/pages/Glossary';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ProBonoQualification from './pages/ProBonoQualification';
import ProBonoDirectory from './pages/ProBonoDirectory';
import NotQualifiedPage from './pages/NotQualifiedPage';
import Navbar from '@/components/Navbar';

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Layout component with conditional Navbar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col">
      {!isHomepage && !isAuthPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/emergency" element={<EmergencyPage />} />
                <Route 
                  path="/app/*" 
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/chat" element={<LegalBot />} />
                <Route path="/map" element={<SafeSpaces />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/legal-help" element={<LegalHelp />} />
                <Route path="/community" element={<Community />} />
                <Route path="/glossary" element={<GlossaryPage />} />
                <Route 
                  path="/account" 
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/pro-bono-qualification" element={<ProBonoQualification />} />
                <Route path="/pro-bono-directory" element={<ProBonoDirectory />} />
                <Route path="/not-qualified" element={<NotQualifiedPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
