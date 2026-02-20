import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  profileComplete: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Decode JWT token to get user info (without verification for client-side)
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          setUser({ id: payload.userId, email: payload.email });
          setToken(storedToken);
        } catch (error) {
          // Invalid token, remove it
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      
      toast({ title: 'Welcome!', description: 'Account created successfully.' });
    } catch (error: any) {
      toast({ title: 'Error signing up', description: error.message });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      
      toast({ title: 'Signed in', description: 'Welcome back!' });
    } catch (error: any) {
      toast({ title: 'Invalid credentials', description: error.message });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast({ title: 'Signed out', description: 'You have been logged out.' });
  };

  const [profileComplete, setProfileComplete] = React.useState(false);

  React.useEffect(() => {
    const checkProfileComplete = async () => {
      if (!token) {
        setProfileComplete(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:4000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          setProfileComplete(false);
          return;
        }
        const profile = await response.json();
        const complete = profile.first_name && profile.last_name && profile.phone;
        setProfileComplete(!!complete);
      } catch {
        setProfileComplete(false);
      }
    };
    checkProfileComplete();
  }, [token]);

  const value = useMemo(() => ({ user, token, loading, profileComplete, signUp, signIn, signOut }), [user, token, loading, profileComplete]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
