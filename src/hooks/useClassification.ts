// src/hooks/useClassification.ts

import { useState, useCallback } from 'react';
import { ClassificationResult, ClassificationStatus } from '@/src/types/classification';
import { ClassificationService } from '@/src/services/classificationService';
import { validateImage } from '@/src/utils/imageUtils';

interface UseClassificationReturn {
  result: ClassificationResult | null;
  status: ClassificationStatus;
  error: string | null;
  isLoading: boolean;
  uploadImage: (file: File) => Promise<void>;
  resetClassification: () => void;
}

/**
 * Hook para gestionar la clasificación de hojas
 */
export const useClassification = (): UseClassificationReturn => {
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [status, setStatus] = useState<ClassificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Carga y analiza una imagen
   */
  const uploadImage = useCallback(async (file: File) => {
    try {
      // Resetear estado anterior
      setError(null);
      setStatus('loading');
      setIsLoading(true);

      // Validar archivo
      const validation = validateImage(file);
      if (!validation.valid) {
        throw new Error(validation.error || 'Archivo inválido');
      }

      // Enviar al backend
      const response = await ClassificationService.analyzeImage(file);

      if (!response.success) {
        throw new Error(response.error || 'Error en la clasificación');
      }

      // Calcular porcentajes
      const percentages = ClassificationService.calculatePercentages(response.data);

      setResult({
        ...response.data,
        ...percentages,
      });

      setStatus('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setStatus('error');
      console.error('Error en clasificación:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Resetea el estado de clasificación
   */
  const resetClassification = useCallback(() => {
    setResult(null);
    setStatus('idle');
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    result,
    status,
    error,
    isLoading,
    uploadImage,
    resetClassification,
  };
};