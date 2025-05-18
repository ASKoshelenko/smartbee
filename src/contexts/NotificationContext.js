import React, { createContext, useContext, useState } from 'react';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { green, red, blue } from '@material-ui/core/colors';

const NotificationContext = createContext(null);

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: red[600],
  },
  info: {
    backgroundColor: blue[600],
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export const NotificationProvider = ({ children }) => {
  const classes = useStyles();
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'info', // 'success', 'error', 'info'
  });

  const showNotification = (message, type = 'info') => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
      >
        <SnackbarContent
          className={classes[notification.type]}
          message={
            <span className={classes.message}>
              {notification.message}
            </span>
          }
        />
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
