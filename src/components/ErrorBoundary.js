import React from 'react';
import { Box, Typography, Button, Container } from '@material-ui/core';

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
    this.setState({ errorInfo });
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
          <Box style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: 24,
            textAlign: 'center',
          }}>
            <Typography variant="h4" color="error" gutterBottom>
              Упс! Что-то пошло не так
            </Typography>
            <Typography variant="body1" style={{ marginBottom: 24 }}>
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
              style={{ marginTop: 16 }}
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