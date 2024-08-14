import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, makeStyles } from '@material-ui/core';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory, Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { useSpring, animated } from 'react-spring';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 64px)', // Учитываем высоту AppBar
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(45deg, #FFC107 30%, #FF9800 90%)',
    borderRadius: 15,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      background: theme.palette.secondary.dark,
    },
  },
  title: {
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.contrastText,
    fontWeight: 700,
  },
  link: {
    marginTop: theme.spacing(2),
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

function Login() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const history = useHistory();
  const { showNotification } = useNotification();

  const animation = useSpring({
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      showNotification('Успешный вход в систему', 'success');
      history.push('/dashboard');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <animated.div style={animation}>
        <Paper className={classes.paper} elevation={6}>
          <Typography component="h1" variant="h4" className={classes.title}>
            Sign in to SmartBee
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link to="/register" className={classes.link}>
              Sign up
            </Link>
          </Typography>
        </Paper>
      </animated.div>
    </Container>
  );
}

export default Login;