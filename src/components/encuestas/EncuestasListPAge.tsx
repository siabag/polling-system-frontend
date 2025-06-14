'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/src/hooks/useAuth';
import { surveyApi } from '@/src/lib/apiSurvey';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Grid as MuiGrid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { EncuestaFilters, Encuesta, TipoEncuesta, Finca } from '@/src/types/survey';
import { formatDate } from '@/src/lib/utils';

// Solución para el error de Grid
const Grid = (props: any) => <MuiGrid {...props} />;

const filterStyles = {
  filterContainer: {
    p: 3,
    mb: 3,
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    backgroundColor: 'background.paper',
  },
  filterGrid: {
    alignItems: 'center',
  },
  filterField: {
    minWidth: '180px',
    '& .MuiInputBase-root': {
      borderRadius: '8px',
      backgroundColor: 'background.paper',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'divider',
      },
      '&:hover fieldset': {
        borderColor: 'primary.light',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
        borderWidth: '1px',
      },
    },
  },
  dateField: {
    minWidth: '180px',
    '& .MuiInputBase-input': {
      padding: '10.5px 14px',
    },
  },
  clearButton: {
    height: '40px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
  },
};

const EncuestasListPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Estados para filtros
  const [tiposEncuesta, setTiposEncuesta] = useState<TipoEncuesta[]>([]);
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [filters, setFilters] = useState<EncuestaFilters>({
    tipo_encuesta_id: undefined,
    finca_id: undefined,
    fecha_desde: '',
    fecha_hasta: '',
    completada: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      const [tiposRes, fincasRes] = await Promise.all([
        surveyApi.getTiposEncuesta(),
        surveyApi.getFincas({ usuario_id: user?.id }),
      ]);
      setTiposEncuesta(tiposRes.data);
      setFincas(fincasRes.data);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    }
  };

  // Cargar encuestas
  useEffect(() => {
    if (user) {
      loadEncuestas();
    }
  }, [user, page, rowsPerPage, filters]);

  const loadEncuestas = async () => {
    try {
      setLoading(true);
      const response = await surveyApi.getEncuestas({
        ...filters,
        page: page + 1,
        limit: rowsPerPage,
      });      
      setEncuestas(response.data.data);
      setTotal(response.data.total);
      setError(null);
    } catch (error) {
      console.error('Error cargando encuestas:', error);
      setError('Error al cargar las encuestas');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (key: keyof EncuestaFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      tipo_encuesta_id: undefined,
      finca_id: undefined,
      fecha_desde: '',
      fecha_hasta: '',
      completada: undefined,
    });
    setPage(0);
  };

  const handleViewEncuesta = (id: number) => {
    router.push(`/dashboard/encuestas/${id}`);
  };

  const handleEditEncuesta = (id: number) => {
    router.push(`/dashboard/encuestas/${id}/editar`);
  };

  const handleNewEncuesta = () => {
    router.push('/dashboard/encuestas/nueva');
  };

  if (loading && encuestas.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleDownloadReport = async () => {
    try {
      setLoading(true);
      
      // Preparamos los mismos parámetros que usamos para filtrar
      const downloadParams = {
        fecha_inicio: filters.fecha_desde || undefined,
        fecha_fin: filters.fecha_hasta || undefined,
        tipo_encuesta_id: filters.tipo_encuesta_id || undefined,
        finca_id: filters.finca_id || undefined,
        completada: filters.completada
      };

      await surveyApi.downloadEncuestasCSV(downloadParams);
      
      setError(null);
    } catch (error) {
      console.error('Error descargando reporte:', error);
      setError('Error al descargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Mis Encuestas
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mr: 2 }}
          >
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleDownloadReport}
            sx={{ mr: 2 }}
            disabled={loading}
          >
            Descargar Reporte
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewEncuesta}
          >
            Nueva Encuesta
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      {showFilters && (
        <Paper sx={filterStyles.filterContainer}>
          <Grid container spacing={2} sx={filterStyles.filterGrid}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Tipo de Encuesta"
                value={filters.tipo_encuesta_id}
                onChange={(e) => handleFilterChange('tipo_encuesta_id', e.target.value)}
                variant="outlined"
                size="small"
                sx={filterStyles.filterField}
              >
                <MenuItem value="">
                  <em>Todos los tipos</em>
                </MenuItem>
                {tiposEncuesta.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Finca"
                value={filters.finca_id}
                onChange={(e) => handleFilterChange('finca_id', e.target.value)}
                variant="outlined"
                size="small"
                sx={filterStyles.filterField}
              >
                <MenuItem value="">
                  <Typography color="text.secondary">Todas las fincas</Typography>
                </MenuItem>
                {fincas.map((finca) => (
                  <MenuItem key={finca.id} value={finca.id}>
                    {finca.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Fecha Desde"
                type="date"
                value={filters.fecha_desde}
                onChange={(e) => handleFilterChange('fecha_desde', e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
                sx={filterStyles.dateField}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Fecha Hasta"
                type="date"
                value={filters.fecha_hasta}
                onChange={(e) => handleFilterChange('fecha_hasta', e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
                sx={filterStyles.dateField}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Estado"
                value={filters.completada}
                onChange={(e) => handleFilterChange('completada', e.target.value)}
                variant="outlined"
                size="small"
                sx={filterStyles.filterField}
              >
                <MenuItem value="">
                  <em>Todos los estados</em>
                </MenuItem>
                <MenuItem value="true">Completadas</MenuItem>
                <MenuItem value="false">Pendientes</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                size="small"
              >
                Limpiar Filtros
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha Aplicación</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Finca</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {encuestas.map((encuesta) => (
              <TableRow key={encuesta.id}>
                <TableCell>{formatDate(encuesta.fecha_aplicacion)}</TableCell>
                <TableCell>
                  <Chip
                    label={encuesta.tipo_encuesta?.nombre}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{encuesta.finca?.nombre}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver">
                    <IconButton
                      size="small"
                      onClick={() => handleViewEncuesta(encuesta.id)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleEditEncuesta(encuesta.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {encuestas.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron encuestas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </TableContainer>

      
    </Box>
  );
};

export default EncuestasListPage;