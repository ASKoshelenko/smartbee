// src/pages/Courses.js
import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Card, CardContent, CardMedia, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <Typography>Loading courses...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Available Courses
      </Typography>
      {courses.length === 0 ? (
        <Typography>No courses available at the moment.</Typography>
      ) : (
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={course.image || "https://via.placeholder.com/300x200?text=Course"}
                  alt={course.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
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
      )}
    </Container>
  );
}

export default Courses;