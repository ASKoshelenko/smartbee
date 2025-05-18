import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  makeStyles,
  Link,
  CircularProgress,
  Grid
} from '@material-ui/core';
import { useAuth } from '../../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 600,
    width: '100%',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
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

const RegisterForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const { register, login, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.validation.passwordMatch'));
      return false;
    }
    if (formData.password.length < 8) {
      setError(t('auth.validation.passwordMinLength'));
      return false;
    }
    if (!formData.name.trim()) {
      setError(t('auth.validation.firstNameRequired'));
      return false;
    }
    if (!formData.email.trim()) {
      setError(t('auth.validation.emailRequired'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      await login(registerData.email, registerData.password);
      history.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.container}>
        <Paper className={classes.paper} elevation={3}>
          <Typography component="h1" variant="h5">
            {t('auth.register.title')}
          </Typography>
          {(error || authError) && (
            <Typography className={classes.error} variant="body2">
              {error || authError}
            </Typography>
          )}
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label={t('auth.register.firstName')}
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label={t('auth.register.email')}
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label={t('auth.register.password')}
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmPassword"
                  label={t('auth.register.confirmPassword')}
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : t('auth.register.submit')}
            </Button>
          </form>
          <Link
            component="button"
            variant="body2"
            className={classes.link}
            onClick={() => history.push('/login')}
          >
            {t('auth.register.haveAccount')} {t('auth.register.login')}
          </Link>
        </Paper>
      </div>
    </Container>
  );
};

export default RegisterForm; 