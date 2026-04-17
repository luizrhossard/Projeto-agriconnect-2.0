'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import api, { LoginRequest, RegisterRequest, UsuarioResponse } from '@/lib/api';

interface AuthContextType {
  user: UsuarioResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UsuarioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await api.auth.getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (!user && !isAuthPage) {
      router.push('/login');
    } else if (user && isAuthPage) {
      router.push('/');
    }
  }, [isLoading, user, pathname, router]);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      await api.auth.login(data);
      const currentUser = await api.auth.getCurrentUser();
      setUser(currentUser);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      await api.auth.register(data);
      const currentUser = await api.auth.getCurrentUser();
      setUser(currentUser);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.auth.logout().catch(() => {});
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
