'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
  Assessment as AssessmentIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { dataTTHApi } from '@/src/lib/apiDataTTH';
import { DataPoint } from '@/src/types/dataTTH';

// Función para formatear datos de la API al formato del gráfico
const formatDataForChart = (dataPoints: DataPoint[]) => {
  return dataPoints.map(point => {
    const date = new Date(point.fecha_hora);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return {
      timestamp: `${day}/${month}/${year} ${hours}:${minutes}`,
      fullDate: point.fecha_hora,
      valor: point.valor
    };
  });
};

// Función para exportar a CSV
const exportToCSV = (data: any, filename: string) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row: any) => headers.map(header => row[header]).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

const Dashboard = () => {
  const router = useRouter();
  const [rangoFecha, setRangoFecha] = useState('ultimas-24h');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para los datos de cada métrica
  const [temperaturaAmbiente, setTemperaturaAmbiente] = useState<any[]>([]);
  const [humedadAmbiente, setHumedadAmbiente] = useState<any[]>([]);
  const [temperaturaSuelo, setTemperaturaSuelo] = useState<any[]>([]);
  const [humedadSuelo, setHumedadSuelo] = useState<any[]>([]);
  const [conductividadSuelo, setConductividadSuelo] = useState<any[]>([]);

  // Inicializar fechas por defecto (últimas 24 horas)
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    setFechaHasta(today.toISOString().split('T')[0]);
    setFechaDesde(yesterday.toISOString().split('T')[0]);
  }, []);

  // Cargar datos solo cuando cambia el rango predefinido
  useEffect(() => {
    if (fechaDesde && fechaHasta && rangoFecha !== 'personalizado') {
      loadData();
    }
  }, [rangoFecha]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      let params = {};
      
      if (rangoFecha === 'personalizado') {
        params = {
          start_date: fechaDesde,
          end_date: fechaHasta
        };
      } else if (rangoFecha === 'ultimas-24h') {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        params = {
          start_date: yesterday.toISOString().split('T')[0],
          end_date: now.toISOString().split('T')[0]
        };
      } else if (rangoFecha === 'ultima-semana') {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        params = {
          start_date: weekAgo.toISOString().split('T')[0],
          end_date: now.toISOString().split('T')[0]
        };
      } else {
        params = {
          start_date: fechaDesde,
          end_date: fechaHasta
        };
      }

      const response = await dataTTHApi.getData(params);

      if (response.success) {
        setTemperaturaAmbiente(formatDataForChart(response.data.temperatura_ambiente));
        setHumedadAmbiente(formatDataForChart(response.data.humedad_ambiente));
        setTemperaturaSuelo(formatDataForChart(response.data.temperatura_suelo));
        setHumedadSuelo(formatDataForChart(response.data.humedad_suelo));
        setConductividadSuelo(formatDataForChart(response.data.conductividad_suelo || []));
      }
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError(err.response?.data?.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleActualizar = () => {
    if (fechaDesde && fechaHasta && fechaDesde <= fechaHasta) {
      loadData();
    }
  };

  const handleDescargarCSV = () => {
    const allData = temperaturaAmbiente.map((item, index) => ({
      timestamp: item.timestamp,
      temperatura_ambiente: item.valor,
      humedad_ambiente: humedadAmbiente[index]?.valor || '',
      temperatura_suelo: temperaturaSuelo[index]?.valor || '',
      humedad_suelo: humedadSuelo[index]?.valor || '',
      conductividad_suelo: conductividadSuelo[index]?.valor || '',
    }));

    const filename = `datos_ambientales_${fechaDesde}_${fechaHasta}.csv`;
    exportToCSV(allData, filename);
  };

  const handleRangoFechaChange = (value: string) => {
    setRangoFecha(value);
    
    const now = new Date();
    
    switch(value) {
      case 'ultimas-24h':
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        setFechaDesde(yesterday.toISOString().split('T')[0]);
        setFechaHasta(now.toISOString().split('T')[0]);
        break;
      case 'ultima-semana':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        setFechaDesde(weekAgo.toISOString().split('T')[0]);
        setFechaHasta(now.toISOString().split('T')[0]);
        break;
      case 'ultimo-mes':
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        setFechaDesde(firstDayOfMonth.toISOString().split('T')[0]);
        setFechaHasta(now.toISOString().split('T')[0]);
        break;
      case 'personalizado':
        break;
    }
  };

  const handleFechaDesdeChange = (newFechaDesde: string) => {
    setFechaDesde(newFechaDesde);
    if (newFechaDesde > fechaHasta) {
      setFechaHasta(newFechaDesde);
    }
  };

  const handleFechaHastaChange = (newFechaHasta: string) => {
    if (newFechaHasta < fechaDesde) {
      setFechaHasta(fechaDesde);
    } else {
      setFechaHasta(newFechaHasta);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Encabezado */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
            Monitoreo Ambiental
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sistema de medición de temperatura, humedad y conductividad en tiempo real
          </Typography>
        </Box>

        {/* Controles de Filtros */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', md: 'flex-start' },
            justifyContent: 'space-between'
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              flex: 1,
              flexWrap: 'wrap'
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
                    onChange={(e) => handleFechaDesdeChange(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ minWidth: 150 }}
                  />
                  <TextField
                    type="date"
                    label="Hasta"
                    value={fechaHasta}
                    onChange={(e) => handleFechaHastaChange(e.target.value)}
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
              flexWrap: 'wrap'
            }}>
              <Button
                variant="outlined"
                startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                onClick={handleActualizar}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? 'Cargando...' : 'Actualizar'}
              </Button>
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={handleDescargarCSV}
                disabled={loading || temperaturaAmbiente.length === 0}
                sx={{ minWidth: 150 }}
              >
                Descargar CSV
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AssessmentIcon />}
                onClick={() => router.push('/dashboard/reportes')}
                sx={{ minWidth: 150 }}
              >
                Ver Reportes
              </Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={<AssignmentIcon />}
                onClick={() => router.push('/dashboard/alertas')}
                sx={{ minWidth: 150 }}
              >
                Ver Alertas
              </Button>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && (
          <>
            {/* Temperatura Ambiente */}
            <Paper sx={{ p: 4, mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Temperatura Ambiente
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Medición en grados Celsius (°C)
                </Typography>
              </Box>
              
              {temperaturaAmbiente.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={temperaturaAmbiente}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      stroke="#94a3b8"
                      height={80}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      labelFormatter={(value) => `Fecha: ${value}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={false}
                      name="Temperatura (°C)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Alert severity="info">No hay datos disponibles para este rango de fechas</Alert>
              )}
            </Paper>

            {/* Humedad Ambiente */}
            <Paper sx={{ p: 4, mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Humedad Ambiente
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Medición en porcentaje (%)
                </Typography>
              </Box>
              
              {humedadAmbiente.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={humedadAmbiente}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      stroke="#94a3b8"
                      height={80}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      labelFormatter={(value) => `Fecha: ${value}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                      name="Humedad (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Alert severity="info">No hay datos disponibles para este rango de fechas</Alert>
              )}
            </Paper>

            {/* Temperatura del Suelo */}
            <Paper sx={{ p: 4, mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Temperatura del Suelo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Medición en grados Celsius (°C)
                </Typography>
              </Box>
              
              {temperaturaSuelo.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={temperaturaSuelo}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      stroke="#94a3b8"
                      height={80}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      labelFormatter={(value) => `Fecha: ${value}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={false}
                      name="Temperatura (°C)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Alert severity="info">No hay datos disponibles para este rango de fechas</Alert>
              )}
            </Paper>

            {/* Humedad del Suelo */}
            <Paper sx={{ p: 4, mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Humedad del Suelo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Medición en porcentaje (%)
                </Typography>
              </Box>
              
              {humedadSuelo.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={humedadSuelo}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      stroke="#94a3b8"
                      height={80}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      labelFormatter={(value) => `Fecha: ${value}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      dot={false}
                      name="Humedad (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Alert severity="info">No hay datos disponibles para este rango de fechas</Alert>
              )}
            </Paper>

            {/* Conductividad Eléctrica del Suelo */}
            <Paper sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Conductividad Eléctrica del Suelo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Medición en µS/cm (microsiemens por centímetro)
                </Typography>
              </Box>
              
              {conductividadSuelo.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={conductividadSuelo}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      stroke="#94a3b8"
                      height={80}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      labelFormatter={(value) => `Fecha: ${value}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={false}
                      name="Conductividad (µS/cm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Alert severity="info">No hay datos disponibles para este rango de fechas</Alert>
              )}
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;