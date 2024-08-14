import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Card, CardContent, CardMedia, Button, CircularProgress, makeStyles, Chip, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Book as BookIcon, Schedule as ScheduleIcon, Star as StarIcon, Search as SearchIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
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
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.15s ease-in-out',
    '&:hover': { transform: 'scale3d(1.05, 1.05, 1)' },
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  chipContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
  paginationButton: {
    margin: theme.spacing(0, 1),
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
    setPage(1); // Reset to first page when filters change
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
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2" component="h1" gutterBottom>
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
          <Grid container spacing={4}>
            {currentCourses.map((course) => (
              <Grid item key={course._id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={course.image || "https://source.unsplash.com/random"}
                    title={course.title}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {course.title}
                    </Typography>
                    <div className={classes.chipContainer}>
                      <Chip
                        icon={<BookIcon />}
                        label={`${course.sections ? course.sections.length : 0} sections`}
                        className={classes.chip}
                        size="small"
                      />
                      <Chip
                        icon={<ScheduleIcon />}
                        label="8 weeks"
                        className={classes.chip}
                        size="small"
                      />
                      <Chip
                        icon={<StarIcon />}
                        label="4.5"
                        className={classes.chip}
                        size="small"
                      />
                    </div>
                    <Typography variant="body2" color="textSecondary">
                      {course.description}
                    </Typography>
                    <Button 
                      component={Link} 
                      to={`/course/${course._id}`} 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      className={classes.button}
                    >
                      View Course
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <div className={classes.paginationContainer}>
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={classes.paginationButton}
            >
              Previous
            </Button>
            <Typography>
              Page {page} of {totalPages}
            </Typography>
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={classes.paginationButton}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default Courses;