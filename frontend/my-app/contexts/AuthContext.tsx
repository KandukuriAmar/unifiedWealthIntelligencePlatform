'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { UserSession } from '@/lib/auth-actions';

interface AuthContextType {
  user: UserSession | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: UserSession | null;
}) {
  return (
    <AuthContext.Provider value={{ user: initialUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
