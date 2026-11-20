import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api, getStoredToken, setStoredToken, clearStoredToken } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    college?: string;
    degree?: string;
    branch?: string;
    graduationYear?: string;
  }) => Promise<void>;
  logout: () => void;
  demoLogin: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const stored = getStoredToken();
      if (!stored) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.auth.me();
        setUser(res.user);
      } catch (err) {
        console.warn('Session expired, clearing token:', err);
        clearStoredToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({ email, password: pass });
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    college?: string;
    degree?: string;
    branch?: string;
    graduationYear?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(data);
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  };

  const demoLogin = async () => {
    await login('alex.chen@university.edu', 'DemoPass123!');
  };

  const updateUser = async (updates: Partial<User>) => {
    const res = await api.auth.updateProfile(updates);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        demoLogin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
