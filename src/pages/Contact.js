import React from 'react';
import { Typography, Container, TextField, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  form: {
    marginTop: theme.spacing(2),
  },
  image: {
    width: '100%',
    height: 'auto',
    maxWidth: 400,
    marginBottom: theme.spacing(2),
  },
}));

function Contact() {
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.container}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            Contact Us
          </Typography>
          <form className={classes.form} noValidate autoComplete="off">
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
        </Grid>
        <Grid item xs={12} md={6}>
          <img src="/assets/images/contact-img.svg" alt="Contact Us" className={classes.image} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Contact;