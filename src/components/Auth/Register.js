import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Select, MenuItem, FormControl, InputLabel, makeStyles } from '@material-ui/core';
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

function Register() {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { register } = useAuth();
  const history = useHistory();
  const { showNotification } = useNotification();

  const animation = useSpring({
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      showNotification('Регистрация успешна. Пожалуйста, войдите в систему.', 'success');
      history.push('/login');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <animated.div style={animation}>
        <Paper className={classes.paper} elevation={6}>
          <Typography component="h1" variant="h4" className={classes.title}>
            Join SmartBee
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="tutor">Tutor</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
          </form>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" className={classes.link}>
              Sign in
            </Link>
          </Typography>
        </Paper>
      </animated.div>
    </Container>
  );
}

export default Register;