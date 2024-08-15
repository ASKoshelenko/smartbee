import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: 'linear-gradient(45deg, #FFC107 30%, #FF9800 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700,
    color: theme.palette.primary.contrastText,
    textDecoration: 'none',
  },
  link: {
    color: theme.palette.primary.contrastText,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
  button: {
    marginLeft: theme.spacing(2),
    borderRadius: 25,
    textTransform: 'none',
    fontWeight: 600,
    color: theme.palette.primary.contrastText,
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
    },
  },
  logo: {
    height: 45,
    marginRight: theme.spacing(2),
    filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))',
  },
}));

function Header() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const getDashboardLink = () => {
    switch(user?.role) {
      case 'admin':
        return '/admin';
      case 'tutor':
        return '/tutor';
      case 'student':
      default:
        return '/student';
    }
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <img src="/assets/icons/bee-logo.png" alt="SmartBee Logo" className={classes.logo} />
        <Typography variant="h6" className={classes.title} component={RouterLink} to="/">
          SmartBee
        </Typography>
        {isMobile ? (
          <>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleClick}>
              <MenuIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} component={RouterLink} to="/courses">Courses</MenuItem>
              <MenuItem onClick={handleClose} component={RouterLink} to="/about">About</MenuItem>
              <MenuItem onClick={handleClose} component={RouterLink} to="/contact">Contact</MenuItem>
              {user ? (
                <>
                  <MenuItem onClick={handleClose} component={RouterLink} to="/profile">Profile</MenuItem>
                  <MenuItem onClick={handleClose} component={RouterLink} to={getDashboardLink()}>Dashboard</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleClose} component={RouterLink} to="/login">Login</MenuItem>
                  <MenuItem onClick={handleClose} component={RouterLink} to="/register">Register</MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <>
            <Button className={classes.button} component={RouterLink} to="/courses">Courses</Button>
            <Button className={classes.button} component={RouterLink} to="/about">About</Button>
            <Button className={classes.button} component={RouterLink} to="/contact">Contact</Button>
            {user ? (
              <>
                <Button className={classes.button} component={RouterLink} to="/profile">Profile</Button>
                <Button className={classes.button} component={RouterLink} to={getDashboardLink()}>Dashboard</Button>
                <Button className={classes.button} onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Button className={classes.button} component={RouterLink} to="/login">Login</Button>
                <Button className={classes.button} component={RouterLink} to="/register">Register</Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;