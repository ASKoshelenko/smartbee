import React from 'react';
import { Box, Typography, Button, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 64,
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
  },
  errorText: {
    marginBottom: theme.spacing(3),
  },
  retryButton: {
    marginTop: theme.spacing(2),
  },
}));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Здесь можно добавить отправку ошибки в сервис аналитики
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box className={useStyles().root}>
            <Typography variant="h4" color="error" gutterBottom>
              Упс! Что-то пошло не так
            </Typography>
            <Typography variant="body1" className={useStyles().errorText}>
              Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
            </Typography>
            {process.env.NODE_ENV === 'development' && (
              <Box mt={2} mb={2}>
                <Typography variant="body2" color="textSecondary">
                  {this.state.error && this.state.error.toString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleRetry}
              className={useStyles().retryButton}
            >
              Попробовать снова
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;