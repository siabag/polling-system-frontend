'use client';
import React from 'react';
import { AuthProvider } from '@/src/context/AuthContext';
// Importaciones de MUI añadidas:
import { ThemeProvider } from '@mui/material/styles'; 
import CssBaseline from '@mui/material/CssBaseline';
import customTheme from '@/src/theme/MuiTheme'; // Importa el tema desde la nueva ubicación

export function AuthProviderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    // Aplica el ThemeProvider para inyectar el tema personalizado (verde)
    <ThemeProvider theme={customTheme}>
      {/* CssBaseline ayuda a normalizar estilos de MUI */}
      <CssBaseline />
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}