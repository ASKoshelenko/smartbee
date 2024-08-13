import React from 'react';
import { Typography, Container, Paper } from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';

function UserDashboard() {
  const { user } = useAuth();

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.name}!
        </Typography>
        <Typography variant="body1">
          This is your dashboard. Here you'll be able to see your course progress and quiz results.
        </Typography>
      </Paper>
    </Container>
  );
}

export default UserDashboard;