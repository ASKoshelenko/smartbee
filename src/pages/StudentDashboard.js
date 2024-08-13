// src/pages/StudentDashboard.js

import React from 'react';
import { Typography, Container, Paper } from '@material-ui/core';

function StudentDashboard() {
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Student Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to your dashboard. Here, you can track your learning progress and view available courses.
        </Typography>
        {/* Add student-specific functionalities here */}
      </Paper>
    </Container>
  );
}

export default StudentDashboard;
