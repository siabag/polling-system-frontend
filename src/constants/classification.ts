// src/constants/classification.ts

/**
 * Configuración de clasificación
 */
export const CLASSIFICATION_CONFIG = {
  // Límites de archivo
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILE_SIZE_MB: 5,

  // Formatos aceptados
  ACCEPTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],

  // Compresión
  COMPRESSION_QUALITY: 0.8,

  // API
  API_ENDPOINT: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  CLASSIFICATION_ENDPOINT: '/api/v1/classification/analyze',
  TIMEOUT_MS: 300000,

  // Mensajes
  MESSAGES: {
    UPLOADING: 'Analizando imagen...',
    SUCCESS: 'Clasificación completada exitosamente',
    ERROR: 'Error al procesar la imagen',
    INVALID_FILE: 'Archivo inválido. Por favor selecciona una imagen válida',
    FILE_TOO_LARGE: 'La imagen es demasiado grande. Máximo 5MB',
  },
} as const;

/**
 * Etiquetas para estadísticas
 */
export const STATISTICS_LABELS = {
  TOTAL_LEAVES: 'Total de Hojas Detectadas',
  HEALTHY_LEAVES: 'Hojas Sanas',
  AFFECTED_LEAVES: 'Hojas Afectadas',
} as const;

/**
 * Colores para estadísticas
 */
export const STATISTICS_COLORS = {
  TOTAL: '#2196F3',
  HEALTHY: '#4CAF50',
  AFFECTED: '#F44336',
} as const;