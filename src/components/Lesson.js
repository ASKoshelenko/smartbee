import React, { useState } from 'react';
import { 
  Typography, Card, CardContent, CardMedia, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InteractiveTask from './InteractiveTask';
import { useGame } from '../contexts/GameContext';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

const Lesson = ({ lesson, onComplete }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const { updateExperience } = useGame();

  const handleTaskComplete = async (points) => {
    setTaskCompleted(true);
    await updateExperience(points);
    onComplete();
  };

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={lesson.image || "https://source.unsplash.com/random"}
        title={lesson.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {lesson.title}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Start Lesson
        </Button>
      </CardContent>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{lesson.title}</DialogTitle>
        <DialogContent>
          {lesson.videoUrl && (
            <video controls width="100%">
              <source src={lesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <Typography className={classes.content}>{lesson.content}</Typography>
          {lesson.interactiveTask && !taskCompleted && (
            <InteractiveTask 
              task={lesson.interactiveTask} 
              onComplete={handleTaskComplete}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
          {taskCompleted && (
            <Button onClick={onComplete} color="primary">
              Next Lesson
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Lesson;