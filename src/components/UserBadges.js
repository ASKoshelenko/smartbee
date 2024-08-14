import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  badgeItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
  badgeIcon: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
    position: 'relative',
  },
  badgeImage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '60%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5rem',
  },
  hexagon: {
    width: '100%',
    height: '100%',
    backgroundColor: 'currentColor',
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  },
}));

const badgeDescriptions = {
  'course_complete': 'Completed a course',
  'streak_7': 'Maintained a 7-day learning streak',
  'first_quiz': 'Completed your first quiz',
  // Add more badge descriptions as needed
};

const badgeIcons = {
  'course_complete': '🎓',
  'streak_7': '🔥',
  'first_quiz': '✅',
  // Add more badge icons as needed
};

function UserBadges({ badges }) {
  const classes = useStyles();

  return (
    <Grid container justifyContent="center">
      {badges.map((badge, index) => (
        <Tooltip key={index} title={badgeDescriptions[badge] || badge}>
          <div className={classes.badgeItem}>
            <div className={classes.badgeIcon}>
              <div className={classes.hexagon}></div>
              <div className={classes.badgeImage}>{badgeIcons[badge] || '🐝'}</div>
            </div>
            <Typography variant="caption">{badge}</Typography>
          </div>
        </Tooltip>
      ))}
    </Grid>
  );
}

export default UserBadges;