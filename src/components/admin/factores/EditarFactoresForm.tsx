'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { surveyApi } from '@/src/lib/apiSurvey';
import { TipoEncuesta, Factor, ValorPosible, UpdateFactorData } from '@/src/types/survey';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid as MuiGrid,
  IconButton,
  CircularProgress,
  Alert,
  Container,
  Switch,
  FormControlLabel,
  styled
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
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
// Componente para valor posible
const ValorPosibleItem = ({ 
  index, 
  onRemove, 
  control, 
  errors,
  watch
}: { 
  index: number; 
  onRemove: () => void; 
  control: any;
  errors: any;
  watch: any;
}) => {
  const activo = watch(`valores_posibles.${index}.activo`);
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 2, 
        borderLeft: '4px solid',
        borderColor: activo ? 'primary.main' : 'text.disabled',
        backgroundColor: 'background.paper'
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          Valor {index + 1}
        </Typography>
        <Box display="flex" alignItems="center">
          <Controller
            name={`valores_posibles.${index}.activo`}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch 
                    checked={field.value} 
                    onChange={field.onChange}
                  />
                }
                label={field.value ? "Activo" : "Inactivo"}
              />
            )}
          />
          <IconButton onClick={onRemove} color="error" size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            name={`valores_posibles.${index}.valor`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Etiqueta del Valor *"
                fullWidth
                variant="outlined"
                error={!!errors.valores_posibles?.[index]?.valor}
                helperText={errors.valores_posibles?.[index]?.valor?.message}
                placeholder="Ej: Bueno, Regular, Malo"
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name={`valores_posibles.${index}.codigo`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Código (Puntuación) *"
                type="number"
                fullWidth
                variant="outlined"
                error={!!errors.valores_posibles?.[index]?.codigo}
                helperText={errors.valores_posibles?.[index]?.codigo?.message}
                inputProps={{ min: 1 }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name={`valores_posibles.${index}.descripcion`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descripción"
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                placeholder="Descripción detallada de este valor"
              />
            )}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

interface EditarFactorFormProps {
  id: string;
}


export default function EditarFactorForm({ id }: EditarFactorFormProps) {
  const factorId = parseInt(id);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tiposEncuesta, setTiposEncuesta] = useState<TipoEncuesta[]>([]);
  const [factor, setFactor] = useState<Factor & { valores_posibles: ValorPosible[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Configuración del formulario con React Hook Form
  const { 
    control, 
    handleSubmit, 
    watch, 
    formState: { errors }, 
    setValue,
    getValues,
    reset
  } = useForm<UpdateFactorData>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      categoria: '',
      activo: true,
      valores_posibles: []
    }
  });
  
  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Cargar tipos de encuesta
        const tiposResponse = await surveyApi.getTiposEncuesta();
        setTiposEncuesta(tiposResponse.data);
        
        // Cargar factor a editar
        const factorResponse = await surveyApi.getFactorById(factorId);
        setFactor(factorResponse.data);
        
        // Inicializar formulario con datos del factor
        reset({
          nombre: factorResponse.data.nombre,
          descripcion: factorResponse.data.descripcion || '',
          categoria: factorResponse.data.categoria || '',
          activo: factorResponse.data.activo,
          valores_posibles: factorResponse.data.valores_posibles.map((valor:ValorPosible) => ({
            id: valor.id,
            valor: valor.valor,
            codigo: valor.codigo,
            descripcion: valor.descripcion || '',
            activo: valor.activo
          }))
        });
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudo cargar la información del factor');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [factorId, reset]);
  
  // Agregar un nuevo valor posible
  const addValorPosible = () => {
    const valores = getValues('valores_posibles') || [];
    // Calcular el siguiente código (el último + 1 o 1 si no hay valores)
    const lastCodigo = valores.length > 0 
      ? Math.max(...valores.map(v => v.codigo)) 
      : 0;
    
    setValue('valores_posibles', [
      ...valores,
      { valor: '', codigo: lastCodigo + 1, descripcion: '', activo: true }
    ]);
  };
  
  // Eliminar un valor posible
  const removeValorPosible = (index: number) => {
    const valores = getValues('valores_posibles');
    
    if (!valores || valores.length <= 1) {
      setError('Debe haber al menos un valor posible');
      return;
    }
    
    setValue(
      'valores_posibles', 
      valores?.filter((_, i) => i !== index)
    );
  };
  
  // Enviar formulario
  const onSubmit = handleSubmit(async (data) => {
    // Validar que todos los valores posibles tengan nombre y código
    const invalidValores = data?.valores_posibles?.some(v => !v.valor.trim() || v.codigo <= 0);
    if (invalidValores) {
      setError('Todos los valores posibles deben tener nombre y código válido');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      await surveyApi.updateFactor(factorId, data);
      router.push('/dashboard/admin/factores');
    } catch (err) {
      console.error('Error al actualizar factor:', err);
      setError('Error al actualizar el factor');
    } finally {
      setSubmitting(false);
    }
  });
  
  // Observar valores para lógica condicional
  const valoresPosibles = watch('valores_posibles');
  const isActive = watch('activo');
  
  // Renderizar pantalla de carga
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }
  
  // Renderizar mensaje de error si no se encuentra el factor
  if (!factor) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Factor no encontrado
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => router.push('/dashboard/admin/factores')}
        >
          Volver a la lista
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.push('/dashboard/admin/factores')}
          variant="text"
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1" fontWeight="600">
          Editar Factor: {factor.nombre}
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
          <Grid item xs={12} md={6}>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'El nombre es obligatorio' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre del Factor *"
                  fullWidth
                  variant="outlined"
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                  placeholder="Ej: Calidad del grano"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="categoria"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Categoría"
                  fullWidth
                  variant="outlined"
                  placeholder="Ej: Cosecha, Poscosecha, Cultivo"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Tipo de Encuesta"
              fullWidth
              variant="outlined"
              value={tiposEncuesta.find(t => t.id === factor.tipo_encuesta_id)?.nombre || 'Desconocido'}
              disabled
              helperText="El tipo de encuesta no se puede modificar"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
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
                      <Typography>Estado</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {field.value ? "Factor activo" : "Factor inactivo"}
                      </Typography>
                    </Box>
                  }
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  placeholder="Descripción detallada del factor"
                />
              )}
            />
          </Grid>
        </Grid>
        
        {/* Sección de Valores Posibles */}
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
            Valores Posibles
          </Typography>
          
          {valoresPosibles?.map((_, index) => (
            <ValorPosibleItem
              key={index}
              index={index}
              onRemove={() => removeValorPosible(index)}
              control={control}
              errors={errors}
              watch={watch}
            />
          ))}
          
          <Button
            variant="outlined"
            startIcon={<AddCircleIcon />}
            onClick={addValorPosible}
            fullWidth
            sx={{ mt: 2 }}
          >
            Agregar Valor Posible
          </Button>
        </Box>
        
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
            onClick={() => router.push('/dashboard/admin/factores')}
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
            ) : 'Actualizar Factor'}
          </ActionButton>
        </Box>
      </Paper>
    </Container>
  );
}
