// src/utils/imageUtils.ts

import { CLASSIFICATION_CONFIG } from '@/src/constants/classification';

/**
 * Valida si un archivo es una imagen válida
 */
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  // Validar tipo MIME
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Formato no válido. Aceptados: ${CLASSIFICATION_CONFIG.ACCEPTED_EXTENSIONS.join(', ')}`,
    };
  }

  // Validar tamaño
  if (file.size > CLASSIFICATION_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Archivo demasiado grande. Máximo ${CLASSIFICATION_CONFIG.MAX_FILE_SIZE_MB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Convierte un archivo a Base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Obtiene preview de imagen
 */
export const getImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Limpia la preview URL
 */
export const cleanImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Detecta si el dispositivo tiene cámara disponible
 */
export const hasCameraAccess = async (): Promise<boolean> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === 'videoinput');
  } catch {
    return false;
  }
};

/**
 * Solicita permiso de cámara
 */
export const requestCameraPermission = async (): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    });
    return stream;
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
    return null;
  }
};

/**
 * Detiene todos los tracks de un stream
 */
export const stopMediaStream = (stream: MediaStream): void => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};

/**
 * Comprime imagen manteniendo buena calidad
 */
export const compressImageFile = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar si es muy grande, pero mantener resolución decente
        if (width > 1920 || height > 1080) {
          const ratio = Math.min(1920 / width, 1080 / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto de canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            }
          },
          'image/jpeg',
          0.85
        );
      };
    };
  });
};