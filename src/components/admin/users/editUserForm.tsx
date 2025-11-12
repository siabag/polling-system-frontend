'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import useUsers from '@/src/hooks/useUsers';
import useAuth from '@/src/hooks/useAuth';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid as MuiGrid,
  CircularProgress,
  Alert,
  Container,
  Switch,
  FormControlLabel,
  styled,
  Skeleton,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import type { User } from '@/src/types/auth';

// Tipos
interface EditUsuarioData {
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  activo: boolean;
}

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Componente personalizado para los botones
const ActionButton = styled(Button)(({ theme }) => ({
  height: 48,
  minWidth: 180,
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}));

const Grid = (props: any) => <MuiGrid {...props} />;

// Panel de información personal
function PersonalInfoPanel({ 
  control, 
  errors, 
  loading,
  onSubmit,
  roles = []
}: {
  control: any;
  errors: any;
  loading: boolean;
  onSubmit: () => void;
  roles: any[];
}) {
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) || 'Email no válido';
  };

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            name="firstName"
            control={control}
            rules={{ 
              required: 'El nombre es obligatorio',
              minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre *"
                fullWidth
                variant="outlined"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                placeholder="Ej: Juan"
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="lastName"
            control={control}
            rules={{ 
              required: 'El apellido es obligatorio',
              minLength: {
                value: 2,
                message: 'El apellido debe tener al menos 2 caracteres'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Apellido *"
                fullWidth
                variant="outlined"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                placeholder="Ej: Pérez"
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="email"
            control={control}
            rules={{ 
              required: 'El email es obligatorio',
              validate: validateEmail
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Correo Electrónico *"
                type="email"
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                placeholder="usuario@ejemplo.com"
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="roleId"
            control={control}
            rules={{ required: 'Debe seleccionar un rol' }}
            render={({ field }) => (
              <TextField
                select
                label="Rol *"
                fullWidth
                value={field.value}
                onChange={field.onChange}
                error={!!errors.roleId}
                helperText={errors.roleId?.message}
                variant="outlined"
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    <Box>
                      <Typography>{role.nombre}</Typography>
                      {role.descripcion && (
                        <Typography variant="caption" color="text.secondary">
                          {role.descripcion}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="activo"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch 
                    checked={field.value} 
                    onChange={field.onChange}
                  />
                }
                label={
                  <Box>
                    <Typography>Estado de la Cuenta</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {field.value ? "Usuario activo - puede acceder al sistema" : "Usuario inactivo - sin acceso"}
                    </Typography>
                  </Box>
                }
              />
            )}
          />
        </Grid>
      </Grid>
      
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2, 
          mt: 4,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        <ActionButton
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              Guardando...
            </Box>
          ) : 'Actualizar Información'}
        </ActionButton>
      </Box>
    </Box>
  );
}

// Panel de cambio de contraseña
function PasswordPanel({ 
  control, 
  errors, 
  loading,
  onSubmit,
  userId
}: {
  control: any;
  errors: any;
  loading: boolean;
  onSubmit: () => void;
  userId: number;
}) {
  const { user } = useAuth();
  const canChangePassword = user?.rol === 'administrador' || user?.id === userId;

  if (!canChangePassword) {
    return (
      <Alert severity="info">
        Solo los administradores o el propio usuario pueden cambiar la contraseña.
      </Alert>
    );
  }

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return true;
  };

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="currentPassword"
            control={control}
            rules={{ 
              required: 'La contraseña actual es obligatoria'
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Contraseña Actual *"
                type="password"
                fullWidth
                variant="outlined"
                error={!!errors.currentPassword}
                helperText={errors.currentPassword?.message}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="newPassword"
            control={control}
            rules={{ 
              required: 'La nueva contraseña es obligatoria',
              validate: validatePassword
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nueva Contraseña *"
                type="password"
                fullWidth
                variant="outlined"
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message || 'Mínimo 6 caracteres'}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="confirmNewPassword"
            control={control}
            rules={{ 
              required: 'Confirme la nueva contraseña',
              validate: (value, { newPassword }) => {
                return value === newPassword || 'Las contraseñas no coinciden';
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirmar Nueva Contraseña *"
                type="password"
                fullWidth
                variant="outlined"
                error={!!errors.confirmNewPassword}
                helperText={errors.confirmNewPassword?.message}
              />
            )}
          />
        </Grid>
      </Grid>
      
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2, 
          mt: 4,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        <ActionButton
          type="submit"
          variant="contained"
          color="warning"
          disabled={loading}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              Cambiando...
            </Box>
          ) : 'Cambiar Contraseña'}
        </ActionButton>
      </Box>
    </Box>
  );
}

export default function EditarUsuarioForm() {
  const router = useRouter();
  const params = useParams();
  const userId = parseInt(params.id as string);
  const [tabValue, setTabValue] = useState(0);
  const [roles, setRoles] = useState([]);
  const { user } = useAuth();
  
  // Hook para usuarios
  const { 
    getUserById, 
    updateUser, 
    changeUserPassword,
    getRoles,
    loading, 
    error, 
    clearErrors 
  } = useUsers();
  
  // Estados
  const [userData, setUserData] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Formulario para información personal
  const { 
    control: personalControl, 
    handleSubmit: handlePersonalSubmit, 
    formState: { errors: personalErrors }, 
    reset: resetPersonalForm
  } = useForm<EditUsuarioData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      roleId: 1,
      activo: true,
    }
  });
  
  // Formulario para cambio de contraseña
  const { 
    control: passwordControl, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors },
    reset: resetPasswordForm
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }
  });

  // Verificar permisos
  useEffect(() => {
    if (user && user.rol !== 'administrador' && user.id !== userId) {
      router.push('/dashboard');
    }
  }, [user, userId, router]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setInitialLoading(true);
        
        // Cargar datos del usuario y roles en paralelo
        const [userResponse, rolesResponse] = await Promise.all([
          getUserById(userId),
          getRoles()
        ]);
        
        if (userResponse) {
          setUserData(userResponse as User);
          resetPersonalForm({
            firstName: userResponse.nombre || '',
            lastName: userResponse.apellido || '',
            email: userResponse.correo || '',
            roleId: 1,
            activo: userResponse.activo ?? true,
          });
        }
        
        setRoles(rolesResponse || []);
        
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (userId && user) {
      loadInitialData();
    }
  }, [userId, user, getUserById, getRoles, resetPersonalForm]);

  // Manejar envío de información personal
  const onPersonalSubmit = handlePersonalSubmit(async (data) => {
    clearErrors();
    setSuccessMessage('');
    
    const result = await updateUser(userId, data);
    
    if (result) {
      setSuccessMessage('Información actualizada correctamente');
      setUserData(prev => (prev ? ({ ...prev, ...result } as User) : (result as User)));
    }
  });

  // Manejar cambio de contraseña
  const onPasswordSubmit = handlePasswordSubmit(async (data) => {
    clearErrors();
    setSuccessMessage('');
    
    const passwordData = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
    
    const success = await changeUserPassword(userId, passwordData);
    
    if (success) {
      setSuccessMessage('Contraseña cambiada correctamente');
      resetPasswordForm();
    }
  });

  if (initialLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton width={100} height={40} />
          <Skeleton width={200} height={48} />
        </Box>
        <Paper sx={{ p: 4 }}>
          <Skeleton height={60} sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton height={56} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton height={56} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Usuario no encontrado
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.push('/dashboard/admin/usuarios')}
          variant="text"
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1" fontWeight="600">
          Editar Usuario: {userData.nombre} {userData.apellido}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearErrors}>
          {error}
        </Alert>
      )}
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<PersonIcon />} 
            label="Información Personal" 
            iconPosition="start"
          />
          <Tab 
            icon={<SecurityIcon />} 
            label="Seguridad" 
            iconPosition="start"
          />
        </Tabs>
        
        <Box sx={{ p: 4 }}>
          {tabValue === 0 && (
            <PersonalInfoPanel
              control={personalControl}
              errors={personalErrors}
              loading={loading}
              onSubmit={onPersonalSubmit}
              roles={roles}
            />
          )}
          
          {tabValue === 1 && (
            <PasswordPanel
              control={passwordControl}
              errors={passwordErrors}
              loading={loading}
              onSubmit={onPasswordSubmit}
              userId={userId}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
}