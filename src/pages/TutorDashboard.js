import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, TextField, CircularProgress, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  table: {
    minWidth: 650,
  },
  select: {
    minWidth: 120,
  },
  searchField: {
    marginBottom: theme.spacing(2),
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
}));

function TutorDashboard() {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses/tutor', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      showNotification('Failed to fetch courses', 'error');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/users/students', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      showNotification('Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addStudentToCourse = async (studentId, courseId) => {
    try {
      await axios.post(`/api/courses/${courseId}/enroll`, { studentId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showNotification('Student added to course successfully', 'success');
      fetchStudents();
    } catch (error) {
      console.error('Error adding student to course:', error);
      showNotification('Failed to add student to course', 'error');
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        Tutor Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        Welcome, {user?.name}!
      </Typography>

      <div className={classes.section}>
        <Typography variant="h5" gutterBottom>
          Your Courses
        </Typography>
        <Grid container spacing={2}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Paper>
                <Typography variant="h6">{course.title}</Typography>
                <Typography variant="body2">{course.description}</Typography>
                <Button component={Link} to={`/course/${course._id}`} color="primary">
                  View Course
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Button component={Link} to="/create-course" variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          Create New Course
        </Button>
      </div>

      <div className={classes.section}>
        <Typography variant="h5" gutterBottom>
          Students
        </Typography>
        <TextField
          className={classes.searchField}
          label="Search students"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Select
                      value=""
                      onChange={(e) => addStudentToCourse(student._id, e.target.value)}
                      displayEmpty
                      className={classes.select}
                    >
                      <MenuItem value="" disabled>Add to Course</MenuItem>
                      {courses.map((course) => (
                        <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
}

export default TutorDashboard;