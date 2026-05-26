import { createContext, useContext, useState, type ReactNode } from 'react';
import api from '../api/client';
import type { AuthResponse } from '../types';

interface AuthContextValue {
  email: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem('email')
  );

  async function handleAuth(
    endpoint: 'login' | 'register',
    emailInput: string,
    password: string
  ) {
    const res = await api.post<AuthResponse>(`/auth/${endpoint}`, {
      email: emailInput,
      password,
    });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('email', res.data.email);
    setEmail(res.data.email);
  }

  const login = (e: string, p: string) => handleAuth('login', e, p);
  const register = (e: string, p: string) => handleAuth('register', e, p);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setEmail(null);
  }

  return (
    <AuthContext.Provider
      value={{ email, isAuthenticated: !!email, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}