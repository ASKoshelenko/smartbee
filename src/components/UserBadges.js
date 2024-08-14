import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Tooltip, Avatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  badgeItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginBottom: theme.spacing(1),
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
            <Avatar 
              src={`/assets/images/pic-${(index % 6) + 2}.jpg`} 
              alt={badge} 
              className={classes.avatar}
            />
            <Typography variant="caption">{badge}</Typography>
          </div>
        </Tooltip>
      ))}
    </Grid>
  );
}

export default UserBadges;