import React from 'react';
import { Typography, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  image: {
    width: '100%',
    height: 'auto',
    maxWidth: 400,
    marginBottom: theme.spacing(2),
  },
}));

function About() {
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.container}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            About SmartBee
          </Typography>
          <Typography variant="body1" paragraph>
            SmartBee is an innovative online learning platform dedicated to helping students achieve their educational goals through interactive courses and engaging quizzes.
          </Typography>
          <Typography variant="body1">
            Our mission is to make learning accessible, enjoyable, and effective for everyone.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <img src="/assets/images/about-img.svg" alt="About SmartBee" className={classes.image} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default About;