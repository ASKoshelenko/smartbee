import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.light,
    },
  },
  logo: {
    height: 40,
    marginRight: theme.spacing(2),
  },
  appBar: {
    backgroundColor: theme.palette.secondary.main,
  },
  button: {
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
    },
  },
  greeting: {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(2),
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

  const getDashboardLink = () => {
    switch(user?.role) {
      case 'admin':
        return '/admin';
      case 'tutor':
        return '/tutor';
      case 'student':
        return '/student';
      default:
        return '/';
    }
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <img src="/assets/icons/android-chrome-192x192.png" alt="SmartBee Logo" className={classes.logo} />
        <Typography variant="h6" className={classes.title}>
          <Link to="/" className={classes.link}>
            SmartBee
          </Link>
        </Typography>
        {user && (
          <Typography variant="subtitle1" className={classes.greeting}>
            Привет, {user.name}!
          </Typography>
        )}
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
              <MenuItem onClick={handleClose} component={Link} to="/courses">Courses</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/about">About</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/contact">Contact</MenuItem>
              {user ? (
                <>
                  <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to={getDashboardLink()}>Dashboard</MenuItem>
                  <MenuItem onClick={() => { logout(); handleClose(); }}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleClose} component={Link} to="/login">Login</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/register">Register</MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <>
            <Button className={classes.button} component={Link} to="/courses">Courses</Button>
            <Button className={classes.button} component={Link} to="/about">About</Button>
            <Button className={classes.button} component={Link} to="/contact">Contact</Button>
            {user ? (
              <>
                <Button className={classes.button} component={Link} to="/profile">Profile</Button>
                <Button className={classes.button} component={Link} to={getDashboardLink()}>Dashboard</Button>
                <Button className={classes.button} onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Button className={classes.button} component={Link} to="/login">Login</Button>
                <Button className={classes.button} component={Link} to="/register">Register</Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;