import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Синий
    },
    secondary: {
      main: '#ff9800', // Оранжевый
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 30,
      },
    },
    MuiCard: {
      root: {
        borderRadius: 15,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
});

export default theme;