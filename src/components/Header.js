import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: 'linear-gradient(90deg, #FFA000 0%, #FFD54F 100%)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: 40,
    marginRight: theme.spacing(2),
  },
  title: {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700,
    color: '#000000',
    textDecoration: 'none',
    '&:hover': {
      color: '#000000',
    },
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  navButton: {
    marginLeft: theme.spacing(2),
    color: '#000000',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 20,
    padding: '6px 16px',
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  },
  activeNavButton: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#333333',
    },
  },
  menuButton: {
    marginLeft: theme.spacing(2),
    color: '#000000',
  },
}));

function Header() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const NavButton = ({ to, children, onClick }) => (
    <Button
      component={to ? RouterLink : 'button'}
      to={to}
      onClick={onClick}
      className={`${classes.navButton} ${to === location.pathname ? classes.activeNavButton : ''}`}
    >
      {children}
    </Button>
  );

  const renderNavButtons = () => (
    <>
      <NavButton to="/courses">{t('navigation.courses')}</NavButton>
      <NavButton to="/about">{t('navigation.about')}</NavButton>
      <NavButton to="/contact">{t('navigation.contact')}</NavButton>
      {user ? (
        <>
          {user.role === 'student' && <NavButton to="/student">{t('navigation.studentDashboard')}</NavButton>}
          {user.role === 'tutor' && <NavButton to="/tutor">{t('navigation.tutorDashboard')}</NavButton>}
          {user.role === 'admin' && <NavButton to="/admin">{t('navigation.adminDashboard')}</NavButton>}
          <NavButton to="/profile">{t('navigation.profile')}</NavButton>
          <NavButton onClick={logout}>{t('navigation.logout')}</NavButton>
        </>
      ) : (
        <>
          <NavButton to="/login">{t('navigation.login')}</NavButton>
          <NavButton to="/register">{t('navigation.register')}</NavButton>
        </>
      )}
      <LanguageSwitcher />
    </>
  );

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logoContainer}>
          <img src="/assets/icons/bee-logo.png" alt={t('app.name')} className={classes.logo} />
          <Typography variant="h6" className={classes.title} component={RouterLink} to="/">
            {t('app.name')}
          </Typography>
        </div>
        {isMobile ? (
          <>
            <LanguageSwitcher />
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
          </>
        ) : (
          <div className={classes.navContainer}>
            {renderNavButtons()}
          </div>
        )}
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {isMobile && (
            [
              <MenuItem key="courses" onClick={handleClose} component={RouterLink} to="/courses">{t('navigation.courses')}</MenuItem>,
              <MenuItem key="about" onClick={handleClose} component={RouterLink} to="/about">{t('navigation.about')}</MenuItem>,
              <MenuItem key="contact" onClick={handleClose} component={RouterLink} to="/contact">{t('navigation.contact')}</MenuItem>,
              user ? (
                [
                  user.role === 'student' && (
                    <MenuItem key="student" onClick={handleClose} component={RouterLink} to="/student">{t('navigation.studentDashboard')}</MenuItem>
                  ),
                  user.role === 'tutor' && (
                    <MenuItem key="tutor" onClick={handleClose} component={RouterLink} to="/tutor">{t('navigation.tutorDashboard')}</MenuItem>
                  ),
                  user.role === 'admin' && (
                    <MenuItem key="admin" onClick={handleClose} component={RouterLink} to="/admin">{t('navigation.adminDashboard')}</MenuItem>
                  ),
                  <MenuItem key="profile" onClick={handleClose} component={RouterLink} to="/profile">{t('navigation.profile')}</MenuItem>,
                  <MenuItem key="logout" onClick={() => { logout(); handleClose(); }}>{t('navigation.logout')}</MenuItem>
                ]
              ) : (
                [
                  <MenuItem key="login" onClick={handleClose} component={RouterLink} to="/login">{t('navigation.login')}</MenuItem>,
                  <MenuItem key="register" onClick={handleClose} component={RouterLink} to="/register">{t('navigation.register')}</MenuItem>
                ]
              )
            ]
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;