import React from 'react';
import { Typography, Container, TextField, Button } from '@material-ui/core';

function Contact() {
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Contact Us
      </Typography>
      <form noValidate autoComplete="off">
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          variant="outlined"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          variant="outlined"
          type="email"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Message"
          variant="outlined"
          multiline
          rows={4}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '1rem' }}
        >
          Send Message
        </Button>
      </form>
    </Container>
  );
}

export default Contact;