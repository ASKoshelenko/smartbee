import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNotification } from '../contexts/NotificationContext';

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
}));

function TutorDashboard() {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/tutor`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCourses(response.data);
    } catch (error) {
      showNotification('Failed to fetch courses', 'error');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStudents(response.data);
    } catch (error) {
      showNotification('Failed to fetch students', 'error');
    }
  };

  const addStudentToCourse = async (studentId, courseId) => {
    try {
      await axios.post(`${API_BASE_URL}/courses/${courseId}/enroll`, { studentId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showNotification('Student added to course successfully', 'success');
    } catch (error) {
      showNotification('Failed to add student to course', 'error');
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Tutor Dashboard
      </Typography>
      <Typography variant="h5" gutterBottom>
        Your Courses
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary">
                    Edit Course
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>
        Students
      </Typography>
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
            {students.map((student) => (
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
    </Container>
  );
}

export default TutorDashboard;