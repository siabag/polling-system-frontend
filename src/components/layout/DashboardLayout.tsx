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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Container,
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
  ExpandLess,
  ExpandMore,
  ChevronLeft as ChevronLeftIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 280;

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [encuestasOpen, setEncuestasOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
    router.push(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleToggleEncuestas = () => {
    setEncuestasOpen(!encuestasOpen);
  };

  const handleToggleAdmin = () => {
    setAdminOpen(!adminOpen);
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

  const drawer = (
    <Box sx={{ height: '100%', backgroundColor: '#2c5530' }}>
      {/* Header del Sidebar */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#1e3a20',
          color: 'white',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#a7c957',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            mr: 2,
          }}
        >
          EC
        </Box>
        <Typography variant="h6" noWrap>
          Encuestas Café
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#4a6741' }} />

      {/* Menu Items */}
      <List sx={{ color: 'white', py: 2 }}>
        {/* Inicio/Dashboard */}
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigate('/dashboard')}
            sx={{ 
              '&:hover': { backgroundColor: '#4a6741' },
              py: 1.5,
            }}
          >
            <ListItemIcon sx={{ color: '#a7c957', minWidth: 40 }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ borderColor: '#4a6741', my: 1 }} />

        {/* Monitoreo en tiempo real */}
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigate('/dashboard/monitoreo')}
            sx={{ 
              '&:hover': { backgroundColor: '#4a6741' },
              py: 1.5,
            }}
          >
            <ListItemIcon sx={{ color: '#a7c957', minWidth: 40 }}>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Monitoreo en tiempo real" />
          </ListItemButton>
        </ListItem>

        {/* Gestión tareas agroambientales */}
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleToggleEncuestas}
            sx={{ 
              '&:hover': { backgroundColor: '#4a6741' },
              py: 1.5,
            }}
          >
            <ListItemIcon sx={{ color: '#a7c957', minWidth: 40 }}>
              <AgricultureIcon />
            </ListItemIcon>
            <ListItemText primary="Gestión tareas agroambientales" />
            {encuestasOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        {/* Submenu de Gestión tareas */}
        <Collapse in={encuestasOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ 
                pl: 6, 
                '&:hover': { backgroundColor: '#4a6741' },
                py: 1,
              }}
              onClick={() => handleNavigate('/dashboard/encuestas/nueva')}
            >
              <ListItemIcon sx={{ color: '#a7c957', minWidth: 30 }}>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Nueva Encuesta" />
            </ListItemButton>
            <ListItemButton 
              sx={{ 
                pl: 6, 
                '&:hover': { backgroundColor: '#4a6741' },
                py: 1,
              }}
              onClick={() => handleNavigate('/dashboard/encuestas')}
            >
              <ListItemIcon sx={{ color: '#a7c957', minWidth: 30 }}>
                <ListIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Mis Encuestas" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Modelos Predictivos */}
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ 
              '&:hover': { backgroundColor: '#4a6741' },
              py: 1.5,
            }}
          >
            <ListItemIcon sx={{ color: '#a7c957', minWidth: 40 }}>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Modelos Predictivos" />
            <ExpandMore />
          </ListItemButton>
        </ListItem>

        {/* Identificación de plagas y enfermedades */}
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ 
              '&:hover': { backgroundColor: '#4a6741' },
              py: 1.5,
            }}
          >
            <ListItemIcon sx={{ color: '#a7c957', minWidth: 40 }}>
              <TerrainIcon />
            </ListItemIcon>
            <ListItemText primary="Identificación de plagas y enfermedades" />
          </ListItemButton>
        </ListItem>

        {/* Sistema de Alertas */}
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ 
              '&:hover': { backgroundColor: '#4a6741' },
              py: 1.5,
            }}
          >
            <ListItemIcon sx={{ color: '#a7c957', minWidth: 40 }}>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Sistema de Alertas o recomendaciones" />
          </ListItemButton>
        </ListItem>

        {/* Administración - Solo para admins */}
        {isAdmin && (
          <>
            <Divider sx={{ borderColor: '#4a6741', my: 2 }} />
            
            <ListItem disablePadding>
              <ListItemButton 
                onClick={handleToggleAdmin}
                sx={{ 
                  '&:hover': { backgroundColor: '#4a6741' },
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{ color: '#a7c957', minWidth: 40 }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Administración" />
                {adminOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={adminOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  sx={{ 
                    pl: 6, 
                    '&:hover': { backgroundColor: '#4a6741' },
                    py: 1,
                  }}
                  onClick={() => handleNavigate('/dashboard/admin/factores')}
                >
                  <ListItemIcon sx={{ color: '#a7c957', minWidth: 30 }}>
                    <CategoryIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Factores" />
                </ListItemButton>
                <ListItemButton 
                  sx={{ 
                    pl: 6, 
                    '&:hover': { backgroundColor: '#4a6741' },
                    py: 1,
                  }}
                  onClick={() => handleNavigate('/dashboard/admin/fincas')}
                >
                  <ListItemIcon sx={{ color: '#a7c957', minWidth: 30 }}>
                    <TerrainIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Fincas" />
                </ListItemButton>
                <ListItemButton 
                  sx={{ 
                    pl: 6, 
                    backgroundColor: '#2c5530',
                    '&:hover': { backgroundColor: '#4a6741' },
                    py: 1,
                  }}
                  onClick={() => handleNavigate('/dashboard/admin/users')}
                >
                  <ListItemIcon sx={{ color: '#a7c957', minWidth: 30 }}>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Usuarios" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: '#a7c957',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          {/* Profile Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              {user.nombre} {user.apellido}
            </Typography>
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
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
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