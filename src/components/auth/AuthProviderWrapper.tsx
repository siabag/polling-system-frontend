'use client';
import React from 'react';
import { AuthProvider } from '@/src/context/AuthContext';

export function AuthProviderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}