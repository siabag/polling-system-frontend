// src/hooks/useEncuestaForm.ts

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { surveyApi } from '@/src/lib/apiSurvey';
import {
  TipoEncuesta,
  Finca,
  Factor,
  CreateEncuestaData,
  Encuesta,
  UpdateEncuestaData
} from '@/src/types/survey';

// Esquema de validación para crear/editar encuestas
const schema = yup.object().shape({
  fecha_aplicacion: yup.string().required('La fecha es requerida'),
  tipo_encuesta_id: yup.number().required('El tipo de encuesta es requerido'),
  finca_id: yup.number().required('La finca es requerida'),
  observaciones: yup.string(),
  completada: yup.boolean(),
  respuestas: yup.array().of(
    yup.object().shape({
      factor_id: yup.number().required(),
      valor_posible_id: yup.number().required('Debe seleccionar un valor'),
      respuesta_texto: yup.string(),
    })
  ),
});

interface UseEncuestaFormProps {
  userId: number;
  encuestaId?: number; // Opcional, solo para edición
  onSuccess?: (data: Encuesta) => void;
  onError?: (error: any) => void;
}

export const useEncuestaForm = ({ userId, encuestaId, onSuccess, onError }: UseEncuestaFormProps) => {
  // Estados
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tiposEncuesta, setTiposEncuesta] = useState<TipoEncuesta[]>([]);
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [factores, setFactores] = useState<Factor[]>([]);
  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
  
  // Configurar el formulario
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fecha_aplicacion: new Date().toISOString().split('T')[0],
      tipo_encuesta_id: 0,
      finca_id: 0,
      observaciones: '',
      completada: false,
      respuestas: [],
    },
  });

  const selectedTipoEncuestaId = watch('tipo_encuesta_id');

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, [userId]);

  // Cargar datos de la encuesta si es modo edición
  useEffect(() => {
    if (encuestaId) {
      loadEncuesta(encuestaId);
    }
  }, [encuestaId]);

  // Cargar factores cuando se selecciona un tipo de encuesta
  useEffect(() => {
    if (selectedTipoEncuestaId && selectedTipoEncuestaId !== 0) {
      loadFactores(selectedTipoEncuestaId);
    } else {
      setFactores([]);
      setValue('respuestas', []);
    }
  }, [selectedTipoEncuestaId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [tiposRes, fincasRes] = await Promise.all([
        surveyApi.getTiposEncuesta(),
        surveyApi.getFincas({ usuario_id: userId }),
      ]);
      setTiposEncuesta(tiposRes.data);
      setFincas(fincasRes.data);
      setError(null);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      setError('Error al cargar los datos necesarios');
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadEncuesta = async (id: number) => {
    try {
      setLoading(true);
      const response = await surveyApi.getEncuestaById(id);
      const encuestaData = response.data;
      setEncuesta(encuestaData);
      
      console.log('Encuesta cargada:', encuestaData);
      console.log('Respuestas existentes:', encuestaData.respuestas);
      
      // Establecer valores del formulario
      reset({
        fecha_aplicacion: encuestaData.fecha_aplicacion,
        tipo_encuesta_id: encuestaData.tipo_encuesta_id,
        finca_id: encuestaData.finca_id,
        observaciones: encuestaData.observaciones || '',
        completada: encuestaData.completada || false,
        respuestas: encuestaData.respuestas?.map((r:any) => ({
          factor_id: r.factor_id,
          valor_posible_id: r.valor_posible_id || 0,
          respuesta_texto: r.respuesta_texto || '',
        })) || [],
      });
      
      setError(null);
    } catch (error) {
      console.error('Error cargando encuesta:', error);
      setError('Error al cargar los datos de la encuesta');
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFactores = async (tipoEncuestaId: number) => {
    try {
      const response = await surveyApi.getFactoresConValoresByTipoEncuesta(tipoEncuestaId);
      setFactores(response.data);
      
      // Si no estamos en modo edición, inicializamos las respuestas normalmente
      if (!encuestaId) {
        const initialRespuestas = response.data.map((factor: Factor) => ({
          factor_id: factor.id,
          valor_posible_id: 0,
          respuesta_texto: '',
        }));
        setValue('respuestas', initialRespuestas);
      } else {
        // Si estamos en modo edición, necesitamos verificar que todos los factores tengan respuesta
        const currentRespuestas = watch('respuestas') || [];
        const updatedRespuestas = response.data.map((factor: Factor) => {
          // Buscar si ya existe una respuesta para este factor
          const existingRespuesta = currentRespuestas.find((r: any) => r.factor_id === factor.id);
          
          if (existingRespuesta) {
            // Si existe, mantenerla
            return existingRespuesta;
          } else {
            // Si no existe, crear una nueva (factor agregado después de crear la encuesta)
            console.log(`Agregando nuevo factor ${factor.id} - ${factor.nombre} a encuesta existente`);
            return {
              factor_id: factor.id,
              valor_posible_id: 0,
              respuesta_texto: '',
            };
          }
        });
        
        setValue('respuestas', updatedRespuestas);
        console.log('Respuestas actualizadas con nuevos factores:', updatedRespuestas);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error cargando factores:', error);
      setError('Error al cargar los factores de la encuesta');
      if (onError) onError(error);
    }
  };

  // FUNCIÓN DE SUBMIT PRINCIPAL
  const submitForm = async (data: any) => {
    console.log("=== INICIO SUBMIT ===");
    console.log("Datos recibidos:", data);
    console.log("Modo edición:", !!encuestaId);
    console.log("ID Encuesta:", encuestaId);

    try {
      setSubmitting(true);
      setError(null);
      
      const formattedData = {
        ...data,
        respuestas: data.respuestas?.filter((r: any) => r.valor_posible_id && r.valor_posible_id > 0) || [],
      };
      
      console.log("Datos formateados:", formattedData);
      
      let response;
      if (encuestaId) {
        // Modo edición
        console.log("=== EDITANDO ENCUESTA ===");
        response = await surveyApi.updateEncuesta(
          encuestaId,
          formattedData as UpdateEncuestaData,
          userId
        );
        console.log("Respuesta edición:", response);
      } else {
        // Modo creación
        console.log("=== CREANDO ENCUESTA ===");
        response = await surveyApi.createEncuesta(
          formattedData as CreateEncuestaData,
          userId
        );
        console.log("Respuesta creación:", response);
      }
      
      console.log("=== ÉXITO ===");
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('=== ERROR ===', error);
      const errorMessage = error.response?.data?.message || 'Error al procesar la encuesta';
      setError(errorMessage);
      if (onError) {
        onError(error);
      }
      throw error;
    } finally {
      console.log("=== FIN SUBMIT ===");
      setSubmitting(false);
    }
  };

  // Método para marcar como completada/pendiente
  const toggleCompletada = (completada: boolean) => {
    console.log("Cambiando estado completada a:", completada);
    setValue('completada', completada);
  };

  // Crear la función onSubmit que será exportada
  const onSubmit = handleSubmit((data) => {
    console.log("=== HANDLER SUBMIT EJECUTADO ===");
    return submitForm(data);
  });

  return {
    // Estados
    loading,
    submitting,
    error,
    tiposEncuesta,
    fincas,
    factores,
    encuesta,
    
    // Form
    control,
    handleSubmit,
    watch,
    setValue,
    errors,
    
    // Métodos
    onSubmit, // Función completa handleSubmit + submitForm
    setError,
    toggleCompletada,
    reload: loadInitialData,
  };
};

export default useEncuestaForm;