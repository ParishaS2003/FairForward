import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import ReportForm from "./components/ReportForm";
import LiteracyHub from "./components/LiteracyHub";
import Dashboard from "./components/Dashboard";
import LegalHelp from '@/pages/LegalHelp';
import Community from '@/pages/Community';
import EmergencyPage from '@/pages/EmergencyPage';
import Account from '@/pages/Account';
import { LanguageProvider } from '@/contexts/LanguageContext';

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
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
              <Route path="/report" element={<ReportForm />} />
              <Route path="/learn" element={<LiteracyHub />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/legal-help" element={<LegalHelp />} />
              <Route path="/community" element={<Community />} />
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
