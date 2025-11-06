'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/src/hooks/useAuth';
import {
  Box,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
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
  CssBaseline,
  Tooltip,
} from '@mui/material';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
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
  Search,
} from '@mui/icons-material';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const SIDEBAR_BG = '#2c5530';
const SIDEBAR_HEADER_BG = '#1e3a20';
const SIDEBAR_HOVER_COLOR = '#a39539';
const SIDEBAR_DIVIDER_COLOR = '#9eb897';

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // Cambiado a false
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [encuestasOpen, setEncuestasOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEncuestasOpen(false); // Cierra submenús al colapsar
    setAdminOpen(false);
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDrawerOpen(!drawerOpen);
    }
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
    if (!drawerOpen) handleDrawerOpen();
    setEncuestasOpen(!encuestasOpen);
  };

  const handleToggleAdmin = () => {
    if (!drawerOpen) handleDrawerOpen();
    setAdminOpen(!adminOpen);
  };

  if (loading || !isAuthenticated || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const isAdmin = user?.rol === 'administrador';
  const primaryColor = theme.palette.primary.main;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: SIDEBAR_BG }}>
      <DrawerHeader sx={{ backgroundColor: SIDEBAR_HEADER_BG, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', opacity: drawerOpen ? 1 : 0, transition: 'opacity 0.3s' }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', mr: 2, ml: 1 }}>
            EC
          </Box>
          <Typography variant="h6" noWrap>
            Encuestas Café
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider sx={{ borderColor: SIDEBAR_DIVIDER_COLOR }} />
      <List sx={{ color: 'white', flexGrow: 1 }}>
        {[
          { text: 'Inicio', icon: <DashboardIcon />, path: '/dashboard' },
          { text: 'Monitoreo en tiempo real', icon: <AssessmentIcon />, path: '/dashboard/monitoreo' },
        ].map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={!drawerOpen ? item.text : ''} placement="right">
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: drawerOpen ? 'initial' : 'center',
                  px: 2.5,
                  py: 1.5,
                  '&:hover': { backgroundColor: SIDEBAR_HOVER_COLOR },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : 'auto', justifyContent: 'center', color: primaryColor }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: drawerOpen ? 1 : 0 }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}

        <Divider sx={{ borderColor: SIDEBAR_DIVIDER_COLOR, my: 1 }} />

        {/* Gestión tareas agroambientales con submenú */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Tooltip title={!drawerOpen ? "Gestión tareas agroambientales" : ''} placement="right">
            <ListItemButton
              onClick={handleToggleEncuestas}
              sx={{ minHeight: 48, justifyContent: drawerOpen ? 'initial' : 'center', px: 2.5, py: 1.5, '&:hover': { backgroundColor: SIDEBAR_HOVER_COLOR } }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : 'auto', justifyContent: 'center', color: primaryColor }}>
                <AgricultureIcon />
              </ListItemIcon>
              <ListItemText primary="Gestión tareas agroambientales" sx={{ opacity: drawerOpen ? 1 : 0 }} />
              {drawerOpen && (encuestasOpen ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </Tooltip>
        </ListItem>
        <Collapse in={encuestasOpen && drawerOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: SIDEBAR_HOVER_COLOR } }} onClick={() => handleNavigate('/dashboard/encuestas/nueva')}>
              <ListItemIcon sx={{ color: primaryColor }}><AddIcon /></ListItemIcon>
              <ListItemText primary="Nueva Encuesta" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: SIDEBAR_HOVER_COLOR } }} onClick={() => handleNavigate('/dashboard/encuestas')}>
              <ListItemIcon sx={{ color: primaryColor }}><ListIcon /></ListItemIcon>
              <ListItemText primary="Mis Encuestas" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Otros items sin submenú */}
        {[
  { text: 'Modelos Predictivos', icon: <AssessmentIcon /> },
  { text: 'Identificación de plagas', icon: <TerrainIcon /> },
  { text: 'Sistema de Alertas', icon: <AssignmentIcon /> },
  { text: 'Clasificación de hojas', icon: <Search />, path: '/dashboard/clasificacion' }
].map((item) => (
  <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
    <Tooltip title={!drawerOpen ? item.text : ''} placement="right">
      <ListItemButton
        onClick={() => item.path && handleNavigate(item.path)} // ✅ se agregó esta línea
        sx={{
          minHeight: 48,
          justifyContent: drawerOpen ? 'initial' : 'center',
          px: 2.5,
          py: 1.5,
          '&:hover': { backgroundColor: SIDEBAR_HOVER_COLOR },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: drawerOpen ? 3 : 'auto',
            justifyContent: 'center',
            color: primaryColor,
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.text} sx={{ opacity: drawerOpen ? 1 : 0 }} />
      </ListItemButton>
    </Tooltip>
  </ListItem>
))}

        {/* Administración */}
        {isAdmin && (
          <>
            <Divider sx={{ borderColor: SIDEBAR_DIVIDER_COLOR, my: 1 }} />
            <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!drawerOpen ? "Administración" : ''} placement="right">
                <ListItemButton
                  onClick={handleToggleAdmin}
                  sx={{ minHeight: 48, justifyContent: drawerOpen ? 'initial' : 'center', px: 2.5, py: 1.5, '&:hover': { backgroundColor: SIDEBAR_HOVER_COLOR } }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : 'auto', justifyContent: 'center', color: primaryColor }}>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Administración" sx={{ opacity: drawerOpen ? 1 : 0 }} />
                  {drawerOpen && (adminOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <Collapse in={adminOpen && drawerOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: SIDEBAR_HOVER_COLOR } }} onClick={() => handleNavigate('/dashboard/admin/factores')}>
                  <ListItemIcon sx={{ color: primaryColor }}><CategoryIcon /></ListItemIcon>
                  <ListItemText primary="Factores" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: SIDEBAR_HOVER_COLOR } }} onClick={() => handleNavigate('/dashboard/admin/fincas')}>
                  <ListItemIcon sx={{ color: primaryColor }}><TerrainIcon /></ListItemIcon>
                  <ListItemText primary="Fincas" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: SIDEBAR_HOVER_COLOR } }} onClick={() => handleNavigate('/dashboard/admin/users')}>
                  <ListItemIcon sx={{ color: primaryColor }}><PersonIcon /></ListItemIcon>
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
      <CssBaseline />
      <AppBar position="fixed" open={drawerOpen && !isMobile} sx={{ backgroundColor: primaryColor }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              marginRight: 5,
              ...(drawerOpen && !isMobile && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              {user.nombre} {user.apellido}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
              </Avatar>
            </IconButton>
          </Box>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="subtitle2">{user.nombre} {user.apellido}</Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">{user.rol}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleProfileMenuClose(); router.push('/dashboard/perfil'); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
      {isMobile ? (
        <MuiDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawerContent}
        </MuiDrawer>
      ) : (
        <Drawer variant="permanent" open={drawerOpen}>
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          position: 'relative',
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: "url('/images/coffee-field.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4,
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, p: '0 !important' }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;