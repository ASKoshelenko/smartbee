import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Chip, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Book as BookIcon, Schedule as ScheduleIcon, Star as StarIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.15s ease-in-out',
    '&:hover': { transform: 'scale3d(1.05, 1.05, 1)' },
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  chipContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

function CourseList({ courses }) {
  const classes = useStyles();

  return (
    <Grid container spacing={4}>
      {courses.map((course) => (
        <Grid item key={course._id} xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardMedia
              className={classes.cardMedia}
              image={course.image || "https://source.unsplash.com/random"}
              title={course.title}
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {course.title}
              </Typography>
              <div className={classes.chipContainer}>
                <Chip
                  icon={<BookIcon />}
                  label={`${course.sections.length} sections`}
                  className={classes.chip}
                  size="small"
                />
                <Chip
                  icon={<ScheduleIcon />}
                  label="8 weeks"
                  className={classes.chip}
                  size="small"
                />
                <Chip
                  icon={<StarIcon />}
                  label="4.5"
                  className={classes.chip}
                  size="small"
                />
              </div>
              <Typography variant="body2" color="textSecondary" component="p">
                {course.description}
              </Typography>
            </CardContent>
            <Button component={Link} to={`/course/${course._id}`} variant="contained" color="primary" fullWidth>
              View Course
            </Button>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default CourseList;