'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/src/hooks/useAuth';

import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Avatar,
  CircularProgress
} from '@mui/material';

const DashboardPage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    console.log("Dashboard mounted, isAuthenticated:", isAuthenticated, "user:", user);
  }, [isAuthenticated, user]);
  
  // Proteger la ruta manualmente en lugar de depender del AuthContext
  useEffect(() => {
    if (isClient && !loading && !isAuthenticated) {
      console.log("No authenticated, redirecting to login from dashboard");
      router.push('/login');
    }
  }, [isClient, isAuthenticated, loading, router]);
  
  // Mostrar estado de carga mientras verificamos la autenticación
  if (loading || !isClient) {
    return (
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh' 
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Cargando...
          </Typography>
        </Box>
      </Container>
    );
  }
  
  // Si no hay usuario autenticado, no mostramos nada (la redirección se manejará en el useEffect)
  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh' 
          }}
        >
          <Typography>Verificando sesión...</Typography>
        </Box>
      </Container>
    );
  }
  
    return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Mensaje de bienvenida rediseñado */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 4,
            display: 'flex',
            alignItems: 'left',
            backgroundColor: "#b6bf82", // Un verde suave
            color: 'secondary.contrastText',
            borderRadius: '8px',
          }}
        >
          <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                width: 48, 
                height: 48,
                mr: 2,
                fontSize: '1.2rem'
              }}
            >
              {user.nombre.charAt(0)}{user.apellido.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6">
              ¡Hola, {user.nombre}!
            </Typography>
            <Typography variant="body2">
              Qué bueno verte de nuevo.
            </Typography>
          </Box>
        </Paper>
        
        {/* Aquí puedes agregar más contenido del dashboard */}
        <Typography variant="h5" gutterBottom>
            Acciones disponibles
        </Typography>
        <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
            <Typography variant="body1">
              Esta es una página de dashboard de prueba.
            </Typography>
        </Paper>

      </Box>
    </Container>
  );
};

export default DashboardPage;