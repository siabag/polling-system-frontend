// src/hooks/useImageCapture.ts

import { useRef, useState, useCallback, useEffect } from 'react';
import { stopMediaStream } from '@/src/utils/imageUtils';

interface UseImageCaptureReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isStreamActive: boolean;
  error: string | null;
  startCamera: () => Promise<void>;
  capturePhoto: () => File | null;
  stopCamera: () => void;
}

/**
 * Hook para captura de fotos con cámara
 */
export const useImageCapture = (): UseImageCaptureReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Inicia la cámara
   */
  const startCamera = useCallback(async () => {
    try {
      setError(null);

      // Si ya hay stream activo, retornar
      if (isStreamActive && streamRef.current) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => {
          console.error('Error al reproducir video:', err);
          setError('No se pudo reproducir el video de la cámara');
        });
      }

      streamRef.current = stream;
      setIsStreamActive(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al acceder a la cámara';

      if (errorMessage.includes('NotAllowedError')) {
        setError('Permiso de cámara denegado. Por favor habilita el acceso a la cámara.');
      } else if (errorMessage.includes('NotFoundError')) {
        setError('No se encontró ninguna cámara disponible en este dispositivo.');
      } else {
        setError(errorMessage);
      }

      console.error('Error al iniciar cámara:', err);
    }
  }, [isStreamActive]);

  /**
   * Captura una foto de la cámara
   */
  const capturePhoto = useCallback((): File | null => {
    try {
      if (!videoRef.current || !canvasRef.current) {
        setError('Elementos de video o canvas no disponibles');
        return null;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        setError('No se pudo obtener el contexto del canvas');
        return null;
      }

      // Establecer dimensiones del canvas según el video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Dibujar frame actual del video en el canvas
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      // Crear archivo desde canvas
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      const arr = base64.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);

      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }

      const file = new File([u8arr], `foto-${Date.now()}.jpg`, { type: mime });
      return file;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al capturar foto';
      setError(errorMessage);
      console.error('Error al capturar:', err);
      return null;
    }
  }, []);

  /**
   * Detiene la cámara
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      stopMediaStream(streamRef.current);
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreamActive(false);
    setError(null);
  }, []);

  /**
   * Limpieza al desmontar
   */
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
    canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
    isStreamActive,
    error,
    startCamera,
    capturePhoto,
    stopCamera,
  };
};