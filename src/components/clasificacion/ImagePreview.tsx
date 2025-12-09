// src/components/clasificacion/ImagePreview.tsx

'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  PlayArrow as AnalyzeIcon,
} from '@mui/icons-material';
import { getImagePreview, cleanImagePreview } from '@/src/utils/imageUtils';

interface ImagePreviewProps {
  file: File;
  onAnalyze: () => void;
  onChangeImage: () => void;
  isAnalyzing?: boolean;
}

/**
 * Componente para vista previa de imagen
 */
export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  onAnalyze,
  onChangeImage,
  isAnalyzing = false,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const loadPreview = async () => {
      const previewUrl = getImagePreview(file);
      setPreview(previewUrl);
    };

    loadPreview();

    return () => {
      if (preview) {
        cleanImagePreview(preview);
      }
    };
  }, [file, preview]);

  if (!preview) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        Vista Previa
      </Typography>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2,
          backgroundColor: '#fff',
          border: '2px solid #e0e0e0',
          aspectRatio: '4/3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={preview}
          alt="Vista previa"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* Información del archivo */}
      <Box
        sx={{
          backgroundColor: '#fff',
          p: 2,
          borderRadius: 1,
          mb: 2,
          border: '1px solid #e0e0e0',
        }}
      >
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Archivo:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {file.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Tamaño:
            </Typography>
            <Typography variant="caption">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Tipo:
            </Typography>
            <Typography variant="caption">{file.type}</Typography>
          </Box>
        </Stack>
      </Box>

      {/* Botones de acción */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="contained"
          color="success"
          startIcon={isAnalyzing ? <CircularProgress size={20} /> : <AnalyzeIcon />}
          onClick={onAnalyze}
          disabled={isAnalyzing}
          size="large"
          fullWidth
          sx={{ py: 1.2 }}
        >
          {isAnalyzing ? 'Analizando...' : 'Analizar Imagen'}
        </Button>

        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={onChangeImage}
          disabled={isAnalyzing}
          size="large"
          fullWidth
          sx={{ py: 1.2 }}
        >
          Cambiar Imagen
        </Button>
      </Stack>
    </Paper>
  );
};