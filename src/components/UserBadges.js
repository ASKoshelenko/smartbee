import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Tooltip } from '@material-ui/core';
import { Star as StarIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  badgeIcon: {
    fontSize: 40,
    color: theme.palette.secondary.main,
  },
  badgeItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
}));

const badgeDescriptions = {
  'course_complete': 'Completed a course',
  'streak_7': 'Maintained a 7-day learning streak',
  'first_quiz': 'Completed your first quiz',
  // Add more badge descriptions as needed
};

function UserBadges({ badges }) {
  const classes = useStyles();

  return (
    <Grid container justifyContent="center">
      {badges.map((badge, index) => (
        <Tooltip key={index} title={badgeDescriptions[badge] || badge}>
          <div className={classes.badgeItem}>
            <StarIcon className={classes.badgeIcon} />
            <Typography variant="caption">{badge}</Typography>
          </div>
        </Tooltip>
      ))}
    </Grid>
  );
}

export default UserBadges;