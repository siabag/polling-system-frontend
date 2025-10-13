'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
}) => {
  const backgroundImage =
    "url('/images/coffee-beans.jpg')"; // Ruta local en la carpeta 'public/images'

  useEffect(() => {
    // Añadir clase al body cuando el layout se monta
    document.body.classList.add('auth-page-body');

    // Limpiar la clase cuando el layout se desmonta
    return () => {
      document.body.classList.remove('auth-page-body');
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4">
      {/* 1. Capa de Fondo (Background Layer) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: backgroundImage, 
          zIndex: -1, // Asegura que esté detrás del contenido
          opacity: 0.4 // Ajusta la opacidad
        }}
      ></div>

      {/* 2. Contenido (Header y Formulario) */}
      <div className="w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 relative">
            <div className="w-20 h-20 flex items-center justify-center bg-[#a7c957] text-white text-3xl font-bold rounded-full">
              EC
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {description}
          </p>
        )}
      </div>

      <div className="mt-8 w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Sistema de Encuestas para Cultivos de Café
          </p>
          <p className="mt-2 text-xs text-gray-500">
            <Link href="/privacy-policy" className="hover:text-primary-500">
              Política de Privacidad
            </Link>
            {' • '}
            <Link href="/terms" className="hover:text-primary-500">
              Términos de Uso
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;