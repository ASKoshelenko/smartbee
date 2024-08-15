import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  const setRefreshToken = (token) => {
    if (token) {
      localStorage.setItem('refreshToken', token);
    } else {
      localStorage.removeItem('refreshToken');
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
      const { token, refreshToken, user } = response.data;
      setAuthToken(token);
      setRefreshToken(refreshToken);
      setUser(user);
      showNotification('Login successful', 'success');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred during login';
      showNotification(errorMessage, 'error');
      throw new Error(errorMessage);
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, { name, email, password, role });
      showNotification('Registration successful. Please log in.', 'success');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred during registration';
      showNotification(errorMessage, 'error');
      throw new Error(errorMessage);
    }
  };

  const logout = useCallback(() => {
    setAuthToken(null);
    setRefreshToken(null);
    setUser(null);
    showNotification('You have been logged out', 'info');
  }, [showNotification]);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, { refreshToken });
      const { token } = response.data;
      setAuthToken(token);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return false;
    }
  }, [logout]);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        const response = await axios.get(`${API_BASE_URL}/users/me`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          const refreshed = await refreshToken();
          if (!refreshed) {
            logout();
          }
        } else {
          logout();
        }
      }
    }
    setLoading(false);
  }, [logout, refreshToken]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Interceptor для автоматического обновления токена
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          try {
            await refreshToken();
            return axios(error.config);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};