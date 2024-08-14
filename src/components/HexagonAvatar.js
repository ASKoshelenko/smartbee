import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  hexagon: {
    width: '100px',
    height: '57.74px',
    background: theme.palette.primary.main,
    position: 'relative',
    display: 'inline-block',
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '2px',
      left: '2px',
      right: '2px',
      bottom: '2px',
      background: '#fff',
      clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    },
  },
  image: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '90%',
    objectFit: 'cover',
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  },
}));

function HexagonAvatar({ src, alt }) {
  const classes = useStyles();

  return (
    <div className={classes.hexagon}>
      <img src={src} alt={alt} className={classes.image} />
    </div>
  );
}

export default HexagonAvatar;