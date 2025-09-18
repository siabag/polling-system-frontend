'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/src/hooks/useAuth';
import useUsers from '@/src/hooks/useUsers';
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
  DialogContentText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

// Tipos de usuario
interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo?: string; // Campo alternativo para compatibilidad con backend
  rol: string; // 'administrador', 'encuestador', 'analista'
  activo: boolean;
}

interface UsuarioFilters {
  rol?: string;
  activo?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

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

const AdminUsuariosPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  // Usar el hook useUsers
  const {
    users: usuarios,
    totalUsers: total,
    loading,
    error,
    currentPage,
    totalPages,
    getUsers,
    getUserById,
    deleteUser,
    clearErrors
  } = useUsers();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Estados para filtros
  const [filters, setFilters] = useState<UsuarioFilters>({
    rol: undefined,
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

  // Cargar usuarios cuando cambien los filtros o la paginación
  useEffect(() => {
    if (user && user.rol === 'administrador') {
      loadUsuarios();
    }
  }, [user, page, rowsPerPage, filters]);

  const loadUsuarios = async () => {
    const filterParams = {
      ...filters,
      page: page + 1,
      limit: rowsPerPage,
    };
    
    await getUsers(filterParams);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (key: keyof UsuarioFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      rol: undefined,
      activo: undefined,
      search: '',
    });
    setPage(0);
  };

  const handleViewUsuario = async (usuario: Usuario) => {
    try {
      const fullUser = await getUserById(usuario.id);
      if (fullUser) {
        setSelectedUsuario(fullUser);
        setOpenViewDialog(true);
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  };

  const handleNewUsuario = () => {
    router.push('/dashboard/admin/users/nuevo');
  };

  const handleEditUsuario = (id: number) => {
    router.push(`/dashboard/admin/users/${id}/edit`);
  };

  const handleDeleteUsuario = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedUsuario) return;
    
    setDeleteLoading(true);
    const success = await deleteUser(selectedUsuario.id);
    
    if (success) {
      setOpenDeleteDialog(false);
      setSelectedUsuario(null);
      // La lista se actualiza automáticamente por el hook
    }
    
    setDeleteLoading(false);
  };

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'administrador':
        return 'error';
      case 'analista':
        return 'warning';
      case 'encuestador':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Limpiar errores cuando se cierre el modal
  const handleCloseError = () => {
    clearErrors();
  };

  if (loading && usuarios.length === 0) {
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
          Administración de Usuarios
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
            onClick={handleNewUsuario}
          >
            Nuevo Usuario
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
                label="Rol"
                value={filters.rol || ''}
                onChange={(e) => handleFilterChange('rol', e.target.value)}
                variant="outlined"
                size="small"
                sx={filterStyles.filterField}
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                <MenuItem value="administrador">Administrador</MenuItem>
                <MenuItem value="analista">Analista</MenuItem>
                <MenuItem value="encuestador">Encuestador</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Buscar"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Nombre o email..."
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
        <Alert severity="error" sx={{ mb: 3 }} onClose={handleCloseError}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.correo}</TableCell>
                <TableCell>
                  <Chip
                    label={usuario.rol}
                    color={getRolColor(usuario.rol) as any}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={usuario.activo ? 'Activo' : 'Inactivo'}
                    color={usuario.activo ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {/* <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => handleEditUsuario(usuario.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip> */}
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUsuario(usuario)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {usuarios.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No se encontraron usuarios
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

      {/* Dialog para ver detalles del usuario */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Detalles del Usuario</DialogTitle>
        <DialogContent>
          {selectedUsuario && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Nombre:</strong> {selectedUsuario.nombre}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Email:</strong> {selectedUsuario.correo}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Rol:</strong>{' '}
                <Chip
                  label={selectedUsuario.rol}
                  color={getRolColor(selectedUsuario.rol) as any}
                  size="small"
                  variant="outlined"
                />
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Estado:</strong>{' '}
                <Chip
                  label={selectedUsuario.activo ? 'Activo' : 'Inactivo'}
                  color={selectedUsuario.activo ? 'success' : 'default'}
                  size="small"
                />
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
              if (selectedUsuario) {
                handleEditUsuario(selectedUsuario.id);
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUsuario?.nombre}</strong>?
            <br />
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} disabled={deleteLoading}>
            Cancelar
          </Button>
          <Button 
            color="error"
            variant="contained"
            onClick={confirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                Eliminando...
              </Box>
            ) : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsuariosPage;