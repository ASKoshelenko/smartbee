// components/CourseList.js

import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useCourses } from '../contexts/CourseContext';

function CourseList() {
  const { courses } = useCourses();

  return (
    <Grid container spacing={4}>
      {courses.map((course) => (
        <Grid item key={course._id} xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://via.placeholder.com/300x200?text=Course" // Используйте изображение по умолчанию
              alt={course.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {course.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {course.description}
              </Typography>
              <Button component={Link} to={`/course/${course._id}`} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
                View Course
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default CourseList;
