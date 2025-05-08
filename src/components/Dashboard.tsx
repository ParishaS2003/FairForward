import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, MapPin, MessageCircle, FileText, BookOpen, Users, LogOut } from 'lucide-react';
import Navbar from './Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-sgc-neutral-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Welcome, {user.name || 'User'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-12 w-12 rounded-full bg-sgc-purple-light flex items-center justify-center">
                    <Users className="text-sgc-purple" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-sgc-neutral">{user.email}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center"
                  onClick={() => navigate('/chat')}
                >
                  <MessageCircle className="h-6 w-6 mb-2 text-sgc-purple" />
                  <span>LegalBot</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center"
                  onClick={() => navigate('/map')}
                >
                  <MapPin className="h-6 w-6 mb-2 text-sgc-purple" />
                  <span>Safe Spaces</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center"
                  onClick={() => navigate('/report')}
                >
                  <FileText className="h-6 w-6 mb-2 text-sgc-purple" />
                  <span>Report</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center"
                  onClick={() => navigate('/learn')}
                >
                  <BookOpen className="h-6 w-6 mb-2 text-sgc-purple" />
                  <span>Learn</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-sgc-purple-light flex items-center justify-center">
                    <Shield className="text-sgc-purple" />
                  </div>
                  <div>
                    <p className="font-medium">Welcome to FairForward</p>
                    <p className="text-sm text-sgc-neutral">Your account was created successfully</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 