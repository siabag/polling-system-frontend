'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { surveyApi } from '@/src/lib/apiSurvey';
import { CreateFincaData } from '@/src/types/survey';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid as MuiGrid,
  CircularProgress,
  Alert,
  Container,
  styled
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Componente personalizado para los botones
const ActionButton = styled(Button)(({ theme }) => ({
  height: 48,
  minWidth: 180,
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}));

const Grid = (props: any) => <MuiGrid {...props} />;

export default function CrearFincaForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Configuración del formulario con React Hook Form
  const { 
    control, 
    handleSubmit, 
    formState: { errors }
  } = useForm<CreateFincaData>({
    defaultValues: {
      nombre: '',
      ubicacion: '',
      propietario: '',
      latitud: null,
      longitud: null
    }
  });
  
  // Enviar formulario
  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    setError(null);
    
    try {
      await surveyApi.createFinca(data);
      router.push('/dashboard/admin/fincas');
    } catch (err: any) {
      console.error('Error al crear finca:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al crear la finca');
      }
    } finally {
      setSubmitting(false);
    }
  });
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.push('/dashboard/admin/fincas')}
          variant="text"
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1" fontWeight="600">
          Nueva Finca
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
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
        {/* Sección de Información Básica */}
        <Typography 
          variant="h6" 
          component="h2" 
          color="#a7c957" 
          sx={{ 
            borderBottom: '1px solid', 
            borderColor: 'divider', 
            pb: 1,
            mb: 4,
            fontWeight: '600'
          }}
        >
          Información de la Finca
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'El nombre es obligatorio' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre de la Finca *"
                  fullWidth
                  variant="outlined"
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                  placeholder="Ej: Finca El Porvenir"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="propietario"
              control={control}
              rules={{ required: 'El propietario es obligatorio' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Propietario *"
                  fullWidth
                  variant="outlined"
                  error={!!errors.propietario}
                  helperText={errors.propietario?.message}
                  placeholder="Nombre del propietario"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="ubicacion"
              control={control}
              rules={{ required: 'La ubicación es obligatoria' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ubicación *"
                  fullWidth
                  variant="outlined"
                  error={!!errors.ubicacion}
                  helperText={errors.ubicacion?.message}
                  placeholder="Dirección o descripción de la ubicación"
                />
              )}
            />
          </Grid>
        </Grid>
        
        {/* Sección de Coordenadas */}
        <Typography 
          variant="h6" 
          component="h2" 
          color="#a7c957" 
          sx={{ 
            borderBottom: '1px solid', 
            borderColor: 'divider', 
            pb: 1,
            mb: 4,
            mt: 4,
            fontWeight: '600'
          }}
        >
          Coordenadas (Opcional)
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="latitud"
              control={control}
              rules={{
                validate: value => {
                  if (value !== null && value !== undefined) {
                    if (isNaN(value) || value < -90 || value > 90) {
                      return 'La latitud debe estar entre -90 y 90';
                    }
                  }
                  return true;
                }
              }}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  value={value || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? null : parseFloat(val));
                  }}
                  label="Latitud"
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.latitud}
                  helperText={errors.latitud?.message || 'Entre -90 y 90'}
                  inputProps={{ 
                    step: 'any',
                    min: -90,
                    max: 90
                  }}
                  placeholder="Ej: 4.7110"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="longitud"
              control={control}
              rules={{
                validate: value => {
                  if (value !== null && value !== undefined) {
                    if (isNaN(value) || value < -180 || value > 180) {
                      return 'La longitud debe estar entre -180 y 180';
                    }
                  }
                  return true;
                }
              }}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  value={value || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? null : parseFloat(val));
                  }}
                  label="Longitud"
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.longitud}
                  helperText={errors.longitud?.message || 'Entre -180 y 180'}
                  inputProps={{ 
                    step: 'any',
                    min: -180,
                    max: 180
                  }}
                  placeholder="Ej: -74.0721"
                />
              )}
            />
          </Grid>
        </Grid>
        
        {/* Botones de acción */}
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
            variant="outlined"
            color="primary"
            onClick={() => router.push('/dashboard/fincas')}
          >
            Cancelar
          </ActionButton>
          
          <ActionButton
            type="submit"
            variant="contained"
            disabled={submitting}
          >
            {submitting ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                Guardando...
              </Box>
            ) : 'Guardar Finca'}
          </ActionButton>
        </Box>
      </Paper>
    </Container>
  );
}