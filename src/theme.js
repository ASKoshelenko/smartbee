import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC107', // Ярко-желтый
    },
    secondary: {
      main: '#212121', // Почти черный
    },
    background: {
      default: '#FFFFFF', // Белый
      paper: '#F5F5F5', // Светло-серый для карточек и панелей
    },
    text: {
      primary: '#212121', // Почти черный
      secondary: '#757575', // Серый
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
      },
      containedPrimary: {
        color: '#212121', // Черный текст на желтой кнопке
      },
    },
    MuiCard: {
      root: {
        borderRadius: 15,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#212121', // Черный AppBar
      },
    },
  },
});

export default theme;