import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navegar a la página de login después de cerrar sesión
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Verificar si la ruta actual coincide con la ruta del enlace
  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  // Clase para los enlaces activos
  const activeLinkClass = 'bg-primary-700 text-white';
  const inactiveLinkClass = 'text-gray-300 hover:bg-primary-700 hover:text-white';

  // Navegación principal
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, allowedRoles: ['administrador', 'encuestador', 'analista'] },
    { name: 'Encuestas', href: '/surveys', icon: DocumentTextIcon, allowedRoles: ['administrador', 'encuestador', 'analista'] },
    { name: 'Estadísticas', href: '/statistics', icon: ChartBarIcon, allowedRoles: ['administrador', 'analista'] },
    { name: 'Usuarios', href: '/users', icon: UsersIcon, allowedRoles: ['administrador'] },
  ];

  // Filtrar navegación según rol del usuario
  const filteredNavigation = navigation.filter(item => 
    user && item.allowedRoles.includes(user.role.name)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Sistema de Encuestas - Café</title>
      </Head>

      {/* Sidebar móvil */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Cerrar sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <span className="text-xl font-bold text-white">Encuestas Café</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive(item.href) ? activeLinkClass : inactiveLinkClass
                  }`}
                >
                  <item.icon className="mr-4 h-6 w-6" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-primary-700 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary-600 text-white font-bold">
                  {user ? user.firstName[0] + user.lastName[0] : 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">
                    {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
                  </p>
                  <p className="text-sm font-medium text-primary-300">
                    {user ? user.role.name : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar escritorio */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-primary-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-bold text-white">Encuestas Café</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive(item.href) ? activeLinkClass : inactiveLinkClass
                  }`}
                >
                  <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-primary-700 hover:text-white"
              >
                <ArrowLeftIcon className="mr-3 h-6 w-6" aria-hidden="true" />
                Cerrar sesión
              </button>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-primary-700 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary-600 text-white font-bold">
                  {user ? user.firstName[0] + user.lastName[0] : 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
                  </p>
                  <p className="text-xs font-medium text-primary-300">
                    {user ? user.role.name : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;