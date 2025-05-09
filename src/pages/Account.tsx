import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sgc-neutral-light">
        <Card className="max-w-md w-full p-8 text-center">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sgc-neutral mb-4">You are not signed in.</p>
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use placeholders if name or email is missing
  const displayName = user.name || 'No Name';
  const displayEmail = user.email || 'No Email';

  return (
    <div className="min-h-screen flex items-center justify-center bg-sgc-neutral-light">
      <Card className="max-w-md w-full p-8">
        <CardHeader className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-sgc-purple-light flex items-center justify-center mb-4">
            <User size={32} className="text-sgc-purple" />
          </div>
          <CardTitle className="text-2xl">Account</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <div className="font-semibold text-lg">{displayName}</div>
            <div className="text-sgc-neutral">{displayEmail}</div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <Button variant="outline" className="gap-2" onClick={() => { localStorage.removeItem('user'); navigate('/'); }}>
            <LogOut size={18} /> Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Account; 