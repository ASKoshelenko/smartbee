import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Grid, Box, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { School, TrendingUp, EmojiObjects, Timer } from '@material-ui/icons';
import { useSpring, animated } from 'react-spring';

const useStyles = makeStyles((theme) => ({
  hero: {
    backgroundImage: 'url(/assets/images/hero-background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)',
    },
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    color: theme.palette.common.white,
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  section: {
    padding: theme.spacing(8, 0),
  },
  sectionTitle: {
    marginBottom: theme.spacing(6),
  },
  featureIcon: {
    fontSize: 48,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  testimonial: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
    },
  },
  ctaButton: {
    marginTop: theme.spacing(4),
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(0,0,0,0.4)',
    },
  },
}));

function Home() {
  const classes = useStyles();
  const history = useHistory();
  const [showWelcome, setShowWelcome] = useState(true);

  const fadeIn = useSpring({
    opacity: showWelcome ? 1 : 0,
    transform: showWelcome ? 'translateY(0)' : 'translateY(-50px)',
    config: { duration: 1000 },
  });

  const fadeOut = useSpring({
    opacity: showWelcome ? 0 : 1,
    transform: showWelcome ? 'translateY(50px)' : 'translateY(0)',
    config: { duration: 1000 },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const navigateTo = useCallback((path) => {
    history.push(path);
  }, [history]);

  return (
    <>
      <Box className={classes.hero}>
        <Container>
          <animated.div style={fadeIn}>
            {showWelcome && (
              <Box className={classes.heroContent}>
                <Typography variant="h2" gutterBottom>
                  Welcome to SmartBee
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Be smart with SmartBee!
                </Typography>
                <Typography variant="body1">
                  Prepare for your exams with confidence using our innovative learning platform.
                </Typography>
              </Box>
            )}
          </animated.div>
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
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box className={classes.section}>
          <Typography variant="h3" align="center" className={classes.sectionTitle}>
            Why Choose SmartBee?
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: School, title: 'Expert Tutors', description: 'Learn from experienced educators who know the exam requirements inside out.' },
              { icon: TrendingUp, title: 'Track Your Progress', description: 'Monitor your improvement with detailed analytics and performance insights.' },
              { icon: EmojiObjects, title: 'Adaptive Learning', description: 'Our AI-powered system adapts to your learning style for maximum efficiency.' },
              { icon: Timer, title: 'Practice Exams', description: 'Take timed, realistic practice exams to build your confidence and skills.' },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box align="center">
                  <feature.icon className={classes.featureIcon} />
                  <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                  <Typography>{feature.description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h3" align="center" className={classes.sectionTitle}>
            Student Success Stories
          </Typography>
          <Grid container spacing={4}>
            {[
              { quote: "SmartBee helped me boost my grades and gain confidence in my abilities. I aced my exams!", author: "Sarah J., Grade 11" },
              { quote: "The practice exams were incredibly helpful. I felt well-prepared and calm during my actual tests.", author: "Michael L., Grade 12" },
              { quote: "I love how SmartBee adapts to my learning style. It's like having a personal tutor available 24/7!", author: "Emily R., Grade 10" },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box className={classes.testimonial}>
                  <Typography variant="body1" paragraph>
                    "{testimonial.quote}"
                  </Typography>
                  <Typography variant="subtitle2">- {testimonial.author}</Typography>
                </Box>
              </Grid>
            ))}
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
            className={classes.ctaButton}
          >
            Sign Up Now
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Home;