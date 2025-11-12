'use client'
import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Avatar,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import useAuth from '@/src/hooks/useAuth';
import { userApi } from '@/src/lib/api';
import { getErrorMessage } from '@/src/lib/utils';

export default function PerfilPage() {
  const { user, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    correo: user?.correo || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleEditToggle = () => {
    if (editing) {
      // Cancelar: restaurar datos originales
      setFormData({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        correo: user?.correo || '',
      });
    }
    setEditing(!editing);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      // Actualizar perfil del usuario
      await userApi.update(user!.id, {
        firstName: formData.nombre,
        lastName: formData.apellido,
        email: formData.correo,
      });
      
      setAlert({ message: 'Perfil actualizado correctamente', severity: 'success' });
      setEditing(false);
      
      // Recargar datos del usuario
      window.location.reload();
    } catch (error: any) {
      setAlert({ message: getErrorMessage(error), severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ message: 'Las contraseñas no coinciden', severity: 'error' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setAlert({ message: 'La contraseña debe tener al menos 6 caracteres', severity: 'error' });
      return;
    }

    try {
      setSaving(true);
      // Cambiar contraseña del usuario
      await userApi.changePassword(user!.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setAlert({ message: 'Contraseña actualizada correctamente', severity: 'success' });
      setPasswordDialogOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setAlert({ message: getErrorMessage(error), severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const initials = `${user.nombre?.charAt(0) || ''}${user.apellido?.charAt(0) || ''}`.toUpperCase();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Mi Perfil
      </Typography>

      {alert && (
        <Alert severity={alert.severity} onClose={() => setAlert(null)} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      <Card>
        <CardContent>
          {/* Header con avatar */}
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 3
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h5">
                {user.nombre} {user.apellido}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.rol}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.activo ? 'Cuenta activa' : 'Cuenta inactiva'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Formulario de datos personales */}
          <Box sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <AccountCircle sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="h6">Información Personal</Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }
              }}
            >
              <Box>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  disabled={!editing}
                  variant={editing ? 'outlined' : 'filled'}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  disabled={!editing}
                  variant={editing ? 'outlined' : 'filled'}
                />
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  disabled={!editing}
                  variant={editing ? 'outlined' : 'filled'}
                  type="email"
                />
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField
                  fullWidth
                  label="Rol"
                  value={user.rol}
                  disabled
                  variant="filled"
                  helperText="El rol es asignado por un administrador"
                />
              </Box>
            </Box>
          </Box>

          {/* Botones de acción */}
          <Box display="flex" gap={2} justifyContent="flex-end" flexWrap="wrap">
            {editing ? (
              <>
                <Button variant="outlined" onClick={handleEditToggle}>
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} /> : 'Guardar Cambios'}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  startIcon={<Lock />}
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  Cambiar Contraseña
                </Button>
                <Button variant="contained" onClick={handleEditToggle}>
                  Editar Perfil
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Dialog para cambiar contraseña */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Contraseña Actual"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Nueva Contraseña"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              sx={{ mb: 2 }}
              helperText="Mínimo 6 caracteres"
            />
            <TextField
              fullWidth
              label="Confirmar Nueva Contraseña"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleChangePassword}
            disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
          >
            {saving ? <CircularProgress size={24} /> : 'Cambiar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
