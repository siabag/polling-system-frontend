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
  CircularProgress,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';
import { 
  AddCircleOutline as AddIcon, 
  ListAlt as ListIcon, 
  Assessment as ReportIcon,
  BarChart as MonitorIcon,
} from '@mui/icons-material';

const Grid = (props: any) => <MuiGrid {...props} />;
const DashboardPage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient && !loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isClient, isAuthenticated, loading, router]);
  
  if (loading || !isClient) {
    return (
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh' 
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (!user) {
    return null; // La redirección se maneja en el useEffect
  }

  const actions = [
    {
      title: 'Nueva Encuesta',
      description: 'Inicia una nueva encuesta de campo.',
      icon: <AddIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/dashboard/encuestas/nueva',
    },
    {
      title: 'Mis Encuestas',
      description: 'Revisa y gestiona tus encuestas completadas.',
      icon: <ListIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/dashboard/encuestas',
    },
    {
      title: 'Monitoreo',
      description: 'Visualiza datos y métricas en tiempo real.',
      icon: <MonitorIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/dashboard/monitoreo',
    },
    {
      title: 'Reportes',
      description: 'Genera y exporta reportes detallados.',
      icon: <ReportIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/dashboard/reportes',
    },
  ];
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" flexDirection="column" gap={4}>
        {/* Mensaje de bienvenida */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, // Más padding para un look más espacioso
            display: 'flex',
            alignItems: 'center',
            backgroundColor: "rgba(232, 245, 233, 0.8)", // Fondo con ligera transparencia
            backdropFilter: 'blur(4px)', // Efecto de desenfoque para el fondo
            borderRadius: '16px', // Bordes más redondeados
            border: '1px solid #c8e6c9'
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              width: 56, 
              height: 56,
              mr: 2,
              fontSize: '1.5rem'
            }}
          >
            {user.nombre.charAt(0)}{user.apellido.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" component="h1" fontWeight="600">
              ¡Hola, {user.nombre}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Qué bueno verte de nuevo. Aquí tienes un resumen de tus acciones.
            </Typography>
          </Box>
        </Paper>

        {/* Contenedor para las acciones */}
        <Box>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: '600' }}>
              Acciones disponibles
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              justifyItems: 'stretch'
            }}
          >
            {actions.map((action, index) => (
              <Card 
                key={index}
                sx={{ 
                  height: '100%',
                  borderRadius: '16px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  },
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(5px)',
                }}
              >
                <CardActionArea 
                  onClick={() => router.push(action.path)}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', // Centrar contenido verticalmente
                    p: 3 
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    {action.icon}
                  </Box>
                  <CardContent sx={{ textAlign: 'center', p: 0 }}>
                    <Typography gutterBottom variant="h6" component="div" fontWeight="500">
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;