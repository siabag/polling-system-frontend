/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,css}',
  ],
  theme: {
    extend: {
      colors: {
        // Se ha definido una escala completa para el color primario.
        // El color principal del proyecto (#a7c957) se mapea a los tonos 500 y 600, 
        // lo que permite que el botón use 600 y 700 para el hover.
        primary: {
          50: '#f5f7ed',
          100: '#e4e7d4',
          200: '#cdd3ab',
          300: '#b6bf82',
          400: '#a7c957',
          500: '#a7c957', 
          600: '#a7c957', // Color principal para botones
          700: '#8cae49', // Color más oscuro para el hover
          800: '#71923f',
          900: '#567535',
          950: '#3a4e21',
        },
        secondary: {
          light: '#6a994e',
          main: '#386641',  // Verde hoja de café
          dark: '#27472d',
          contrastText: '#ffffff',
        },
        background: {
          default: '#F5F5F5', // Un fondo ligeramente grisáceo
          paper: '#FFFFFF',
        },
        text: {
          primary: '#333333',
          secondary: '#555555',
        },
      },
    },
  },
  plugins: [],
}