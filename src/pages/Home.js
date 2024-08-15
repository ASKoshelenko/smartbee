import React from 'react';
import { Typography, Container, Button, Grid, Paper, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { School, TrendingUp, EmojiObjects, Timer } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  hero: {
    backgroundImage: 'url("/assets/images/hero-background.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: theme.palette.common.white,
    padding: theme.spacing(20, 0),
    textAlign: 'center',
  },
  heroContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
  },
  subtitle: {
    marginBottom: theme.spacing(4),
  },
  ctaButton: {
    marginTop: theme.spacing(4),
  },
  section: {
    padding: theme.spacing(8, 0),
  },
  sectionTitle: {
    marginBottom: theme.spacing(4),
  },
  featureIcon: {
    fontSize: 48,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  testimonialPaper: {
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.hero}>
        <Container maxWidth="md">
          <Paper elevation={3} className={classes.heroContent}>
            <Typography component="h1" variant="h2" gutterBottom>
              Welcome to SmartBee
            </Typography>
            <Typography variant="h5" className={classes.subtitle}>
              Be smart with SmartBee!
            </Typography>
            <Typography variant="body1" paragraph>
              Prepare for your exams with confidence using our innovative learning platform.
            </Typography>
            <Button
              component={Link}
              to="/courses"
              variant="contained"
              color="secondary"
              size="large"
              className={classes.ctaButton}
            >
              Start Learning Now
            </Button>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box className={classes.section}>
          <Typography variant="h3" align="center" className={classes.sectionTitle}>
            Why Choose SmartBee?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Box align="center">
                <School className={classes.featureIcon} />
                <Typography variant="h6" gutterBottom>Expert Tutors</Typography>
                <Typography>Learn from experienced educators who know the exam requirements inside out.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box align="center">
                <TrendingUp className={classes.featureIcon} />
                <Typography variant="h6" gutterBottom>Track Your Progress</Typography>
                <Typography>Monitor your improvement with detailed analytics and performance insights.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box align="center">
                <EmojiObjects className={classes.featureIcon} />
                <Typography variant="h6" gutterBottom>Adaptive Learning</Typography>
                <Typography>Our AI-powered system adapts to your learning style for maximum efficiency.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box align="center">
                <Timer className={classes.featureIcon} />
                <Typography variant="h6" gutterBottom>Practice Exams</Typography>
                <Typography>Take timed, realistic practice exams to build your confidence and skills.</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h3" align="center" className={classes.sectionTitle}>
            Student Success Stories
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper className={classes.testimonialPaper}>
                <Typography variant="body1" paragraph>
                  "SmartBee helped me boost my grades and gain confidence in my abilities. I aced my exams!"
                </Typography>
                <Typography variant="subtitle2">- Sarah J., Grade 11</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className={classes.testimonialPaper}>
                <Typography variant="body1" paragraph>
                  "The practice exams were incredibly helpful. I felt well-prepared and calm during my actual tests."
                </Typography>
                <Typography variant="subtitle2">- Michael L., Grade 12</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className={classes.testimonialPaper}>
                <Typography variant="body1" paragraph>
                  "I love how SmartBee adapts to my learning style. It's like having a personal tutor available 24/7!"
                </Typography>
                <Typography variant="subtitle2">- Emily R., Grade 10</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.section} textAlign="center">
          <Typography variant="h3" gutterBottom>
            Ready to Excel in Your Exams?
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            color="primary"
            size="large"
          >
            Sign Up Now
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Home;