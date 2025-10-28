// src/components/clasificacion/ClassificationResults.tsx

'use client';

import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  RestartAlt as RestartAltIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { ClassificationResult } from '@/types/classification';
import { StatisticsCard } from './StatisticsCard';

interface ClassificationResultsProps {
  result: ClassificationResult | null;
  isLoading?: boolean;
  error?: string | null;
  onReset: () => void;
}

export const ClassificationResults: React.FC<ClassificationResultsProps> = ({
  result,
  isLoading = false,
  error = null,
  onReset,
}) => {
  // Estado de carga
  if (isLoading) {
    return (
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Analizando imagen...</Typography>
        <Typography variant="caption" color="textSecondary">
          Por favor espera mientras procesamos la imagen
        </Typography>
      </Paper>
    );
  }

  // Estado de error
  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
          fullWidth
        >
          Intentar de Nuevo
        </Button>
      </Paper>
    );
  }

  // Sin resultados
  if (!result) {
    return (
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No hay resultados para mostrar
        </Typography>
      </Paper>
    );
  }

  const percentageHealthy =
    result.totalLeavesDetected > 0
      ? Math.round((result.healthyLeaves / result.totalLeavesDetected) * 100)
      : 0;

  const percentageAffected =
    result.totalLeavesDetected > 0
      ? Math.round((result.affectedLeaves / result.totalLeavesDetected) * 100)
      : 0;

  const handleDownloadResults = () => {
    const dataStr = JSON.stringify(
      {
        totalLeavesDetected: result.totalLeavesDetected,
        healthyLeaves: result.healthyLeaves,
        affectedLeaves: result.affectedLeaves,
        percentageHealthy,
        percentageAffected,
        timestamp: result.timestamp,
        confidence: result.confidence,
      },
      null,
      2
    );

    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clasificacion-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={3}>
      <Alert icon={<CheckCircleIcon />} severity="success">
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Clasificación completada exitosamente
        </Typography>
      </Alert>

      <Divider />

      {/* IMAGEN PROCESADA */}
      {result.processedImage && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Imagen Procesada
          </Typography>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              backgroundColor: '#fff',
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={result.processedImage}
              alt="Imagen procesada con clasificación"
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                borderRadius: '8px',
                objectFit: 'contain',
              }}
            />
          </Paper>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            Imagen con hojas clasificadas (verde: sanas, rojo: afectadas)
          </Typography>
          <Divider sx={{ my: 3 }} />
        </Box>
      )}

      {/* ESTADÍSTICAS */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Estadísticas de Clasificación
        </Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <StatisticsCard
            label="Total de Hojas"
            value={result.totalLeavesDetected}
            variant="total"
          />
          <StatisticsCard
            label="Hojas Sanas"
            value={result.healthyLeaves}
            percentage={percentageHealthy}
            variant="healthy"
          />
          <StatisticsCard
            label="Hojas Afectadas"
            value={result.affectedLeaves}
            percentage={percentageAffected}
            variant="affected"
          />
        </Stack>
      </Box>

      {/* INFORMACIÓN ADICIONAL */}
      <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Información Adicional
        </Typography>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="textSecondary">
              Fecha y Hora:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {new Date(result.timestamp).toLocaleString('es-CO')}
            </Typography>
          </Box>
          {result.confidence !== undefined && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="textSecondary">
                Confianza del Modelo:
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {result.confidence.toFixed(2)}%
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* BOTONES DE ACCIÓN */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleDownloadResults}
          fullWidth
          size="large"
        >
          Descargar Resultados
        </Button>
        <Button
          variant="contained"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
          fullWidth
          size="large"
        >
          Analizar Otra Imagen
        </Button>
      </Stack>
    </Stack>
  );
};