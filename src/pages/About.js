import React from 'react';
import { Typography, Container } from '@material-ui/core';

function About() {
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        About SmartBee
      </Typography>
      <Typography variant="body1" paragraph>
        SmartBee is an innovative online learning platform dedicated to helping students achieve their educational goals through interactive courses and engaging quizzes.
      </Typography>
      <Typography variant="body1">
        Our mission is to make learning accessible, enjoyable, and effective for everyone.
      </Typography>
    </Container>
  );
}

export default About;