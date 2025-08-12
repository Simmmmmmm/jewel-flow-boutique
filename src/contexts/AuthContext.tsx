import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AuthUser {
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'auth_users';
const CURRENT_USER_KEY = 'auth_current_user';

type StoredUser = { email: string; password: string };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);

  // Load session on mount
  useEffect(() => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (email) setUser({ email });
  }, []);

  const getUsers = (): StoredUser[] => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch {
      return [];
    }
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const signUp = async (email: string, password: string) => {
    const users = getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      toast({ title: 'Account already exists', description: 'Try logging in instead.' });
      throw new Error('Account exists');
    }
    users.push({ email, password });
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, email);
    setUser({ email });
    toast({ title: 'Welcome!', description: 'Your account has been created.' });
  };

  const signIn = async (email: string, password: string) => {
    const users = getUsers();
    const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!match) {
      toast({ title: 'Invalid credentials', description: 'Please check your email and password.' });
      throw new Error('Invalid credentials');
    }
    localStorage.setItem(CURRENT_USER_KEY, email);
    setUser({ email });
    toast({ title: 'Signed in', description: 'Welcome back!' });
  };

  const signOut = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    toast({ title: 'Signed out', description: 'You have been logged out.' });
  };

  const value = useMemo(() => ({ user, signUp, signIn, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
