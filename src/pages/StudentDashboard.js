import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

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
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  searchField: {
    marginBottom: theme.spacing(2),
  },
}));

function StudentDashboard() {
  const classes = useStyles();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { showNotification } = useNotification();

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
      console.error('Error fetching enrolled courses:', error);
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
      console.error('Error fetching available courses:', error);
      showNotification('Failed to fetch available courses', 'error');
    } finally {
      setLoading(false);
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
      console.error('Error enrolling in course:', error);
      showNotification('Failed to enroll in course', 'error');
    }
  };

  const filteredAvailableCourses = availableCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        Welcome, {user?.name}!
      </Typography>

      <div className={classes.section}>
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
                  <Button size="small" color="primary" component={Link} to={`/course/${course._id}`}>
                    Go to Course
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      <div className={classes.section}>
        <Typography variant="h5" gutterBottom>
          Available Courses
        </Typography>
        <TextField
          className={classes.searchField}
          label="Search courses"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Grid container spacing={4}>
          {filteredAvailableCourses.map((course) => (
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
      </div>
    </Container>
  );
}

export default StudentDashboard;