import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Typography, Container, Card, CardContent, CardMedia, 
  Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, CircularProgress, TextField, Button
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { useCourses } from '../contexts/CourseContext';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import UserProgress from '../components/UserProgress';
import Lesson from '../components/Lesson';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  sectionHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  lessonItem: {
    backgroundColor: theme.palette.background.paper,
    margin: theme.spacing(1, 0),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  progressContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  progress: {
    height: 10,
    borderRadius: 5,
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  dialogContent: {
    padding: theme.spacing(2),
  },
  mediaContent: {
    maxWidth: '100%',
    height: 'auto',
  },
  reviewSection: {
    marginTop: theme.spacing(4),
  },
  reviewItem: {
    marginBottom: theme.spacing(2),
  },
  reviewForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

function CourseDetail() {
  const classes = useStyles();
  const { id } = useParams();
  const { userProgress, updateProgress } = useCourses();
  const { user } = useAuth();
  const { updateExperience, awardBadge } = useGame();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    const fetchCourseAndReviews = async () => {
      try {
        const courseResponse = await axios.get(`http://localhost:5001/api/courses/${id}`);
        setCourse(courseResponse.data);
        const reviewsResponse = await axios.get(`http://localhost:5001/api/courses/${id}/reviews`);
        setReviews(reviewsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course or reviews:', err);
        setError('Failed to load course details. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourseAndReviews();
  }, [id]);

  const handleAddReview = async () => {
    try {
      const response = await axios.post(`http://localhost:5001/api/courses/${id}/reviews`, newReview, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 0, comment: '' });
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleLessonComplete = async (sectionIndex, lessonIndex) => {
    const progress = userProgress[course._id] || { completed: false, completion: 0 };
    const totalLessons = course.sections.reduce((total, section) => total + section.lessons.length, 0);
    const completedLessons = progress.completion / 100 * totalLessons + 1;
    const newCompletion = (completedLessons / totalLessons) * 100;

    await updateProgress(course._id, { 
      ...progress, 
      completion: newCompletion,
      lastLesson: { sectionIndex, lessonIndex }
    });

    await updateExperience(10); // Предположим, что за каждый урок дается 10 XP

    if (newCompletion === 100) {
      await awardBadge('course_complete');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!course) return <Typography>Course not found</Typography>;

  const progress = userProgress[course._id] || { completed: false, completion: 0 };

  return (
    <Container maxWidth="md" className={classes.container}>
      <UserProgress />
      <Card>
        <CardMedia
          className={classes.media}
          image={course.image || "https://source.unsplash.com/random"}
          title={course.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h3" component="h1">
            {course.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {course.description}
          </Typography>
          <div className={classes.progressContainer}>
            <Typography variant="body2" color="textSecondary">
              Course Progress: {Math.round(progress.completion)}%
            </Typography>
            <div className={classes.progress}>
              <div
                style={{
                  width: `${progress.completion}%`,
                  height: '100%',
                  backgroundColor: '#4caf50',
                  borderRadius: 5,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {course.sections.map((section, sectionIndex) => (
        <Accordion key={sectionIndex}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className={classes.sectionHeader}
          >
            <Typography variant="h6">{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {section.lessons.map((lesson, lessonIndex) => (
                <ListItem key={lessonIndex}>
                  <Lesson 
                    lesson={lesson} 
                    onComplete={() => handleLessonComplete(sectionIndex, lessonIndex)}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      <div className={classes.reviewSection}>
        <Typography variant="h4" gutterBottom>Reviews</Typography>
        {reviews.map((review, index) => (
          <Card key={index} className={classes.reviewItem}>
            <CardContent>
              <Typography variant="h6">{review.user.name}</Typography>
              <Rating value={review.rating} readOnly />
              <Typography variant="body1">{review.comment}</Typography>
            </CardContent>
          </Card>
        ))}
        {user && (
          <Card>
            <CardContent>
              <Typography variant="h6">Add Your Review</Typography>
              <form className={classes.reviewForm} onSubmit={(e) => { e.preventDefault(); handleAddReview(); }}>
                <Rating
                  name="rating"
                  value={newReview.rating}
                  onChange={(event, newValue) => {
                    setNewReview({ ...newReview, rating: newValue });
                  }}
                />
                <TextField
                  label="Your comment"
                  multiline
                  rows={4}
                  variant="outlined"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  inputProps={{ 'aria-label': 'Your comment' }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Submit Review
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
}

export default CourseDetail;