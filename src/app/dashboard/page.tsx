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
  Button, 
  Divider,
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
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: '#a7c957', 
                width: 64, 
                height: 64,
                mr: 2
              }}
            >
              {user.nombre.charAt(0)}{user.apellido.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4">
                Bienvenido, {user.nombre} {user.apellido}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {user.correo}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Información del usuario:
            </Typography>
            <Typography>
              <strong>Rol:</strong> {user.rol}
            </Typography>
            <Typography>
              <strong>Correo:</strong> {user.correo}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              color="error"
              onClick={logout}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Paper>
        
        {/* <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Acciones disponibles
          </Typography>
          <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
            <Typography variant="body1">
              Esta es una página de dashboard de prueba.
            </Typography>
          </Paper>
        </Box> */}
      </Box>
    </Container>
  );
};

export default DashboardPage;