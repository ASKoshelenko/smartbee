import React, { useState, useEffect } from 'react';
import { Typography, Button, Grid, Paper, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { School, TrendingUp, EmojiObjects, Timer } from '@material-ui/icons';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';

const HeroBackground = styled.div`
  background-image: url(${process.env.PUBLIC_URL}/assets/images/hero-background.jpg);
  background-size: cover;
  background-position: center;
  height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    filter: blur(5px);
  }
`;

const HeroContent = styled(animated.div)`
  text-align: center;
  color: white;
  z-index: 1;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
`;

const useStyles = makeStyles((theme) => ({
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
  ctaButton: {
    marginTop: theme.spacing(4),
  },
}));

function Home() {
  const classes = useStyles();
  const history = useHistory();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const fadeIn = useSpring({
    opacity: showWelcome ? 1 : 0,
    config: { duration: 1000 },
  });

  const fadeOut = useSpring({
    opacity: showWelcome ? 0 : 1,
    config: { duration: 1000 },
  });

  const navigateTo = (path) => {
    history.push(path);
  };

  return (
    <>
      <HeroBackground>
        <HeroContent style={fadeIn}>
          {showWelcome && (
            <>
              <Typography variant="h2" gutterBottom>
                Welcome to SmartBee
              </Typography>
              <Typography variant="h5" gutterBottom>
                Be smart with SmartBee!
              </Typography>
              <Typography variant="body1">
                Prepare for your exams with confidence using our innovative learning platform.
              </Typography>
            </>
          )}
        </HeroContent>
        <animated.div style={fadeOut}>
          <Button
            onClick={() => navigateTo('/courses')}
            variant="contained"
            color="secondary"
            size="large"
            className={classes.ctaButton}
          >
            Start Learning Now
          </Button>
        </animated.div>
      </HeroBackground>

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
          onClick={() => navigateTo('/register')}
          variant="contained"
          color="primary"
          size="large"
        >
          Sign Up Now
        </Button>
      </Box>
    </>
  );
}

export default Home;