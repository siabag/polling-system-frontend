// src/components/clasificacion/ImageUpload.tsx

'use client';

import { compressImageFile } from '@/src/utils/imageUtils';
import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Alert,
  Paper,
  Typography,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useImageCapture } from '@/src/hooks/useImageCapture';
import { CLASSIFICATION_CONFIG } from '@/src/constants/classification';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * Componente para subir o capturar imagen
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelected,
  isLoading = false,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { videoRef, canvasRef, isStreamActive, error: cameraError, startCamera, capturePhoto, stopCamera } =
    useImageCapture();

  /**
   * Maneja la selección de archivo
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
  setUploadError(null);
  const file = event.target.files?.[0];

  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

  // Validar tipo
  if (!validTypes.includes(file.type)) {
    setUploadError(`Formato no válido. Aceptados: ${CLASSIFICATION_CONFIG.ACCEPTED_EXTENSIONS.join(', ')}`);
    return;
  }

  try {
    const compressed = await compressImageFile(file);
    onImageSelected(compressed);
  } catch (error) {
    setUploadError('Error al procesar la imagen');
    console.error('Error:', error);
  }

  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

  /**
   * Maneja el click en el botón de subir
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Maneja iniciar cámara
   */
  const handleStartCamera = async () => {
    setUploadError(null);
    setShowCamera(true);
    await startCamera();
  };

  /**
   * Maneja captura de foto
   */
  const handleCapture = () => {
    const photo = capturePhoto();
    if (photo) {
      stopCamera();
      setShowCamera(false);
      onImageSelected(photo);
    }
  };

  /**
   * Maneja cancelar cámara
   */
  const handleCancelCamera = () => {
    stopCamera();
    setShowCamera(false);
    setUploadError(null);
  };

  // Mostrar vista de cámara
  if (showCamera) {
    return (
      <Paper elevation={2} sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          Capturar Foto
        </Typography>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#000',
            borderRadius: 2,
            overflow: 'hidden',
            mb: 2,
            aspectRatio: '4/3',
          }}
        >
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            autoPlay
            playsInline
          />
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </Box>

        {cameraError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {cameraError}
          </Alert>
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="success"
            startIcon={<PhotoCameraIcon />}
            onClick={handleCapture}
            disabled={!isStreamActive || isLoading}
            size="large"
          >
            Capturar
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancelCamera}
            disabled={isLoading}
            size="large"
          >
            Cancelar
          </Button>
        </Stack>
      </Paper>
    );
  }

  // Vista principal
  return (
    <Paper elevation={2} sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        Seleccionar Imagen
      </Typography>

      <Typography variant="body2" color="textSecondary" gutterBottom>
        Sube una foto o captura una con tu cámara para analizar las hojas
      </Typography>

      {uploadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {uploadError}
        </Alert>
      )}

      <Stack spacing={2} sx={{ mt: 3 }}>
        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept={CLASSIFICATION_CONFIG.ACCEPTED_EXTENSIONS.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Botones */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadClick}
            disabled={isLoading || disabled}
            size="large"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Subir Imagen
          </Button>

          <Button
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            onClick={handleStartCamera}
            disabled={isLoading || disabled}
            size="large"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Capturar con Cámara
          </Button>
        </Stack>

        {/* Información */}
        <Box sx={{ backgroundColor: '#fff', p: 2, borderRadius: 1 }}>
          <Typography variant="caption" color="textSecondary">
            📋 Requisitos:
            <br />
            • Formatos: JPG, PNG, WebP
            <br />
            • Tamaño máximo: {CLASSIFICATION_CONFIG.MAX_FILE_SIZE_MB}MB
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};