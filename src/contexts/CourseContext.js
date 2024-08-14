import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config';

const CourseContext = createContext();

const sendAuthorizedRequest = async (method, url, data = null) => {
  const token = localStorage.getItem('token');
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
    console.log(`Response for ${url}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error in request to ${url}:`, error);
    throw error;
  }
};

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchUserProgress();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const data = await sendAuthorizedRequest('get', '/courses');
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const data = await sendAuthorizedRequest('get', '/user-progress');
      setUserProgress(data);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const updateProgress = async (courseId, progress) => {
    try {
      await sendAuthorizedRequest('post', '/user-progress', { courseId, progress });
      setUserProgress(prev => ({
        ...prev,
        [courseId]: progress,
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <CourseContext.Provider value={{ courses, userProgress, updateProgress }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};