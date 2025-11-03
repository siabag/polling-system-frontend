'use client'
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthLayout from '@/src/components/layout/AuthLayout';
import { Box, TextField, Button, Alert, Paper, CircularProgress } from '@mui/material';
import { authApi } from '@/src/lib/api';

export default function ResetPasswordTokenPage() {
  const params = useParams();
  const router = useRouter();
  const token = (params?.token as string) || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      setLoading(true);
      await authApi.resetPassword(token, password);
      router.replace('/login?reset=true');
    } catch (err: any) {
      setError(err?.message || 'No se pudo restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Definir nueva contraseña">
      <Paper elevation={3} sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nueva contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirmar contraseña"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            margin="normal"
          />
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 2, height: 48 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar contraseña'}
          </Button>
        </Box>
      </Paper>
    </AuthLayout>
  );
}
