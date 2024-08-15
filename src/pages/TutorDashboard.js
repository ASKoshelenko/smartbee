import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));

function TutorDashboard() {
  const classes = useStyles();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalRevenue: 0 });

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses/tutor', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/tutors/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Typography variant="h4" className={classes.title}>
          Welcome, {user.name}!
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography variant="h6">Total Students</Typography>
              <Typography variant="h4">{stats.totalStudents}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4">${stats.totalRevenue.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h6" className={classes.title}>Your Courses</Typography>
              <TableContainer>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course Title</TableCell>
                      <TableCell align="right">Enrolled Students</TableCell>
                      <TableCell align="right">Average Rating</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course._id}>
                        <TableCell component="th" scope="row">
                          {course.title}
                        </TableCell>
                        <TableCell align="right">{course.enrolledStudents}</TableCell>
                        <TableCell align="right">{course.averageRating.toFixed(1)}</TableCell>
                        <TableCell align="right">
                          <Button component={Link} to={`/course/${course._id}/edit`} color="primary">
                            Edit
                          </Button>
                          <Button component={Link} to={`/course/${course._id}/analytics`} color="secondary">
                            Analytics
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                component={Link}
                to="/create-course"
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
              >
                Create New Course
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default TutorDashboard;