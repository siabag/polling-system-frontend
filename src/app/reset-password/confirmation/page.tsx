'use client'
import AuthLayout from '@/src/components/layout/AuthLayout';
import { CheckCircleOutline } from '@mui/icons-material';
import { Box, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function ResetPasswordConfirmationPage() {
  return (
    <AuthLayout title="Correo enviado" description="Le hemos enviado un enlace para restablecer su contraseña">
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleOutline color="success" sx={{ fontSize: 56 }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Revise su bandeja de entrada
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Si no encuentra el mensaje, verifique la carpeta de spam o intente nuevamente en unos minutos.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Link href="/login">Volver al inicio de sesión</Link>
        </Box>
      </Paper>
    </AuthLayout>
  );
}
