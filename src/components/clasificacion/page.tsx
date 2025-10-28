// src/app/clasificacion/page.tsx

'use client';

import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import { useClassification } from '@/src/hooks/useClassification';
import { ImageUpload } from '@/src/components/clasificacion/ImageUpload';
import { ImagePreview } from '@/src/components/clasificacion/ImagePreview';
import { ClassificationResults } from '@/src/components/clasificacion/ClassificationResults';

export default function ClasificacionPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { result, status, error, isLoading, uploadImage, resetClassification } =
    useClassification();

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    resetClassification();
  };

  const handleAnalyze = async () => {
    if (selectedImage) {
      await uploadImage(selectedImage);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    resetClassification();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Clasificador de Hojas de Café
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Utiliza visión por computadora para analizar y clasificar el estado de las hojas.
        </Typography>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ display: { xs: 'block', md: 'grid' }, gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        {/* Columna izquierda */}
        <Box>
          <Stack spacing={3}>
            {/* Paso 1 */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: selectedImage ? '#4CAF50' : '#2196F3',
                    color: '#fff',
                    mr: 1,
                    fontWeight: 700,
                  }}
                >
                  1
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Seleccionar Imagen
                </Typography>
              </Box>
              <ImageUpload
                onImageSelected={handleImageSelected}
                isLoading={isLoading}
                disabled={selectedImage !== null && isLoading}
              />
            </Box>

            {/* Paso 2 */}
            {selectedImage && status === 'idle' && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#2196F3',
                      color: '#fff',
                      mr: 1,
                      fontWeight: 700,
                    }}
                  >
                    2
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Vista Previa
                  </Typography>
                </Box>
                <ImagePreview
                  file={selectedImage}
                  onAnalyze={handleAnalyze}
                  onChangeImage={() => setSelectedImage(null)}
                  isAnalyzing={isLoading}
                />
              </Box>
            )}
          </Stack>
        </Box>

        {/* Columna derecha */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: result ? '#4CAF50' : '#e0e0e0',
                color: result ? '#fff' : '#999',
                mr: 1,
                fontWeight: 700,
              }}
            >
              3
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Resultados
            </Typography>
          </Box>
          <ClassificationResults
            result={result}
            isLoading={isLoading && status === 'loading'}
            error={error}
            onReset={handleReset}
          />
        </Box>
      </Box>

      {/* Información */}
      <Paper elevation={0} sx={{ p: 3, mt: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          ¿Cómo funciona?
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Paso 1: Selecciona tu imagen
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Puedes subir una imagen desde tu dispositivo o capturar con tu cámara.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Paso 2: Envía para análisis
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Haz clic en Analizar Imagen para procesar con inteligencia artificial.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Paso 3: Revisa los resultados
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Obtén el análisis detallado con hojas sanas y afectadas.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}