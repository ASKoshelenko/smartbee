import React from 'react';
import { Typography, Container, Button } from '@material-ui/core';

const GlobalErrorHandler = ({ error }) => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" paragraph>
        {error || 'An unexpected error occurred. Please try again later.'}
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
};

export default GlobalErrorHandler;