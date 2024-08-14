import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CourseContext = createContext();

const API_BASE_URL = 'http://localhost:5001/api';

const sendAuthorizedRequest = async (method, url, data = null) => {
  const token = localStorage.getItem('token');
  console.log('Using token for request:', token);
  if (!token) {
    throw new Error('No authentication token found');
  }
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Authorized request response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Authorized request error:', error.response?.data || error.message);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await sendAuthorizedRequest('get', '/courses');
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    const fetchUserProgress = async () => {
      try {
        const data = await sendAuthorizedRequest('get', '/user-progress');
        setUserProgress(data);
      } catch (err) {
        console.error('Error fetching user progress:', err);
      }
    };

    if (user) {
      fetchCourses();
      fetchUserProgress();
    }
  }, [user]);

  const updateProgress = async (courseId, progress) => {
    try {
      await sendAuthorizedRequest('post', '/user-progress', { courseId, progress });
      setUserProgress(prev => ({
        ...prev,
        [courseId]: progress,
      }));
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  return (
    <CourseContext.Provider value={{ courses, userProgress, updateProgress }}>
      {children}
    </CourseContext.Provider>
  );
};

const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export { CourseProvider, useCourses };