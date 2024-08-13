import React from 'react';
import { LinearProgress, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
  },
}));

function CourseProgress({ progress }) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        className={classes.progressBar}
        color="secondary"
      />
      <Typography variant="body2" color="textSecondary" className={classes.progressText}>
        {`${Math.round(progress)}% Complete`}
      </Typography>
    </Box>
  );
}

export default CourseProgress;