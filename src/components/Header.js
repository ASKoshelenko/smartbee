import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery, Box } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: 'linear-gradient(90deg, #FFD700 0%, #FFC400 100%)',
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
      className={`${classes.navButton} ${to === window.location.pathname ? classes.activeNavButton : ''}`}
    >
      {children}
    </Button>
  );

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logoContainer}>
          <img src="/assets/icons/bee-logo.png" alt="SmartBee Logo" className={classes.logo} />
          <Typography variant="h6" className={classes.title} component={RouterLink} to="/">
            SmartBee
          </Typography>
        </div>
        {isMobile ? (
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <div className={classes.navContainer}>
            <NavButton to="/courses">Courses</NavButton>
            <NavButton to="/about">About</NavButton>
            <NavButton to="/contact">Contact</NavButton>
            {user ? (
              <>
                <NavButton to="/profile">Profile</NavButton>
                <NavButton onClick={logout}>Logout</NavButton>
              </>
            ) : (
              <>
                <NavButton to="/login">Login</NavButton>
                <NavButton to="/register">Register</NavButton>
              </>
            )}
          </div>
        )}
        <Menu
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
              <MenuItem onClick={() => { logout(); handleClose(); }}>Logout</MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={handleClose} component={RouterLink} to="/login">Login</MenuItem>
              <MenuItem onClick={handleClose} component={RouterLink} to="/register">Register</MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;