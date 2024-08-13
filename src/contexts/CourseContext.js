import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CourseContext = createContext();

const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/courses');
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    const fetchUserProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/user-progress', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserProgress(response.data);
      } catch (err) {
        console.error('Error fetching user progress:', err);
      }
    };

    fetchCourses();
    fetchUserProgress();
  }, []);

  const updateProgress = async (courseId, progress) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/user-progress', 
        { courseId, progress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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