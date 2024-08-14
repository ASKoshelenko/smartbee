// NotificationContext.js
import React, { createContext, useState, useContext } from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const NotificationContext = createContext();

export const SEVERITY_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, severity = SEVERITY_TYPES.INFO, duration = 6000, autoHide = true) => {
    setNotification({ message, severity, duration, autoHide });
  };

  const hideNotification = (event, reason) => {
    if (reason === 'clickaway' && notification?.autoHide) {
      return;
    }
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <Snackbar 
        open={!!notification} 
        autoHideDuration={notification?.autoHide ? notification.duration : null} 
        onClose={hideNotification}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          onClose={hideNotification} 
          severity={notification?.severity}
        >
          {notification?.message}
        </MuiAlert>
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