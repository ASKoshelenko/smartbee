// pages/CourseDetail.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Card, CardContent, CardMedia, Button } from '@material-ui/core';
import axios from 'axios';
import Quiz from '../components/Quiz';
import { useCourses } from '../contexts/CourseContext.js';

function CourseDetail() {
  const { id } = useParams();
  const { userProgress, updateProgress } = useCourses();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/courses/${id}`);
        setCourse(response.data);
      } catch (err) {
        console.error('Ошибка получения курса:', err);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return <Typography variant="h5">Курс не найден</Typography>;
  }

  const progress = userProgress[course._id] || { completed: false, quizScore: null };

  const handleQuizCompletion = (score) => {
    updateProgress(course._id, { completed: true, quizScore: score });
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image="https://via.placeholder.com/300x200?text=Course" // Используйте изображение по умолчанию
          alt={course.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h3" component="div">
            {course.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {course.content}
          </Typography>
          {progress.completed ? (
            <Typography variant="h6" color="primary">
              Курс завершен! Результат викторины: {progress.quizScore}%
            </Typography>
          ) : (
            <Button variant="contained" color="primary">
              Начать курс
            </Button>
          )}
        </CardContent>
      </Card>
      {!progress.completed && <Quiz onComplete={handleQuizCompletion} />}
    </Container>
  );
}

export default CourseDetail;
