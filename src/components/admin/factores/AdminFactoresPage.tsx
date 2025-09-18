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
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { FactorFilters, Factor, TipoEncuesta } from '@/src/types/survey';

// Solución para el error de Grid
const Grid = (props: any) => <MuiGrid {...props} />;

// Estilos para los filtros
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
  clearButton: {
    height: '40px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
  },
};

const AdminFactoresPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [factores, setFactores] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedFactor, setSelectedFactor] = useState<Factor | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  
  // Estados para filtros
  const [tiposEncuesta, setTiposEncuesta] = useState<TipoEncuesta[]>([]);
  const [filters, setFilters] = useState<FactorFilters>({
    tipo_encuesta_id: undefined,
    categoria: '',
    activo: undefined,
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Verificar permisos de administrador
  useEffect(() => {
    if (user && user.rol !== 'administrador') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Cargar datos iniciales
  useEffect(() => {
    if (user && user.rol === 'administrador') {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      const tiposRes = await surveyApi.getTiposEncuesta();
      setTiposEncuesta(tiposRes.data);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    }
  };

  // Cargar factores
  useEffect(() => {
    if (user && user.rol === 'administrador') {
      loadFactores();
    }
  }, [user, page, rowsPerPage, filters]);

  const loadFactores = async () => {
    try {
      setLoading(true);
      const response = await surveyApi.getFactores({
        ...filters,
        page: page + 1,
        limit: rowsPerPage,
      });
      setFactores(response.data.data);      
      setTotal(response.data.data.length > 0 ? response.data.total || response.data.data.length : 0);
      setError(null);
    } catch (error) {
      console.error('Error cargando factores:', error);
      setError('Error al cargar los factores');
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

  const handleFilterChange = (key: keyof FactorFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      tipo_encuesta_id: undefined,
      categoria: '',
      activo: undefined,
      search: '',
    });
    setPage(0);
  };

  const handleViewFactor = async (factor: Factor) => {
    try {
      const response = await surveyApi.getFactorById(factor.id);
      console.log(response.data);
      
      setSelectedFactor(response.data);
      setOpenViewDialog(true);
    } catch (error) {
      console.error('Error cargando factor:', error);
      setError('Error al cargar los detalles del factor');
    }
  };

  const handleNewFactor = () => {
    router.push('/dashboard/admin/factores/nuevo');
  };

  const handleEditFactor = (id: number) => {
    router.push(`/dashboard/admin/factores/${id}/editar`);
  };

  if (loading && factores.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  console.log("selected_factor:", selectedFactor);
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Administración de Factores
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
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewFactor}
          >
            Nuevo Factor
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
                value={filters.tipo_encuesta_id || ''}
                onChange={(e) => handleFilterChange('tipo_encuesta_id', e.target.value)}
                variant="outlined"
                size="small"
                sx={filterStyles.filterField}
              >
                <MenuItem value="">
                  <em>Todos</em>
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
                fullWidth
                label="Categoría"
                value={filters.categoria || ''}
                onChange={(e) => handleFilterChange('categoria', e.target.value)}
                variant="outlined"
                size="small"
                sx={filterStyles.filterField}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Estado"
                value={filters.activo === undefined ? '' : filters.activo.toString()}
                onChange={(e) => 
                  handleFilterChange('activo', e.target.value === '' ? undefined : e.target.value === 'true')
                }
                variant="outlined"
                size="small"
                sx={filterStyles.filterField}
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                <MenuItem value="true">Activos</MenuItem>
                <MenuItem value="false">Inactivos</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Buscar"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Nombre o descripción..."
                variant="outlined"
                size="small"
                sx={filterStyles.filterField}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                size="small"
                sx={filterStyles.clearButton}
              >
                Limpiar
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
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo de Encuesta</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {factores.map((factor) => (
              <TableRow key={factor.id}>
                <TableCell>{factor.nombre}</TableCell>
                <TableCell>
                  {tiposEncuesta.find(t => t.id === factor.tipo_encuesta_id)?.nombre || 'N/A'}
                </TableCell>
                <TableCell>{factor.categoria || 'Sin categoría'}</TableCell>
                <TableCell>
                  <Chip
                    label={factor.activo ? 'Activo' : 'Inactivo'}
                    color={factor.activo ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver detalles">
                    <IconButton
                      size="small"
                      onClick={() => handleViewFactor(factor)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => handleEditFactor(factor.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {factores.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron factores
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

      {/* Dialog para ver detalles del factor */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Detalles del Factor</DialogTitle>
        <DialogContent>
          {selectedFactor && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Nombre:</strong> {selectedFactor.nombre}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Descripción:</strong> {selectedFactor.descripcion || 'Sin descripción'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Categoría:</strong> {selectedFactor.categoria || 'Sin categoría'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Tipo de Encuesta:</strong> {tiposEncuesta.find(t => t.id === selectedFactor.tipo_encuesta_id)?.nombre || 'N/A'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Estado:</strong>{' '}
                <Chip
                  label={selectedFactor.activo ? 'Activo' : 'Inactivo'}
                  color={selectedFactor.activo ? 'success' : 'default'}
                  size="small"
                />
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Valores Posibles
              </Typography>
              <List>
                {selectedFactor.valores_posibles?.map((valor) => (
                  <ListItem key={valor.id} divider>
                    <ListItemText
                      primary={`${valor.valor} (Código: ${valor.codigo})`}
                      secondary={valor.descripcion}
                    />
                    <Chip
                      label={valor.activo ? 'Activo' : 'Inactivo'}
                      color={valor.activo ? 'success' : 'default'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setOpenViewDialog(false);
              if (selectedFactor) {
                handleEditFactor(selectedFactor.id);
              }
            }}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminFactoresPage;