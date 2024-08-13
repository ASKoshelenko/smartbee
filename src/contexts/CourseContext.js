// contexts/CourseContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CourseContext = createContext();

const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    // Получение курсов с API
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/courses');
        setCourses(response.data);
      } catch (err) {
        console.error('Ошибка получения курсов:', err);
      }
    };

    fetchCourses();
  }, []);

  const updateProgress = (courseId, progress) => {
    setUserProgress(prev => ({
      ...prev,
      [courseId]: { ...prev[courseId], ...progress },
    }));
    // TODO: Обновить прогресс на сервере
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

// Обеспечьте, чтобы эти два элемента экспортировались как именованные
export { CourseProvider, useCourses };
