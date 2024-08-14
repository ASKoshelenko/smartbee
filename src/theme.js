import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC107',
      light: '#FFE082',
      dark: '#FFA000',
      contrastText: '#212121',
    },
    secondary: {
      main: '#212121',
      light: '#484848',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFDE7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
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
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 25,
        textTransform: 'none',
        fontWeight: 600,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(45deg, #FFC107 30%, #FFE082 90%)',
        '&:hover': {
          background: 'linear-gradient(45deg, #FFD54F 30%, #FFF176 90%)',
        },
      },
    },
    MuiCard: {
      root: {
        overflow: 'visible',
        borderRadius: 15,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 15,
      },
    },
  },
});

export default theme;