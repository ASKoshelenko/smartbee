import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC107', // Amber
      light: '#FFECB3',
      dark: '#FFA000',
      contrastText: '#212121',
    },
    secondary: {
      main: '#1976D2', // Blue
      light: '#64B5F6',
      dark: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5',
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
      fontSize: '3rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    subtitle1: {
      fontSize: '1.1rem',
    },
    body1: {
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        padding: '10px 20px',
      },
      containedPrimary: {
        '&:hover': {
          backgroundColor: '#FFB300',
        },
      },
      containedSecondary: {
        '&:hover': {
          backgroundColor: '#1565C0',
        },
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 8,
      },
      elevation1: {
        boxShadow: '0px 3px 15px rgba(0,0,0,0.1)',
      },
    },
  },
});

export default theme;