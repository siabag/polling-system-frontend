// src/services/classificationService.ts

import axios from 'axios';
import { ClassificationResponse, ClassificationResult } from '@/src/types/classification';
import { CLASSIFICATION_CONFIG } from '@/src/constants/classification';

/**
 * Servicio para clasificación de hojas
 */
export class ClassificationService {
  /**
   * Analiza una imagen enviándola al backend
   */
  static async analyzeImage(imageFile: File): Promise<ClassificationResponse> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(
        `${CLASSIFICATION_CONFIG.API_ENDPOINT}${CLASSIFICATION_CONFIG.CLASSIFICATION_ENDPOINT}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: CLASSIFICATION_CONFIG.TIMEOUT_MS,
        }
      );

      const data: ClassificationResponse = response.data;

      if (!data.success) {
        throw new Error(data.error || 'Error desconocido en la clasificación');
      }

      return {
        ...data,
        data: {
          ...data.data,
          timestamp: new Date(data.data.timestamp),
        },
      };
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : error instanceof Error
            ? error.message
            : 'Error desconocido al procesar la imagen';

      return {
        success: false,
        data: {} as ClassificationResult,
        error: errorMessage,
      };
    }
  }

  /**
   * Calcula porcentajes de hojas sanas y afectadas
   */
  static calculatePercentages(result: ClassificationResult): {
    percentageHealthy: number;
    percentageAffected: number;
  } {
    const total = result.totalLeavesDetected;

    if (total === 0) {
      return { percentageHealthy: 0, percentageAffected: 0 };
    }

    return {
      percentageHealthy: Math.round((result.healthyLeaves / total) * 100),
      percentageAffected: Math.round((result.affectedLeaves / total) * 100),
    };
  }
}