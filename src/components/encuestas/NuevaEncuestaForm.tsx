'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import useAuth from '@/src/hooks/useAuth';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid as MuiGrid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  CircularProgress,
  Alert,
  InputLabel,
  Select,
  Stack,
  Container,
  styled
} from '@mui/material';
import useEncuestaForm from '@/src/hooks/useEncuestasForm';

// Componente personalizado para los botones
const ActionButton = styled(Button)(({ theme }) => ({
  height: 48,
  minWidth: 180,
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}));

// Componente personalizado para los selects
const CustomSelect = styled(Select)({
  '& .MuiSelect-select': {
    padding: '12px 14px'
  },
  width: '100%', // Asegura que siempre ocupe el ancho completo
  minWidth: '100%' // Fuerza el ancho mínimo al 100%
});

const Grid = (props: any) => <MuiGrid {...props} />;
const NuevaEncuestaForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const {
    loading,
    submitting,
    error,
    tiposEncuesta,
    fincas,
    factores,
    control,
    onSubmit,
    watch,
    errors,
  } = useEncuestaForm({
    userId: user?.id || 0,
    onSuccess: () => router.push('/dashboard/encuestas'),
  });

  const selectedTipoEncuestaId = watch('tipo_encuesta_id');

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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
          Nueva Encuesta
        </Typography>
        
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
          
          {/* Tipo de Encuesta */}
          <Grid item xs={12} md={4}>
            <Controller
              name="tipo_encuesta_id"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Tipo de Encuesta"
                  fullWidth
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.tipo_encuesta_id}
                  helperText={errors.tipo_encuesta_id?.message}
                  variant="outlined"
                  sx={{
                    width: '150px',
                    minWidth: '150px',
                    '& .MuiInputBase-root': {
                      width: '150px'
                    }
                  }}
                >
                  {tiposEncuesta.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          
          {/* Finca */}
          <Grid item xs={12} md={4}>
            <Controller
              name="finca_id"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Finca"
                  fullWidth
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.finca_id}
                  helperText={errors.finca_id?.message}
                  variant="outlined"
                  sx={{
                    width: '150px',
                    minWidth: '150px',
                    '& .MuiInputBase-root': {
                      width: '150px'
                    }
                  }}
                >
                  {fincas.map((finca) => (
                    <MenuItem key={finca.id} value={finca.id}>
                      {finca.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              )}
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
              Factores a Evaluar
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
            onClick={() => router.push('/dashboard/encuestas')}
          >
            Cancelar
          </ActionButton>
          
          <ActionButton
            type="submit"
            variant="contained"
            disabled={submitting || !selectedTipoEncuestaId}
          >
            {submitting ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                Guardando...
              </Box>
            ) : 'Guardar Encuesta'}
          </ActionButton>
        </Stack>
      </Paper>
    </Container>
  );
};

export default NuevaEncuestaForm;