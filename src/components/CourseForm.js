import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Container, Paper, Typography, 
  Grid, IconButton, Accordion, AccordionSummary, 
  AccordionDetails, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(3),
    margin: theme.spacing(3, 0),
    backgroundColor: '#f0f8ff', // Light blue background
  },
  button: {
    margin: theme.spacing(1),
  },
  accordionHeader: {
    backgroundColor: '#4caf50', // Green header for sections
    color: 'white',
  },
  lessonItem: {
    backgroundColor: '#fff9c4', // Light yellow for lessons
    margin: theme.spacing(1, 0),
  },
}));

function CourseForm() {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState([]);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/courses/${id}`);
      const { title, description, sections } = response.data;
      setTitle(title);
      setDescription(description);
      setSections(sections);
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:5001/api/courses/${id}`, { title, description, sections });
      } else {
        await axios.post('http://localhost:5001/api/courses', { title, description, sections });
      }
      history.push('/tutor/courses');
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const addSection = () => {
    setSections([...sections, { title: '', lessons: [], order: sections.length }]);
  };

  const addLesson = (sectionIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons.push({ title: '', content: '', order: newSections[sectionIndex].lessons.length });
    setSections(newSections);
  };

  const updateSection = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const updateLesson = (sectionIndex, lessonIndex, field, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons[lessonIndex][field] = value;
    setSections(newSections);
  };

  const deleteSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const deleteLesson = (sectionIndex, lessonIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons = newSections[sectionIndex].lessons.filter((_, i) => i !== lessonIndex);
    setSections(newSections);
  };

  return (
    <Container maxWidth="md">
      <Paper className={classes.paper}>
        <Typography variant="h4" align="center" gutterBottom>
          {id ? 'Edit Course' : 'Create New Course'}
        </Typography>
        <form onSubmit={handleSubmit} className={classes.root}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Course Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          {sections.map((section, sectionIndex) => (
            <Accordion key={sectionIndex}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className={classes.accordionHeader}
              >
                <Typography>{section.title || `Section ${sectionIndex + 1}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Section Title"
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <List>
                      {section.lessons.map((lesson, lessonIndex) => (
                        <ListItem key={lessonIndex} className={classes.lessonItem}>
                          <ListItemText
                            primary={
                              <TextField
                                variant="outlined"
                                fullWidth
                                label="Lesson Title"
                                value={lesson.title}
                                onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                              />
                            }
                            secondary={
                              <TextField
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                label="Lesson Content"
                                value={lesson.content}
                                onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'content', e.target.value)}
                              />
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => deleteLesson(sectionIndex, lessonIndex)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => addLesson(sectionIndex)}
                      className={classes.button}
                    >
                      Add Lesson
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteSection(sectionIndex)}
                      className={classes.button}
                    >
                      Delete Section
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addSection}
            className={classes.button}
          >
            Add Section
          </Button>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.button}
          >
            {id ? 'Update Course' : 'Create Course'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default CourseForm;