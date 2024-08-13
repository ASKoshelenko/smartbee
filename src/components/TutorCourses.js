import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TutorCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/courses/tutor');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:5001/api/courses/${id}`);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Your Courses
      </Typography>
      <Button component={Link} to="/tutor/courses/new" variant="contained" color="primary" style={{ marginBottom: '1rem' }}>
        Create New Course
      </Button>
      <List>
        {courses.map((course) => (
          <ListItem key={course._id}>
            <ListItemText primary={course.title} secondary={course.description} />
            <Button component={Link} to={`/tutor/courses/edit/${course._id}`} variant="outlined" color="primary" style={{ marginRight: '0.5rem' }}>
              Edit
            </Button>
            <Button onClick={() => handleDelete(course._id)} variant="outlined" color="secondary">
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default TutorCourses;