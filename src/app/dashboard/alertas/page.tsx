"use client";
import { Box, Typography, Paper, Card, CardContent, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  Alert as MuiAlert,
  Button,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import {
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { dataTTHApi } from '@/src/lib/apiDataTTH';
import { AlertsData, SemaforoColor, Tendencia, AlertItem } from '@/src/types/alerts';

const semaforoColor: Record<SemaforoColor, { bg: string; text: string }> = {
  GRIS: { bg: '#9ca3af', text: '#ffffff' },
  VERDE: { bg: '#22c55e', text: '#ffffff' },
  AMARILLO: { bg: '#f59e0b', text: '#ffffff' },
  NARANJA: { bg: '#f97316', text: '#ffffff' },
  ROJO: { bg: '#ef4444', text: '#ffffff' },
};

const semaforoIcon: Record<SemaforoColor, React.ReactNode> = {
  GRIS: <InfoIcon />,
  VERDE: <CheckCircleIcon />,
  AMARILLO: <WarningIcon />,
  NARANJA: <WarningIcon />,
  ROJO: <ErrorIcon />,
};


const tendenciaLabel: Record<Tendencia, string> = {
  sin_datos: 'Sin datos',
  estable: 'Estable',
  mejorando: 'Mejorando',
  empeorando: 'Empeorando',
};

// Helper para tipar correctamente el semáforo
const getSemaforoColor = (value: any): SemaforoColor => {
  return ((value ?? 'GRIS') as SemaforoColor);
};

const AlertasPage = () => {
  const [rangoFecha, setRangoFecha] = useState('ultimas-24h');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertas, setAlertas] = useState<AlertsData | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Carga automática de las últimas 24h al montar
  useEffect(() => {
    if (!isClient) return;
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    setFechaHasta(today.toISOString().split('T')[0]);
    setFechaDesde(yesterday.toISOString().split('T')[0]);

    fetchAlerts({
      start_date: yesterday.toISOString().split('T')[0],
      end_date: today.toISOString().split('T')[0],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  const buildParams = () => {
    if (rangoFecha === 'personalizado') {
      return { start_date: fechaDesde, end_date: fechaHasta };
    }

    const now = new Date();
    if (rangoFecha === 'ultimas-24h') {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return {
        start_date: yesterday.toISOString().split('T')[0],
        end_date: now.toISOString().split('T')[0],
      };
    }

    if (rangoFecha === 'ultima-semana') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return {
        start_date: weekAgo.toISOString().split('T')[0],
        end_date: now.toISOString().split('T')[0],
      };
    }

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      start_date: firstDay.toISOString().split('T')[0],
      end_date: now.toISOString().split('T')[0],
    };
  };

  const fetchAlerts = async (params?: Record<string, string>) => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = params || buildParams();
      const response = await dataTTHApi.getAlerts(queryParams);
      setAlertas(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'No se pudieron cargar las alertas');
    } finally {
      setLoading(false);
    }
  };

  const handleRangoFechaChange = (value: string) => {
    setRangoFecha(value);
    const now = new Date();

    switch (value) {
      case 'ultimas-24h': {
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        setFechaDesde(yesterday.toISOString().split('T')[0]);
        setFechaHasta(now.toISOString().split('T')[0]);
        break;
      }
      case 'ultima-semana': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        setFechaDesde(weekAgo.toISOString().split('T')[0]);
        setFechaHasta(now.toISOString().split('T')[0]);
        break;
      }
      case 'ultimo-mes': {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        setFechaDesde(firstDay.toISOString().split('T')[0]);
        setFechaHasta(now.toISOString().split('T')[0]);
        break;
      }
      default:
        break;
    }
  };

  const handleActualizar = () => {
    if (rangoFecha === 'personalizado' && (!fechaDesde || !fechaHasta)) {
      setError('Por favor selecciona fechas válidas');
      return;
    }
    fetchAlerts();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Sistema de Alertas Agronómicas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Indicadores y alertas en tiempo real basados en datos de temperatura, humedad y conductividad.
        </Typography>
      </Box>

      {/* Panel de Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', md: 'flex-end' },
          justifyContent: 'space-between',
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            flex: 1,
            flexWrap: 'wrap',
          }}>
            <TextField
              select
              label="Rango de fechas"
              value={rangoFecha}
              onChange={(e) => handleRangoFechaChange(e.target.value)}
              sx={{ minWidth: 200 }}
              size="small"
            >
              <MenuItem value="ultimas-24h">Últimas 24 horas</MenuItem>
              <MenuItem value="ultima-semana">Última semana</MenuItem>
              <MenuItem value="ultimo-mes">Último mes</MenuItem>
              <MenuItem value="personalizado">Personalizado</MenuItem>
            </TextField>
            {rangoFecha === 'personalizado' && (
              <>
                <TextField
                  type="date"
                  label="Desde"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{ minWidth: 150 }}
                />
                <TextField
                  type="date"
                  label="Hasta"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: fechaDesde }}
                  size="small"
                  sx={{ minWidth: 150 }}
                />
              </>
            )}
          </Box>
          <Box sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
          }}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />}
              onClick={handleActualizar}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Cargando' : 'Actualizar'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {error && (
        <MuiAlert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </MuiAlert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && alertas && alertas.indicadores && alertas.indicadores.estado_hidrico && alertas.indicadores.indice_riesgo_fungico && alertas.indicadores.carga_salina ? (
        <>
          {/* Indicadores principales */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
            {/* Estado Hídrico */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: semaforoColor[getSemaforoColor(alertas.indicadores.estado_hidrico.semaforo)].bg,
                        color: semaforoColor[getSemaforoColor(alertas.indicadores.estado_hidrico.semaforo)].text,
                      }}
                    >
                      {semaforoIcon[getSemaforoColor(alertas.indicadores.estado_hidrico.semaforo)]}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} mb={1}>
                        Estado Hídrico
                      </Typography>
                      {alertas.indicadores.estado_hidrico.valor_actual !== null && (
                        <Typography variant="h5" color="primary" fontWeight={700}>
                          {alertas.indicadores.estado_hidrico.valor_actual.toFixed(1)}%
                        </Typography>
                      )}
                      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        <Chip
                          size="small"
                          label={`Tendencia: ${tendenciaLabel[alertas.indicadores.estado_hidrico.tendencia ?? 'sin_datos']}`}
                          variant="outlined"
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Rango: {alertas.indicadores.estado_hidrico.umbral_min}% - {alertas.indicadores.estado_hidrico.umbral_max}%
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* Riesgo Fúngico */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: semaforoColor[getSemaforoColor(alertas.indicadores.indice_riesgo_fungico.semaforo)].bg,
                        color: semaforoColor[getSemaforoColor(alertas.indicadores.indice_riesgo_fungico.semaforo)].text,
                      }}
                    >
                      {semaforoIcon[getSemaforoColor(alertas.indicadores.indice_riesgo_fungico.semaforo)]}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} mb={1}>
                        Riesgo Fúngico
                      </Typography>
                      <Typography variant="h5" color="primary" fontWeight={700}>
                        {alertas.indicadores.indice_riesgo_fungico.indice === 0 ? 'Bajo' : 'Alto'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        {alertas.indicadores.indice_riesgo_fungico.descripcion}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* Carga Salina */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: semaforoColor['GRIS'].bg,
                        color: semaforoColor['GRIS'].text,
                      }}
                    >
                      {semaforoIcon['GRIS']}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} mb={1}>
                        Carga Salina
                      </Typography>
                      {alertas.indicadores.carga_salina.ce_actual !== null && (
                        <Typography variant="h5" color="primary" fontWeight={700}>
                          {alertas.indicadores.carga_salina.ce_actual.toFixed(2)} dS/m
                        </Typography>
                      )}
                      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        <Chip
                          size="small"
                          label={`Tendencia: ${tendenciaLabel[alertas.indicadores.carga_salina.tendencia ?? 'sin_datos']}`}
                          variant="outlined"
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Umbral: &lt; {alertas.indicadores.carga_salina.umbral_max} dS/m
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Acciones Pendientes */}
          {alertas.indicadores.acciones_pendientes.length > 0 && (
            <Paper sx={{ p: 3, mb: 4, backgroundColor: '#fef3c7' }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Acciones Pendientes
              </Typography>
              <Stack spacing={1}>
                {alertas.indicadores.acciones_pendientes.map((accion, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <WarningIcon sx={{ color: '#d97706', mt: 0.5 }} />
                    <Typography variant="body2">{accion}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* Secciones de Alertas */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Alertas Ambientales */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Alertas Ambientales
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {alertas.alertas.ambientales.length === 0 ? (
                  <MuiAlert severity="success">Sin alertas</MuiAlert>
                ) : (
                  <Stack spacing={2}>
                    {alertas.alertas.ambientales.map((alerta, idx) => (
                      <Card key={idx} variant="outlined">
                        <CardContent sx={{ pb: 2, '&:last-child': { pb: 2 } }}>
                          <Chip
                            label={alerta.nivel}
                            size="small"
                            sx={{
                              backgroundColor: `${semaforoColor[getSemaforoColor(alerta.nivel)].bg}`,
                              color: semaforoColor[getSemaforoColor(alerta.nivel)].text,
                              fontWeight: 600,
                              mb: 1,
                            }}
                          />
                          <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            {alerta.tipo}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            {alerta.condicion}
                          </Typography>
                          <Typography variant="caption" color="primary" fontWeight={600}>
                            {alerta.accion_recomendada}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Box>

            {/* Alertas de Humedad del Suelo */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Humedad del Suelo
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {alertas.alertas.humedad_suelo.length === 0 ? (
                  <MuiAlert severity="success">Sin alertas</MuiAlert>
                ) : (
                  <Stack spacing={2}>
                    {alertas.alertas.humedad_suelo.map((alerta, idx) => (
                      <Card key={idx} variant="outlined">
                        <CardContent sx={{ pb: 2, '&:last-child': { pb: 2 } }}>
                          <Chip
                            label={alerta.nivel}
                            size="small"
                            sx={{
                              backgroundColor: `${semaforoColor[alerta.nivel].bg}`,
                              color: semaforoColor[alerta.nivel].text,
                              fontWeight: 600,
                              mb: 1,
                            }}
                          />
                          <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            {alerta.tipo}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            {alerta.condicion}
                          </Typography>
                          <Typography variant="caption" color="primary" fontWeight={600}>
                            {alerta.accion_recomendada}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Box>

            {/* Alertas de Conductividad */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Conductividad Eléctrica
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {alertas.alertas.conductividad_electrica.length === 0 ? (
                  <MuiAlert severity="success">Sin alertas</MuiAlert>
                ) : (
                  <Stack spacing={2}>
                    {alertas.alertas.conductividad_electrica.map((alerta, idx) => (
                      <Card key={idx} variant="outlined">
                        <CardContent sx={{ pb: 2, '&:last-child': { pb: 2 } }}>
                          <Chip
                            label={alerta.nivel}
                            size="small"
                            sx={{
                              backgroundColor: `${semaforoColor[alerta.nivel].bg}`,
                              color: semaforoColor[alerta.nivel].text,
                              fontWeight: 600,
                              mb: 1,
                            }}
                          />
                          <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            {alerta.tipo}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            {alerta.condicion}
                          </Typography>
                          <Typography variant="caption" color="primary" fontWeight={600}>
                            {alerta.accion_recomendada}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Box>
          </Box>
        </>
      ) : null}
    </Container>
  );
};

export default AlertasPage;
