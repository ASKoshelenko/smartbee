import React from 'react';
import { Typography, Container, Grid, Card, CardContent, CardMedia, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useCourses } from '../contexts/CourseContext.js';

function Courses() {
  const { courses } = useCourses();

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Available Courses
      </Typography>
      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid item key={course.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={course.image}
                alt={course.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {course.description}
                </Typography>
                <Button component={Link} to={`/course/${course.id}`} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
                  View Course
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Courses;
