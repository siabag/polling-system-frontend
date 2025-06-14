'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  InputAdornment,
  IconButton,
  Skeleton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

// Tipos
interface CreateUsuarioData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: number;
  activo: boolean;
}

interface Role {
  id: number;
  nombre: string;
  descripcion?: string;
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

// Componente de validación de contraseña
function PasswordStrength({ password }: { password: string }) {
  const requirements = [
    { test: (pwd: string) => pwd.length >= 6, text: 'Al menos 6 caracteres' },
    { test: (pwd: string) => /[A-Z]/.test(pwd), text: 'Una letra mayúscula' },
    { test: (pwd: string) => /[a-z]/.test(pwd), text: 'Una letra minúscula' },
    { test: (pwd: string) => /\d/.test(pwd), text: 'Un número' },
  ];

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Requisitos de contraseña:
        </Typography>
        <List dense>
          {requirements.map((req, index) => {
            const passed = req.test(password);
            return (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {passed ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <CancelIcon color="error" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={req.text}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: passed ? 'success.main' : 'text.secondary'
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}

export default function CrearUsuarioForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  
  // Usar el hook useUsers
  const { createUser, getRoles, loading, error, clearErrors } = useUsers();
  
  // Configuración del formulario con React Hook Form
  const { 
    control, 
    handleSubmit, 
    watch,
    formState: { errors, isValid }, 
    trigger,
  } = useForm<CreateUsuarioData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      roleId: 0,
      activo: true,
    },
    mode: 'onChange'
  });
  
  // Observar la contraseña para validar confirmación y mostrar requisitos
  const password = watch('password');
  const watchedPassword = watch('password', '');

  // Verificar permisos
  useEffect(() => {
    if (user && user.rol !== 'administrador') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Cargar roles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setRolesLoading(true);
        const rolesData = await getRoles();
        setRoles(rolesData || []);
        
        // Establecer rol por defecto si hay roles disponibles
        if (rolesData && rolesData.length > 0) {
          const defaultRole = rolesData.find((role:any) => 
            role.nombre.toLowerCase() === 'encuestador'
          ) || rolesData[0];
          
          // Usar setValue en lugar de defaultValues
          trigger('roleId');
        }
      } catch (error) {
        console.error('Error cargando roles:', error);
      } finally {
        setRolesLoading(false);
      }
    };

    if (user && user.rol === 'administrador') {
      loadRoles();
    }
  }, [user, getRoles, trigger]);
  
  // Enviar formulario
  const onSubmit = handleSubmit(async (data) => {
    // Validar que las contraseñas coincidan
    if (data.password !== data.confirmPassword) {
      return;
    }
    
    // Limpiar errores previos
    clearErrors();
    
    // Preparar datos para enviar
    const userData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      roleId: data.roleId,
      activo: data.activo,
    };
    
    const result = await createUser(userData);
    
    if (result) {
      // Usuario creado exitosamente
      router.push('/dashboard/admin/usuarios?created=true');
    }
  });
  
  // Validaciones
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) || 'Email no válido';
  };
  
  // Validación de contraseña
  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }
    if (!/\d/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    return true;
  };
  
  // Validación de confirmación de contraseña
  const validateConfirmPassword = (confirmPassword: string) => {
    return confirmPassword === password || 'Las contraseñas no coinciden';
  };

  // Loading inicial
  if (rolesLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton width={100} height={40} />
          <Skeleton width={250} height={48} />
        </Box>
        <Paper sx={{ p: 4 }}>
          <Skeleton height={60} sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Skeleton height={56} />
              </Grid>
            ))}
          </Grid>
        </Paper>
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
          Nuevo Usuario
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearErrors}>
          {error}
        </Alert>
      )}
      
      <Paper 
        component="form" 
        onSubmit={onSubmit}
        elevation={3} 
        sx={{ 
          p: { xs: 2, md: 4 },
          mb: 4,
          borderRadius: 2
        }}
      >
        {/* Sección de Información Personal */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <PersonAddIcon color="primary" />
          <Typography 
            variant="h6" 
            component="h2" 
            color="primary" 
            fontWeight="600"
          >
            Información Personal
          </Typography>
        </Box>
        
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
                },
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  message: 'El nombre solo puede contener letras'
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
                },
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  message: 'El apellido solo puede contener letras'
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
                  placeholder="Ej: Pérez García"
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
              rules={{ 
                required: 'Debe seleccionar un rol',
                validate: (value) => value > 0 || 'Debe seleccionar un rol válido'
              }}
              render={({ field }) => (
                <TextField
                  select
                  label="Rol *"
                  fullWidth
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.roleId}
                  helperText={errors.roleId?.message || 'Seleccione el rol del usuario'}
                  variant="outlined"
                >
                  <MenuItem value={0} disabled>
                    Seleccionar rol...
                  </MenuItem>
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
        </Grid>
        
        {/* Sección de Seguridad */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, mt: 6 }}>
          <VisibilityIcon color="primary" />
          <Typography 
            variant="h6" 
            component="h2" 
            color="primary" 
            fontWeight="600"
          >
            Seguridad
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="password"
              control={control}
              rules={{ 
                required: 'La contraseña es obligatoria',
                validate: validatePassword
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contraseña *"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            
            {/* Mostrar validador de contraseña */}
            {watchedPassword && (
              <PasswordStrength password={watchedPassword} />
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{ 
                required: 'Confirme la contraseña',
                validate: validateConfirmPassword
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirmar Contraseña *"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        
        {/* Sección de Configuración */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, mt: 6 }}>
          <PersonAddIcon color="primary" />
          <Typography 
            variant="h6" 
            component="h2" 
            color="primary" 
            fontWeight="600"
          >
            Configuración de Cuenta
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
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
                        {field.value 
                          ? "Usuario activo - puede acceder al sistema inmediatamente" 
                          : "Usuario inactivo - necesitará ser activado antes de poder acceder"
                        }
                      </Typography>
                    </Box>
                  }
                />
              )}
            />
          </Grid>
        </Grid>
        
        {/* Información adicional */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            📧 Información importante:
          </Typography>
          <Typography variant="body2">
            • El usuario recibirá un email de bienvenida con sus credenciales de acceso
            <br />
            • Se le pedirá cambiar su contraseña en el primer inicio de sesión
            <br />
            • Podrá acceder al sistema según los permisos de su rol asignado
          </Typography>
        </Alert>
        
        {/* Botones de acción */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2, 
            mt: 4,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <ActionButton
            variant="outlined"
            color="primary"
            onClick={() => router.push('/dashboard/admin/usuarios')}
            disabled={loading}
          >
            Cancelar
          </ActionButton>
          
          <ActionButton
            type="submit"
            variant="contained"
            disabled={loading || !isValid}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                Creando Usuario...
              </Box>
            ) : 'Crear Usuario'}
          </ActionButton>
        </Box>
      </Paper>
    </Container>
  );
}