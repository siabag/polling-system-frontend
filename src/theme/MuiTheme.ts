// src/theme/MuiTheme.ts

import { createTheme } from '@mui/material/styles';

const primaryGreen = '#a7c957'; 

const theme = createTheme({
  palette: {
    primary: {
      main: primaryGreen, 
      light: '#c8e29a', 
      dark: '#71923f',
      contrastText: '#fff',
    },
    secondary: {
      // Usamos el mismo primary color para el avatar por defecto
      main: primaryGreen, 
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    // Establece el color de los íconos a nivel global
    MuiListItemIcon: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main, 
          minWidth: 40,
        }),
      },
    },
    // Asegura que los botones y otros elementos usen el color correcto
    MuiButton: {
        defaultProps: {
            // Para que los botones sin color="primary" lo hereden
            color: 'primary', 
        }
    }
  },
});

export default theme;