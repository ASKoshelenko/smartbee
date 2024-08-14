import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Chip, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { Book as BookIcon, Schedule as ScheduleIcon, Star as StarIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  cardWrapper: {
    width: '100%',
    paddingTop: '115%', // Aspect ratio 1:1.15 for hexagon shape
    position: 'relative',
    overflow: 'hidden',
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(3, 2),
    textAlign: 'center',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.palette.secondary.main,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    maxWidth: '100%',
    marginTop: '5em'
  },
  description: {
    marginBottom: theme.spacing(2),
    color: theme.palette.secondary.main,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
  },
  chipContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    marginBottom: '20px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
}));

const CourseCard = ({ course }) => {
  const classes = useStyles();

  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  const calc = (x, y) => [
    -(y - window.innerHeight / 2) / 20,
    (x - window.innerWidth / 2) / 20,
    1.1,
  ];
  const trans = (x, y, s) =>
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  return (
    <div className={classes.cardWrapper}>
      <animated.div
        className={classes.card}
        onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
        onMouseLeave={() => set({ xys: [0, 0, 1] })}
        style={{ transform: props.xys.interpolate(trans) }}
      >
        <div className={classes.content}>
          <Tooltip title={course.title} placement="top">
            <Typography variant="h6" className={classes.title}>
              {course.title}
            </Typography>
          </Tooltip>
          <div className={classes.chipContainer}>
            <Chip icon={<BookIcon />} label={`${course.sections ? course.sections.length : 0} sections`} className={classes.chip} size="small" />
            <Chip icon={<ScheduleIcon />} label="8 weeks" className={classes.chip} size="small" />
            <Chip icon={<StarIcon />} label="4.5" className={classes.chip} size="small" />
          </div>
          <Typography variant="body2" className={classes.description}>
            {course.description}
          </Typography>
          <Button
            component={Link}
            to={`/course/${course._id}`}
            variant="contained"
            className={classes.button}
          >
            View Course
          </Button>
        </div>
      </animated.div>
    </div>
  );
};

export default CourseCard;