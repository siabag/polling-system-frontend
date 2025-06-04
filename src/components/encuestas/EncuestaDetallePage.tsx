'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useAuth from '@/src/hooks/useAuth';
import { surveyApi } from '@/src/lib/apiSurvey';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid as MuiGrid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Container,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';
import { Encuesta } from '@/src/types/survey';
import { formatDate } from '@/src/lib/utils';

const Grid = (props: any) => <MuiGrid {...props} />;

const EncuestaDetallePage = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const encuestaId = params?.id as string;

  useEffect(() => {
    if (encuestaId && user) {
      loadEncuesta();
    }
  }, [encuestaId, user]);

  const loadEncuesta = async () => {
    try {
      setLoading(true);
      const response = await surveyApi.getEncuestaById(Number(encuestaId));
      console.log(response.data);
      
      setEncuesta(response.data);
      setError(null);
    } catch (error) {
      console.error('Error cargando encuesta:', error);
      setError('Error al cargar la encuesta');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/encuestas/${encuestaId}/editar`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !encuesta) {
    return (
      <Container maxWidth="lg">
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/dashboard/encuestas')}
            sx={{ mb: 3 }}
          >
            Volver
          </Button>
          <Alert severity="error">
            {error || 'No se pudo cargar la encuesta'}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Encabezado */}
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2
        }}>
          <Typography variant="h4" component="h1" fontWeight="600">
            Detalle de Encuesta
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Imprimir
            </Button>
            {!encuesta.completada && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Editar
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/dashboard/encuestas')}
            >
              Volver
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Información General */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Información General
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                  Estado:
                </Typography>
                {encuesta.completada ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Completada"
                    size="small"
                    color="success"
                  />
                ) : (
                  <Chip
                    icon={<HourglassEmptyIcon />}
                    label="Pendiente"
                    size="small"
                    color="warning"
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                  Fecha de Aplicación:
                </Typography>
                <Typography>{formatDate(encuesta.fecha_aplicacion)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3, flexWrap: 'wrap' }}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                  Tipo de Encuesta:
                </Typography>
                <Typography>
                  {encuesta.tipo_encuesta?.nombre} - {encuesta.tipo_encuesta?.descripcion}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3, flexWrap: 'wrap' }}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                  Finca:
                </Typography>
                <Box>
                  <Typography>{encuesta.finca?.nombre}</Typography>
                  {encuesta.finca?.ubicacion && (
                    <Typography variant="body2" color="text.secondary">
                      {encuesta.finca.ubicacion}
                    </Typography>
                  )}
                </Box>
              </Box>
              {encuesta.observaciones && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                    Observaciones:
                  </Typography>
                  <Typography sx={{ flex: 1 }}>{encuesta.observaciones}</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Metadata */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Información de Registro
              </Typography>
              <Box sx={{ display: 'flex', mb: 3, mt: 2 }}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                  Creado por:
                </Typography>
                <Typography>
                  {encuesta.usuario?.nombre} {encuesta.usuario?.apellido}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                  Fecha de Creación:
                </Typography>
                <Typography>{formatDate(encuesta.created_at || encuesta.created_at || '')}</Typography>
              </Box>
              {encuesta.updated_at && (
                <Box sx={{ display: 'flex' }}>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                    Última Actualización:
                  </Typography>
                  <Typography>{formatDate(encuesta.updated_at)}</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Factores y Respuestas */}
          <Grid item xs={12}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Factores Evaluados
              </Typography>
              <Divider sx={{ mb: 4 }} />
              
              <Grid container spacing={3}>
                {encuesta.respuestas?.map((respuesta) => (
                  <Grid item xs={12} sm={6} lg={4} key={respuesta.id}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="600">
                          {respuesta.factor?.nombre}
                        </Typography>
                        {respuesta.factor?.descripcion && (
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {respuesta.factor.descripcion}
                          </Typography>
                        )}
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label={`${respuesta.valor_posible?.valor} (${respuesta.valor_posible?.codigo})`}
                            color="primary"
                            sx={{ mb: 1 }}
                          />
                          {respuesta.valor_posible?.descripcion && (
                            <Typography variant="body2" color="text.secondary">
                              {respuesta.valor_posible.descripcion}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {(!encuesta.respuestas || encuesta.respuestas.length === 0) && (
                <Alert severity="info">
                  No se han registrado respuestas para esta encuesta
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EncuestaDetallePage;