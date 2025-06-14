'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Controller } from 'react-hook-form';
import useAuth from '@/src/hooks/useAuth';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid as MuiGrid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  CircularProgress,
  Alert,
  InputLabel,
  Stack,
  Container,
  styled,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';
import useEncuestaForm from '@/src/hooks/useEncuestasForm';

// Componente personalizado para los botones
const ActionButton = styled(Button)(({ theme }) => ({
  height: 48,
  minWidth: 180,
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}));

const Grid = (props: any) => <MuiGrid {...props} />;

const EditarEncuestaPage = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const encuestaId = params?.id as string;

  const {
    loading,
    submitting,
    error,
    tiposEncuesta,
    fincas,
    factores,
    encuesta,
    control,
    onSubmit,
    watch,
    errors,
    setValue,
    toggleCompletada,
  } = useEncuestaForm({
    encuestaId: Number(encuestaId),
    userId: user?.id || 0,
    onSuccess: () => {
      console.log("Encuesta editada exitosamente, redirigiendo...");
      router.push(`/dashboard/encuestas/${encuestaId}`);
    },
    onError: (error) => {
      console.error("Error en edición:", error);
    }
  });

  const selectedTipoEncuestaId = watch('tipo_encuesta_id');

  const handleMarkAsComplete = () => {
    toggleCompletada(true);
  };

  const handleMarkAsPending = () => {
    toggleCompletada(false);
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Debe iniciar sesión para acceder a esta página.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !encuesta) {
    return (
      <Container maxWidth="lg">
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/dashboard/encuestas')}
            sx={{ mb: 3 }}
          >
            Volver
          </Button>
          <Alert severity="error">
            {error || 'No se pudo cargar la encuesta'}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 2
        }}>
          <Typography variant="h4" component="h1" fontWeight="600">
            Editar Encuesta
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(`/dashboard/encuestas/${encuestaId}`)}
          >
            Volver al Detalle
          </Button>
        </Box>

        {/* Estado actual */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Estado actual:
          </Typography>
          {encuesta.completada ? (
            <Chip
              icon={<CheckCircleIcon />}
              label="Completada"
              size="small"
              color="success"
            />
          ) : (
            <Chip
              icon={<HourglassEmptyIcon />}
              label="Procesando"
              size="small"
              color="warning"
            />
          )}
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
      </Box>

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
          color="primary" 
          sx={{ 
            borderBottom: '1px solid', 
            borderColor: 'divider', 
            pb: 1,
            mb: 4,
            fontWeight: '600'
          }}
        >
          Información Básica
        </Typography>

        <Grid container spacing={3}>
          {/* Fecha */}
          <Grid item xs={12} md={4}>
            <Controller
              name="fecha_aplicacion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha de Aplicación"
                  type="date"
                  fullWidth
                  error={!!errors.fecha_aplicacion}
                  helperText={errors.fecha_aplicacion?.message}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    style: { height: '56px' }
                  }}
                />
              )}
            />
          </Grid>
          
          {/* Tipo de Encuesta (solo lectura) */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Tipo de Encuesta"
              value={encuesta.tipo_encuesta?.nombre || ''}
              fullWidth
              variant="outlined"
              InputProps={{
                readOnly: true,
                style: { backgroundColor: '#f5f5f5' }
              }}
              helperText="No se puede modificar el tipo de encuesta"
            />
          </Grid>
          
          {/* Finca (solo lectura) */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Finca"
              value={encuesta.finca?.nombre || ''}
              fullWidth
              variant="outlined"
              InputProps={{
                readOnly: true,
                style: { backgroundColor: '#f5f5f5' }
              }}
              helperText="No se puede modificar la finca"
            />
          </Grid>
          
          {/* Observaciones */}
          <Grid item xs={12}>
            <Controller
              name="observaciones"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Observaciones"
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.observaciones}
                  helperText={errors.observaciones?.message}
                  variant="outlined"
                />
              )}
            />
          </Grid>
        </Grid>

        {/* Sección de Estado */}
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography 
            variant="h6" 
            component="h2" 
            color="primary" 
            sx={{ 
              borderBottom: '1px solid', 
              borderColor: 'divider', 
              pb: 1,
              mb: 3,
              fontWeight: '600'
            }}
          >
            Estado de la Encuesta
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant={watch('completada') === false ? "contained" : "outlined"}
              color="warning"
              startIcon={<HourglassEmptyIcon />}
              onClick={handleMarkAsPending}
              type="button"
            >
              Marcar como Pendiente
            </Button>
            <Button
              variant={watch('completada') === true ? "contained" : "outlined"}
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleMarkAsComplete}
              type="button"
            >
              Marcar como Completada
            </Button>
          </Stack>
        </Box>

        {/* Sección de Factores */}
        {selectedTipoEncuestaId && factores.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography 
              variant="h6" 
              component="h2" 
              color="primary" 
              sx={{ 
                borderBottom: '1px solid', 
                borderColor: 'divider', 
                pb: 1,
                mb: 4,
                fontWeight: '600'
              }}
            >
              Factores Evaluados
            </Typography>

            <Stack spacing={4}>
              {factores.map((factor, index) => (
                <Paper 
                  key={factor.id} 
                  elevation={0} 
                  sx={{ 
                    p: 3,
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    backgroundColor: 'background.paper'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {factor.nombre}
                  </Typography>
                  
                  {factor.descripcion && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {factor.descripcion}
                    </Typography>
                  )}
                  
                  <FormControl 
                    fullWidth 
                    error={!!errors.respuestas?.[index]?.valor_posible_id}
                    sx={{ mb: 3 }}
                  >
                    <InputLabel shrink sx={{ mb: 1 }}>
                      Seleccione una opción
                    </InputLabel>
                    <Controller
                      name={`respuestas.${index}.valor_posible_id`}
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          value={field.value || 0} // Asegurar que nunca sea undefined
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 2
                          }}
                        >
                          {factor.valores_posibles?.map((valor) => (
                            <Paper
                              key={valor.id}
                              elevation={0}
                              sx={{
                                p: 1.5,
                                border: '1px solid',
                                borderColor: field.value === valor.id ? 'primary.main' : 'divider',
                                borderRadius: 1,
                                flex: '1 1 160px',
                                minWidth: '160px',
                                backgroundColor: field.value === valor.id ? 'primary.light' : 'background.default'
                              }}
                            >
                              <FormControlLabel
                                value={valor.id}
                                control={<Radio />}
                                label={
                                  <Box>
                                    <Typography variant="body2" fontWeight="medium">
                                      {valor.valor} ({valor.codigo})
                                    </Typography>
                                    {valor.descripcion && (
                                      <Typography variant="caption" color="text.secondary">
                                        {valor.descripcion}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                                sx={{ m: 0 }}
                              />
                            </Paper>
                          ))}
                        </RadioGroup>
                      )}
                    />
                    
                    {errors.respuestas?.[index]?.valor_posible_id && (
                      <FormHelperText>
                        {errors.respuestas?.[index]?.valor_posible_id?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  
                  <Controller
                    name={`respuestas.${index}.respuesta_texto`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Comentario adicional (opcional)"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        error={!!errors.respuestas?.[index]?.respuesta_texto}
                        helperText={errors.respuestas?.[index]?.respuesta_texto?.message}
                      />
                    )}
                  />
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* Botones de acción */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="flex-end"
          sx={{ 
            mt: 4,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <ActionButton
            variant="outlined"
            color="primary"
            onClick={() => router.push(`/dashboard/encuestas/${encuestaId}`)}
            type="button"
          >
            Cancelar
          </ActionButton>
          
          <ActionButton
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={submitting}
          >
            {submitting ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                Guardando cambios...
              </Box>
            ) : 'Guardar Cambios'}
          </ActionButton>
        </Stack>
      </Paper>
    </Container>
  );
};

export default EditarEncuestaPage;