/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,css}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a98c70', // Un marrón claro para hover
          main: '#6F4E37',  // Marrón café como color principal
          dark: '#4a3425',  // Marrón oscuro para acentos
          contrastText: '#ffffff',
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