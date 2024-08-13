import React from 'react';
import { Typography, Container, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <div className={classes.heroContent}>
      <Container maxWidth="sm">
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Welcome to SmartBee
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Be smart with Smart Bee
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Discover a world of knowledge with our interactive courses and quizzes.
        </Typography>
        <div className={classes.heroButtons}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" component={Link} to="/courses">
                Explore Courses
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}

export default Home;