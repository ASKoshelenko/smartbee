import React, { useEffect, useState } from 'react';
import { Typography, Container, CircularProgress, makeStyles, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { useSpring, animated } from 'react-spring';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(4),
    color: theme.palette.primary.main,
    textAlign: 'center',
    fontWeight: 700,
  },
  searchContainer: {
    display: 'flex',
    marginBottom: theme.spacing(3),
  },
  searchInput: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
  },
  filterSelect: {
    minWidth: 120,
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  paginationButton: {
    margin: theme.spacing(0, 1),
  },
  paginationText: {
    margin: theme.spacing(0, 2),
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: theme.spacing(4),
    justifyContent: 'center',
  },
}));

function Courses() {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [coursesPerPage] = useState(6);

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/courses');
        setCourses(response.data);
        setFilteredCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const results = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === '' || course.category === categoryFilter)
    );
    setFilteredCourses(results);
    setPage(1);
  }, [searchTerm, categoryFilter, courses]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const indexOfLastCourse = page * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <animated.div style={fadeIn}>
      <Container maxWidth="lg" className={classes.container}>
        <Typography variant="h2" component="h1" className={classes.title}>
          Available Courses
        </Typography>
        <div className={classes.searchContainer}>
          <TextField
            className={classes.searchInput}
            variant="outlined"
            placeholder="Search courses..."
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FormControl variant="outlined" className={classes.filterSelect}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="programming">Programming</MenuItem>
              <MenuItem value="design">Design</MenuItem>
              <MenuItem value="business">Business</MenuItem>
            </Select>
          </FormControl>
        </div>
        {filteredCourses.length === 0 ? (
          <Typography>No courses found matching your criteria.</Typography>
        ) : (
          <>
            <div className={classes.courseGrid}>
              {currentCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
            <div className={classes.paginationContainer}>
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={classes.paginationButton}
                variant="contained"
                color="primary"
              >
                Previous
              </Button>
              <Typography className={classes.paginationText}>
                Page {page} of {totalPages}
              </Typography>
              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={classes.paginationButton}
                variant="contained"
                color="primary"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Container>
    </animated.div>
  );
}

export default Courses;