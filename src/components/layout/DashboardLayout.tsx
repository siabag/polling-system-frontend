'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/src/hooks/useAuth';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Badge,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Container,
  Popper,
  Grow,
  Paper,
  MenuList,
  ClickAwayListener,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Terrain as TerrainIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  List as ListIcon,
  Category as CategoryIcon,
  Menu as MenuIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }:DashboardLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [encuestasOpen, setEncuestasOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const encuestasAnchorRef = React.useRef<HTMLButtonElement>(null);
  const adminAnchorRef = React.useRef<HTMLButtonElement>(null);
  
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const handleNavigate = (path: string) => {
    setEncuestasOpen(false);
    setAdminOpen(false);
    setMobileMenuAnchor(null);
    router.push(path);
  };

  const handleToggleEncuestas = () => {
    setEncuestasOpen((prevOpen) => !prevOpen);
    setAdminOpen(false);
  };

  const handleToggleAdmin = () => {
    setAdminOpen((prevOpen) => !prevOpen);
    setEncuestasOpen(false);
  };

  const handleClose = (event: Event) => {
    if (
      encuestasAnchorRef.current &&
      encuestasAnchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    if (
      adminAnchorRef.current &&
      adminAnchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setEncuestasOpen(false);
    setAdminOpen(false);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  // Proteger ruta
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Si está cargando o no está autenticado, mostrar loading
  if (loading || !isAuthenticated || !user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const isAdmin = user?.rol === 'administrador';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, backgroundColor: '#a7c957' }}>
        <Toolbar>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mr: 4,
            }}
            onClick={() => handleNavigate('/dashboard')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
                fontWeight: 'bold',
                mr: 1,
              }}
            >
              EC
            </Box>
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Encuestas Café
            </Typography>
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => handleNavigate('/dashboard')}
              >
                Dashboard
              </Button>

              <Button
                ref={encuestasAnchorRef}
                color="inherit"
                startIcon={<AssignmentIcon />}
                endIcon={<ArrowDropDownIcon />}
                onClick={handleToggleEncuestas}
              >
                Encuestas
              </Button>
              <Popper
                open={encuestasOpen}
                anchorEl={encuestasAnchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom-start' ? 'left top' : 'left bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={(event) => handleClose(event as any)}>
                        <MenuList>
                          <MenuItem onClick={() => handleNavigate('/dashboard/encuestas/nueva')}>
                            <ListItemIcon>
                              <AddIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Nueva Encuesta</ListItemText>
                          </MenuItem>
                          <MenuItem onClick={() => handleNavigate('/dashboard/encuestas')}>
                            <ListItemIcon>
                              <ListIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Mis Encuestas</ListItemText>
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>

              {isAdmin && (
                <>
                  <Button
                    ref={adminAnchorRef}
                    color="inherit"
                    startIcon={<SettingsIcon />}
                    endIcon={<ArrowDropDownIcon />}
                    onClick={handleToggleAdmin}
                  >
                    Administración
                  </Button>
                  <Popper
                    open={adminOpen}
                    anchorEl={adminAnchorRef.current}
                    role={undefined}
                    placement="bottom-start"
                    transition
                    disablePortal
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={(event) => handleClose(event as any)}>
                            <MenuList>
                              <MenuItem onClick={() => handleNavigate('/dashboard/admin/factores')}>
                                <ListItemIcon>
                                  <CategoryIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Factores</ListItemText>
                              </MenuItem>
                              <MenuItem onClick={() => handleNavigate('/dashboard/admin/fincas')}>
                                <ListItemIcon>
                                  <PersonIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Fincas</ListItemText>
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </>
              )}
            </Box>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <Box sx={{ flexGrow: 1 }}>
              <IconButton
                color="inherit"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          {/* Profile Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
              </Avatar>
            </IconButton>
          </Box>
          
          {/* Profile Menu */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="subtitle2">
                {user.nombre} {user.apellido}
              </Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">
                {user.rol}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleProfileMenuClose(); router.push('/dashboard/perfil'); }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>

          {/* Mobile Navigation Menu */}
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
          >
            <MenuItem onClick={() => handleNavigate('/dashboard')}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Dashboard</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem disabled>
              <Typography variant="subtitle2" color="text.secondary">
                Encuestas
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/dashboard/encuestas/nueva')}>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Nueva Encuesta</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/dashboard/encuestas')}>
              <ListItemIcon>
                <ListIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Mis Encuestas</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleNavigate('/dashboard/fincas')}>
              <ListItemIcon>
                <TerrainIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Fincas</ListItemText>
            </MenuItem>
            {isAdmin && (
              <>
                <Divider />
                <MenuItem disabled>
                  <Typography variant="subtitle2" color="text.secondary">
                    Administración
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/dashboard/admin/factores')}>
                  <ListItemIcon>
                    <CategoryIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Factores</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/dashboard/admin/usuarios')}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Usuarios</ListItemText>
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Para dar espacio al AppBar
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;