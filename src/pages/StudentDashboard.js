import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
}));

function StudentDashboard() {
  const classes = useStyles();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const { showNotification } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    fetchEnrolledCourses();
    fetchAvailableCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/enrolled-courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEnrolledCourses(response.data);
    } catch (error) {
      showNotification('Failed to fetch enrolled courses', 'error');
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/available`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAvailableCourses(response.data);
    } catch (error) {
      showNotification('Failed to fetch available courses', 'error');
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      await axios.post(`${API_BASE_URL}/courses/${courseId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showNotification('Successfully enrolled in course', 'success');
      fetchEnrolledCourses();
      fetchAvailableCourses();
    } catch (error) {
      showNotification('Failed to enroll in course', 'error');
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}!
      </Typography>
      <Typography variant="h5" gutterBottom>
        Your Enrolled Courses
      </Typography>
      <Grid container spacing={4}>
        {enrolledCourses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {course.title}
                </Typography>
                <Typography>
                  {course.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Go to Course
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>
        Available Courses
      </Typography>
      <Grid container spacing={4}>
        {availableCourses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {course.title}
                </Typography>
                <Typography>
                  {course.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => enrollInCourse(course._id)}>
                  Enroll
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default StudentDashboard;