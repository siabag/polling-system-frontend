'use client'
import { useState } from 'react';
import AuthLayout from '@/src/components/layout/AuthLayout';
import { Box, TextField, Button, Alert, Typography, Paper, CircularProgress } from '@mui/material';
import Link from 'next/link';
import useAuth from '@/src/hooks/useAuth';

export default function ResetPasswordRequestPage() {
  const { resetPassword, loading, error, clearErrors } = useAuth();
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setLocalError('Ingrese un correo electrónico válido');
      return;
    }
    try {
      await resetPassword(email);
    } catch (_) {
      // Error ya manejado por el contexto
    }
  };

  return (
    <AuthLayout title="Restablecer contraseña" description="Le enviaremos un enlace para restablecer su contraseña">
      <Paper elevation={3} sx={{ p: 3 }}>
        {(localError || error) && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearErrors}>
            {localError || error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            margin="normal"
          />
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 2, height: 48 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar enlace'}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Revise su correo. Si no lo ve en la bandeja de entrada, verifique el correo no deseado.
          </Typography>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link href="/login">Volver al inicio de sesión</Link>
          </Box>
        </Box>
      </Paper>
    </AuthLayout>
  );
}
