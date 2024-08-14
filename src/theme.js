import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC107',
      light: '#FFE082',
      dark: '#FFA000',
    },
    secondary: {
      main: '#212121',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 30,
        textTransform: 'none',
        fontWeight: 600,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
      containedPrimary: {
        color: '#212121', // Черный текст на желтой кнопке
        background: 'linear-gradient(45deg, #FFC107 30%, #FFE082 90%)',
        '&:hover': {
          background: 'linear-gradient(45deg, #FFD54F 30%, #FFF176 90%)',
        },
      },
    },
    MuiCard: {
      root: {
        borderRadius: 15,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiAppBar: {
      colorPrimary: {
        background: 'linear-gradient(45deg, #212121 30%, #424242 90%)',
      },
    },
  },
});

export default theme;