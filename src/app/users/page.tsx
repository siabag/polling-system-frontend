'use client';

import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useAuth from '@/src/hooks/useAuth';
import DashboardLayout from '@/src/components/layout/DashboardLayout';
import UserList from '@/src/components/users/UserList';

const UsersPage: NextPage = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  // Verificar autenticación y permisos
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.rol !== 'administrador') {
        // Solo los administradores pueden acceder a la gestión de usuarios
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no es administrador, no mostrar nada
  if (user?.rol !== 'administrador') {
    return null;
  }

  return (
    <>
      <Head>
        <title>Gestión de Usuarios | Sistema de Encuestas - Café</title>
        <meta name="description" content="Administración de usuarios del sistema" />
      </Head>

      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Gestión de Usuarios</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4">
              <UserList />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default UsersPage;