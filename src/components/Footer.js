import React from 'react';
import { Typography, Container } from '@material-ui/core';

function Footer() {
  return (
    <footer style={{ marginTop: 'auto', backgroundColor: '#f5f5f5', padding: '20px 0' }}>
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} SmartBee - Be smart with Smart Bee
        </Typography>
      </Container>
    </footer>
  );
}

export default Footer;