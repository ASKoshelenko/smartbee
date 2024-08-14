import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, LinearProgress, Grid, Chip } from '@material-ui/core';
import { useGame } from '../contexts/GameContext';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  badge: {
    margin: theme.spacing(0.5),
  },
}));

const UserProgress = () => {
  const classes = useStyles();
  const { userStats } = useGame();

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>Your Progress</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Level {userStats.level}</Typography>
          <LinearProgress 
            className={classes.progressBar}
            variant="determinate" 
            value={(userStats.experience % 100)} 
          />
          <Typography variant="caption">
            {userStats.experience} / {userStats.level * 100} XP
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Streak: {userStats.streakDays} days</Typography>
          <Typography variant="subtitle1">Badges:</Typography>
          {userStats.badges.map((badge) => (
            <Chip
              key={badge.id}
              label={badge.name}
              className={classes.badge}
              color="primary"
            />
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserProgress;