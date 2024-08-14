import React, { useEffect, useState } from 'react';
import { Typography, Container, Paper, Grid, CircularProgress, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { useNotification } from '../contexts/NotificationContext';
import UserBadges from '../components/UserBadges';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statItem: {
    margin: theme.spacing(2, 0),
  },
  progress: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
}));

function UserDashboard() {
  const classes = useStyles();
  const { user } = useAuth();
  const { userStats } = useGame();
  const { showNotification } = useNotification();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/enrolled-courses`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEnrolledCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        showNotification('Failed to load enrolled courses', 'error');
        setLoading(false);
      }
    };

    if (user) {
      fetchEnrolledCourses();
    }
  }, [user, showNotification]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md" className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Your Stats</Typography>
            <div className={classes.statItem}>
              <Typography>Level: {userStats.level}</Typography>
              <LinearProgress 
                className={classes.progress}
                variant="determinate" 
                value={(userStats.experience % 100)} 
              />
              <Typography variant="caption">
                {userStats.experience} / {(userStats.level) * 100} XP
              </Typography>
            </div>
            <Typography className={classes.statItem}>
              Badges Earned: {userStats.badges.length}
            </Typography>
            <Typography className={classes.statItem}>
              Learning Streak: {userStats.streakDays} days
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Enrolled Courses</Typography>
            {enrolledCourses.map((course) => (
              <Typography key={course._id}>{course.title}</Typography>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Your Badges</Typography>
            <UserBadges badges={userStats.badges} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default UserDashboard;