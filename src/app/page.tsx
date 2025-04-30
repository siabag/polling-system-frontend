'use client'

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirigir a dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Sistema de Encuestas para Cultivos de Café
        </h1>
        
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mb-8">
          Plataforma digital para la gestión y análisis de encuestas quincenales 
          relacionadas con cultivos de café.
        </p>

        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-10 max-w-2xl">
          <p className="font-bold">Modo de Demostración</p>
          <p>
            Este sistema está utilizando datos simulados para demostración. 
            Puedes iniciar sesión con las siguientes credenciales:
          </p>
          <ul className="text-left mt-3">
            <li><strong>Administrador:</strong> admin@sistema.com / Admin123</li>
            <li><strong>Encuestador:</strong> juan@ejemplo.com / Juan123</li>
            <li><strong>Analista:</strong> maria@ejemplo.com / Maria123</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/login">
            <Button variant="primary" size="lg">
              Iniciar sesión
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">
              Registrarse
            </Button>
          </Link>
        </div>
      </main>

      <footer className="w-full py-8 flex items-center justify-center border-t">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Sistema de Encuestas para Cultivos de Café
        </p>
      </footer>
    </div>
  );
}