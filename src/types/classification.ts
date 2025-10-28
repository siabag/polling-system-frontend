//define qué tipo de datos usaremos en toda la app.

// src/types/classification.ts

/**
 * Resultado de la clasificación de hojas
 */
export interface ClassificationResult {
  totalLeavesDetected: number;
  healthyLeaves: number;
  affectedLeaves: number;
  processedImage: string;
  confidence?: number;
  timestamp: Date;
}

/**
 * Respuesta del servidor
 */
export interface ClassificationResponse {
  success: boolean;
  data: ClassificationResult;
  error?: string;
  message?: string;
}

/**
 * Estado de la clasificación
 */
export type ClassificationStatus = 'idle' | 'loading' | 'success' | 'error';