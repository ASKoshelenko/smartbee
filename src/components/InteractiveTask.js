import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Button, 
  Radio, RadioGroup, FormControlLabel, FormControl 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  question: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

const InteractiveTask = ({ task, onComplete }) => {
  const classes = useStyles();
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = () => {
    const correct = selectedAnswer === task.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      onComplete(task.points);
    }
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6" className={classes.question}>
          {task.question}
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup 
            value={selectedAnswer} 
            onChange={(e) => setSelectedAnswer(e.target.value)}
          >
            {task.options.map((option, index) => (
              <FormControlLabel 
                key={index} 
                value={option} 
                control={<Radio />} 
                label={option} 
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Button 
          className={classes.submitButton}
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={!selectedAnswer}
        >
          Submit Answer
        </Button>
        {isCorrect !== null && (
          <Typography color={isCorrect ? "primary" : "error"}>
            {isCorrect ? "Correct!" : "Incorrect. Try again!"}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveTask;