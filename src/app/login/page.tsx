'use client';
import { useEffect, useState } from 'react';
import AuthLayout from '@/src/components/layout/AuthLayout';
import LoginForm from '@/src/components/auth/LoginForm';
import useAuth from '@/src/hooks/useAuth';

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Este efecto es para manejar la hidratación
  useEffect(() => {
    setIsClient(true);
    console.log("LoginPage mounted, isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  // Ahora el LoginPage no maneja la redirección, solo muestra el formulario
  // La redirección se maneja centralmente en el AuthContext

  if (!isClient) {
    // Mientras no estemos en el cliente, mostramos un contenedor vacío
    // del mismo tamaño para evitar saltos visuales durante la hidratación
    return (
      <div className="min-h-[100dvh] bg-white flex flex-col justify-center px-4">
        {/* Placeholder mientras se hidrata */}
      </div>
    );
  }

  return (
    <AuthLayout 
      title="Iniciar sesión" 
      description="Acceda a su cuenta para gestionar las encuestas"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;