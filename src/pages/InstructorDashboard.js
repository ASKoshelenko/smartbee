import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  searchField: {
    marginBottom: theme.spacing(2),
  },
}));

const InstructorDashboard = () => {
    const classes = useStyles();
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
  
    useEffect(() => {
      fetchCourses();
      fetchStudents();
    }, []);

    const fetchCourses = async () => {
        try {
          const response = await axios.get('/api/courses/instructor', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setCourses(response.data);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      };
    
      const fetchStudents = async () => {
        try {
          const response = await axios.get('/api/students', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setStudents(response.data);
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      };
    
      const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom>Instructor Dashboard</Typography>
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom>Your Courses</Typography>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell align="right">Students Enrolled</TableCell>
                <TableCell align="right">Average Progress</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell component="th" scope="row">
                    {course.title}
                  </TableCell>
                  <TableCell align="right">{course.studentsEnrolled}</TableCell>
                  <TableCell align="right">{course.averageProgress}%</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="primary" size="small">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom>Student Progress</Typography>
        <TextField
          className={classes.searchField}
          label="Search students"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Courses Enrolled</TableCell>
                <TableCell align="right">Overall Progress</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell component="th" scope="row">
                    {student.name}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell align="right">{student.coursesEnrolled}</TableCell>
                  <TableCell align="right">{student.overallProgress}%</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="primary" size="small">
                      View Progress
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default InstructorDashboard;