import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory, Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 64px)',
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    marginTop: theme.spacing(2),
  },
}));

function Register() {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const history = useHistory();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password, role);
      showNotification('Registration successful. Please log in.', 'success');
      history.push('/login');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Paper className={classes.paper} elevation={3}>
        <Typography component="h1" variant="h5">
          Sign up for SmartBee
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
        </form>
        <Typography variant="body2" className={classes.link}>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Register;