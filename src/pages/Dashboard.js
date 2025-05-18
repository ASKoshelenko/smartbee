import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Divider,
} from '@material-ui/core';
import {
  School as SchoolIcon,
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingUpIcon,
} from '@material-ui/icons';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  statsCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  statsIcon: {
    fontSize: 40,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  progressSection: {
    marginTop: theme.spacing(3),
  },
  progressBar: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  courseCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  courseContent: {
    flexGrow: 1,
  },
  courseActions: {
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const { user } = useAuth();

  // Временные данные для демонстрации
  const stats = {
    studyTime: 120, // минут
    streakDays: 5,
    completedQuizzes: 12,
    averageScore: 85,
  };

  const recentCourses = [
    {
      id: 1,
      title: 'Украинский язык - Грамматика',
      progress: 65,
      nextLesson: 'Правописание приставок',
    },
    {
      id: 2,
      title: 'Украинский язык - Литература',
      progress: 30,
      nextLesson: 'Творчество Тараса Шевченко',
    },
  ];

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать, {user?.name}!
      </Typography>

      {/* Статистика */}
      <Grid container spacing={3} style={{ marginBottom: 24 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <TimerIcon className={classes.statsIcon} />
            <Typography variant="h6" gutterBottom>
              Время обучения
            </Typography>
            <Typography variant="h4">
              {Math.floor(stats.studyTime / 60)}ч {stats.studyTime % 60}м
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <TrophyIcon className={classes.statsIcon} />
            <Typography variant="h6" gutterBottom>
              Дней подряд
            </Typography>
            <Typography variant="h4">
              {stats.streakDays}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <SchoolIcon className={classes.statsIcon} />
            <Typography variant="h6" gutterBottom>
              Пройдено тестов
            </Typography>
            <Typography variant="h4">
              {stats.completedQuizzes}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <TrendingUpIcon className={classes.statsIcon} />
            <Typography variant="h6" gutterBottom>
              Средний балл
            </Typography>
            <Typography variant="h4">
              {stats.averageScore}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Текущие курсы */}
      <Typography variant="h5" gutterBottom>
        Текущие курсы
      </Typography>
      <Grid container spacing={3}>
        {recentCourses.map((course) => (
          <Grid item xs={12} md={6} key={course.id}>
            <Card className={classes.courseCard}>
              <CardContent className={classes.courseContent}>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Box className={classes.progressSection}>
                  <Typography variant="body2" color="textSecondary">
                    Прогресс
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={course.progress}
                    className={classes.progressBar}
                  />
                  <Typography variant="body2" color="textSecondary">
                    Следующий урок: {course.nextLesson}
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <CardActions className={classes.courseActions}>
                <Button size="small" color="primary">
                  Продолжить обучение
                </Button>
                <Button size="small" color="primary">
                  Пройти тест
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard; 