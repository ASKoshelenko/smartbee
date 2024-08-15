import React from 'react';
import { Typography, Container, Button } from '@material-ui/core';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // Здесь можно логировать ошибку в сервис аналитики
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Typography variant="h4" gutterBottom>
            Oops! Something went wrong.
          </Typography>
          <Typography variant="body1" paragraph>
            We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;