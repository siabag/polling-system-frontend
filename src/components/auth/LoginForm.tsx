'use client';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import useAuth from '@/src/hooks/useAuth';

import { 
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  Snackbar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AuthCredentials } from '@/src/types/auth';

// Esquema de validación
const schema = yup.object().shape({
  email: yup.string()
    .email('Correo inválido')
    .required('Campo requerido'),
  password: yup.string()
    .required('Campo requerido')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const LoginForm = () => {
  const searchParams = useSearchParams();
  const { login, error, loading } = useAuth();
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Hook para manejar el formulario
  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm<AuthCredentials>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    // Comprobamos parámetros de URL
    const registered = searchParams.get('registered');
    const expired = searchParams.get('expired');
    const reset = searchParams.get('reset');

    if (registered === 'true') {
      setAlert({
        open: true,
        message: '¡Registro exitoso! Ahora puede iniciar sesión.',
        severity: 'success'
      });
    } else if (expired === 'true') {
      setAlert({
        open: true,
        message: 'Sesión expirada. Por favor, inicie sesión nuevamente.',
        severity: 'error'
      });
    } else if (reset === 'true') {
      setAlert({
        open: true,
        message: 'Contraseña restablecida con éxito. Inicie sesión con su nueva contraseña.',
        severity: 'success'
      });
    }
  }, [searchParams]);

  useEffect(() => {
    // Mostrar errores de autenticación
    if (error) {
      console.log("Error de autenticación:", error);
      setAlert({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  }, [error]);

  // Función para manejar el envío del formulario
  const onSubmit = async (data: AuthCredentials) => {
    console.log("Intentando iniciar sesión con:", data);
    setSubmitAttempted(true);
    try {
      // La redirección ahora se maneja directamente en el método login del AuthContext
      await login(data);
    } catch (err) {
      console.error("Error en el submit:", err);
    }
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  // Función para manejar el inicio de sesión rápido (datos de prueba)
  const handleQuickLogin = (email: string, password: string) => {
    try {
      login({ email, password });
    } catch (err) {
      console.error("Error en quick login:", err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <LockOutlinedIcon fontSize="medium" />
        </Box>

        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Iniciar sesión
        </Typography>

        {/* Debug info */}
        {submitAttempted && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Estado: {loading ? 'Cargando...' : (error ? 'Error' : 'Listo')}
            </Typography>
          </Box>
        )}

        {alert.open && (
          <Alert
            severity={alert.severity as "error" | "warning" | "info" | "success"}
            onClose={handleCloseAlert}
            sx={{ width: '100%', mb: 3 }}
          >
            {alert.message}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%' }}
          noValidate
        >
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Correo electrónico"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="normal"
            fullWidth
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
            sx={{ mb: 1 }}
          />

          <Box sx={{ textAlign: 'right', mb: 2 }}>
            <Link href="/reset-password" variant="body2">
              ¿Olvidó su contraseña?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 2, mb: 2, height: 48 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar sesión'}
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              ¿No tienes cuenta?
            </Typography>
          </Divider>

          <Button
            component="a"
            href="/register"
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
          >
            Registrarse
          </Button>
        </Box>
      </Paper>
      
      {/* Snackbar para mensajes adicionales */}
      <Snackbar
        open={loading}
        message="Verificando credenciales..."
      />
    </Box>
  );
};

export default LoginForm;