import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  Typography, Container, Card, CardContent, CardMedia, 
  Button, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemText, ListItemIcon, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, PlayCircleOutline as VideoIcon, Image as ImageIcon } from '@material-ui/icons';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { useCourses } from '../contexts/CourseContext';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  sectionHeader: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  lessonItem: {
    backgroundColor: '#fff9c4',
    margin: theme.spacing(1, 0),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#fff59d',
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  progressText: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
  },
  dialogContent: {
    padding: theme.spacing(2),
  },
  mediaContent: {
    maxWidth: '100%',
    height: 'auto',
  },
}));

function CourseDetail() {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();
  const { userProgress, updateProgress } = useCourses();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/courses/${id}`);
        setCourse(response.data);
      } catch (err) {
        console.error('Error fetching course:', err);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return <Typography variant="h5">Loading course...</Typography>;
  }

  const progress = userProgress[course._id] || { completed: false, quizScore: null, completion: 0, lastLesson: null };

  const handleStartCourse = () => {
    const firstSection = course.sections[0];
    const firstLesson = firstSection.lessons[0];
    updateProgress(course._id, { ...progress, completion: 0, lastLesson: { sectionIndex: 0, lessonIndex: 0 } });
    openLessonDialog(firstLesson, 0, 0);
  };

  const handleContinueLearning = () => {
    if (progress.lastLesson) {
      const { sectionIndex, lessonIndex } = progress.lastLesson;
      const lesson = course.sections[sectionIndex].lessons[lessonIndex];
      openLessonDialog(lesson, sectionIndex, lessonIndex);
    } else {
      handleStartCourse();
    }
  };

  const openLessonDialog = (lesson, sectionIndex, lessonIndex) => {
    setSelectedLesson(lesson);
    setOpenDialog(true);
    updateProgress(course._id, { 
      ...progress, 
      lastLesson: { sectionIndex, lessonIndex },
      completion: ((sectionIndex * 100 / course.sections.length) + (lessonIndex * 100 / course.sections[sectionIndex].lessons.length) / course.sections.length)
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNextLesson = () => {
    const { sectionIndex, lessonIndex } = progress.lastLesson;
    let nextSectionIndex = sectionIndex;
    let nextLessonIndex = lessonIndex + 1;

    if (nextLessonIndex >= course.sections[sectionIndex].lessons.length) {
      nextSectionIndex++;
      nextLessonIndex = 0;
    }

    if (nextSectionIndex < course.sections.length) {
      const nextLesson = course.sections[nextSectionIndex].lessons[nextLessonIndex];
      openLessonDialog(nextLesson, nextSectionIndex, nextLessonIndex);
    } else {
      handleCloseDialog();
      updateProgress(course._id, { ...progress, completed: true, completion: 100 });
    }
  };

  return (
    <Container maxWidth="md" className={classes.root}>
      <Card>
        <CardMedia
          className={classes.media}
          image={course.image || "https://source.unsplash.com/random"}
          title={course.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h3" component="div">
            {course.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {course.description}
          </Typography>
          <div className={classes.progressBar}>
            <div
              style={{
                width: `${progress.completion}%`,
                height: '100%',
                backgroundColor: '#4caf50',
                borderRadius: 5,
              }}
            />
          </div>
          <Typography variant="body2" color="textSecondary" className={classes.progressText}>
            {`${Math.round(progress.completion)}% Complete`}
          </Typography>
          {progress.completion > 0 ? (
            <Button variant="contained" color="primary" onClick={handleContinueLearning}>
              Continue Learning
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleStartCourse}>
              Start Course
            </Button>
          )}
        </CardContent>
      </Card>

      {course.sections && course.sections.map((section, sectionIndex) => (
        <Accordion key={sectionIndex}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className={classes.sectionHeader}
          >
            <Typography variant="h6">{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {section.lessons && section.lessons.map((lesson, lessonIndex) => (
                <ListItem 
                  key={lessonIndex} 
                  className={classes.lessonItem}
                  onClick={() => openLessonDialog(lesson, sectionIndex, lessonIndex)}
                >
                  <ListItemText 
                    primary={lesson.title} 
                    secondary={
                      <React.Fragment>
                        {lesson.videoUrl && <VideoIcon className={classes.icon} />}
                        {lesson.imageUrls && lesson.imageUrls.length > 0 && <ImageIcon className={classes.icon} />}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedLesson?.title}</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {selectedLesson?.videoUrl && (
            <video controls className={classes.mediaContent}>
              <source src={selectedLesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {selectedLesson?.imageUrls && selectedLesson.imageUrls.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Lesson image ${index + 1}`} className={classes.mediaContent} />
          ))}
          <Typography variant="body1">{selectedLesson?.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
          <Button onClick={handleNextLesson} color="primary">
            Next Lesson
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CourseDetail;