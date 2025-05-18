import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  makeStyles,
  Link,
  CircularProgress
} from '@material-ui/core';
import { useAuth } from '../../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  error: {
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  link: {
    marginTop: theme.spacing(2),
  }
}));

const LoginForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const { login, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      history.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.container}>
        <Paper className={classes.paper} elevation={3}>
          <Typography component="h1" variant="h5">
            Вход в SmartBee
          </Typography>
          
          {(error || authError) && (
            <Typography className={classes.error} variant="body2">
              {error || authError}
            </Typography>
          )}

          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Войти'}
            </Button>
          </form>

          <Link
            component="button"
            variant="body2"
            className={classes.link}
            onClick={() => history.push('/register')}
          >
            Нет аккаунта? Зарегистрироваться
          </Link>
          
          <Link
            component="button"
            variant="body2"
            className={classes.link}
            onClick={() => history.push('/forgot-password')}
          >
            Забыли пароль?
          </Link>
        </Paper>
      </div>
    </Container>
  );
};

export default LoginForm; 