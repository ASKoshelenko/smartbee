// src/pages/TutorDashboard.js

import React from 'react';
import { Typography, Container, Paper } from '@material-ui/core';

function TutorDashboard() {
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Tutor Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to the tutor dashboard. Here, you can view and create courses.
        </Typography>
        {/* Add tutor-specific functionalities here */}
      </Paper>
    </Container>
  );
}

export default TutorDashboard;
