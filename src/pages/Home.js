import React from 'react';
import { Typography, Container, Button, Grid, Paper } from '@material-ui/core';
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
  paper: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Welcome to SmartBee
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Be smart with Smart Bee
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
      <Container maxWidth="md" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.paper}>
              <div className={classes.icon}>📚</div>
              <Typography variant="h5">Learn</Typography>
              <Typography>Access a wide range of courses tailored to your needs.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.paper}>
              <div className={classes.icon}>🏆</div>
              <Typography variant="h5">Achieve</Typography>
              <Typography>Earn badges and track your progress as you learn.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.paper}>
              <div className={classes.icon}>🚀</div>
              <Typography variant="h5">Grow</Typography>
              <Typography>Improve your skills and advance your career.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Home;