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
  IconButton,
  TextField,
  Grid as MuiGrid,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { Finca, FincaFilters } from '@/src/types/survey';

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

const FincasPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedFinca, setSelectedFinca] = useState<Finca | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Estados para filtros
  const [filters, setFilters] = useState<FincaFilters>({
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Cargar fincas
  useEffect(() => {
    if (user) {
      loadFincas();
    }
  }, [user, page, rowsPerPage, filters]);

  const loadFincas = async () => {
    try {
      setLoading(true);
      const response = await surveyApi.getFincas({
        ...filters,
        page: page + 1,
        limit: rowsPerPage,
      });
      
      setFincas(response.data);
      setTotal(response.data.length);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (error) {
      console.error('Error cargando fincas:', error);
      setError('Error al cargar las fincas');
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

  const handleFilterChange = (key: keyof FincaFilters, value: any) => {
    setFilters((prev:any) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
    });
    setPage(0);
  };

  const handleViewFinca = async (finca: Finca) => {
    try {
      const response = await surveyApi.getFincaById(finca.id);
      setSelectedFinca(response.data);
      setOpenViewDialog(true);
    } catch (error) {
      console.error('Error cargando finca:', error);
      setError('Error al cargar los detalles de la finca');
    }
  };

  const handleDeleteFinca = async () => {
    if (!selectedFinca) return;
    
    try {
      await surveyApi.deleteFinca(selectedFinca.id);
      setOpenDeleteDialog(false);
      setSelectedFinca(null);
      loadFincas(); // Recargar la lista
    } catch (error) {
      console.error('Error eliminando finca:', error);
      setError('Error al eliminar la finca');
    }
  };

  const handleNewFinca = () => {
    router.push('/dashboard/admin/fincas/nuevo');
  };

  const handleEditFinca = (id: number) => {
    router.push(`/dashboard/admin//fincas/${id}/editar`);
  };

  if (loading && fincas.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Mis Fincas
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
            onClick={handleNewFinca}
          >
            Nueva Finca
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      {showFilters && (
        <Paper sx={filterStyles.filterContainer}>
          <Grid container spacing={2} sx={filterStyles.filterGrid}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Buscar"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Nombre, ubicación o propietario..."
                variant="outlined"
                size="small"
                sx={filterStyles.filterField}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
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
              <TableCell>Ubicación</TableCell>
              <TableCell>Propietario</TableCell>
              <TableCell>Coordenadas</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fincas.map((finca) => (
              <TableRow key={finca.id}>
                <TableCell>{finca.nombre}</TableCell>
                <TableCell>{finca.ubicacion}</TableCell>
                <TableCell>{finca.propietario}</TableCell>
                <TableCell>
                  {finca.latitud && finca.longitud 
                    ? `${finca.latitud}, ${finca.longitud}`
                    : 'No especificadas'
                  }
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver detalles">
                    <IconButton
                      size="small"
                      onClick={() => handleViewFinca(finca)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => handleEditFinca(finca.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedFinca(finca);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {fincas.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron fincas
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

      {/* Dialog para ver detalles de la finca */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Detalles de la Finca</DialogTitle>
        <DialogContent>
          {selectedFinca && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Nombre:</strong> {selectedFinca.nombre}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Ubicación:</strong> {selectedFinca.ubicacion}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Propietario:</strong> {selectedFinca.propietario}
              </Typography>
              {selectedFinca.latitud && selectedFinca.longitud && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Latitud:</strong> {selectedFinca.latitud}s
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Longitud:</strong> {selectedFinca.longitud}
                  </Typography>
                </>
              )}
              <Typography variant="subtitle1" gutterBottom>
                <strong>Fecha de creación:</strong> {selectedFinca?.created_at ? new Date(selectedFinca.created_at).toLocaleDateString() : 'No disponible'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setOpenViewDialog(false);
              if (selectedFinca) {
                handleEditFinca(selectedFinca.id);
              }
            }}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la finca "{selectedFinca?.nombre}"? 
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteFinca}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FincasPage;