"use client"
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/src/hooks/useAuth';
import AuthLayout from '@/src/components/layout/AuthLayout';
import RegisterForm from '@/src/components/auth/RegisterForm';

const RegisterPage: NextPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirigir a dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <AuthLayout 
      title="Crear cuenta" 
      description="Regístrese para comenzar a utilizar el sistema de encuestas"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;