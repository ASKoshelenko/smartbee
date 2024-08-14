import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Button, TextField,
  Radio, RadioGroup, FormControlLabel, FormControl, Checkbox
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

const ComplexTask = ({ task, onComplete }) => {
  const classes = useStyles();
  const [answers, setAnswers] = useState({});
  const [isCorrect, setIsCorrect] = useState(null);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    const correct = task.questions.every(question => {
      if (question.type === 'multipleChoice') {
        return answers[question.id] === question.correctAnswer;
      } else if (question.type === 'multipleAnswer') {
        const userAnswers = answers[question.id] || [];
        return JSON.stringify(userAnswers.sort()) === JSON.stringify(question.correctAnswers.sort());
      } else if (question.type === 'shortAnswer') {
        return answers[question.id].toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      }
      return false;
    });

    setIsCorrect(correct);
    if (correct) {
      onComplete(task.points);
    }
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6" className={classes.question}>
          {task.title}
        </Typography>
        {task.questions.map(question => (
          <div key={question.id}>
            <Typography variant="body1">{question.text}</Typography>
            {question.type === 'multipleChoice' && (
              <FormControl component="fieldset">
                <RadioGroup 
                  value={answers[question.id] || ''} 
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                >
                  {question.options.map((option, index) => (
                    <FormControlLabel 
                      key={index} 
                      value={option} 
                      control={<Radio />} 
                      label={option} 
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
            {question.type === 'multipleAnswer' && (
              <FormControl component="fieldset">
                {question.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={(answers[question.id] || []).includes(option)}
                        onChange={(e) => {
                          const currentAnswers = answers[question.id] || [];
                          const newAnswers = e.target.checked
                            ? [...currentAnswers, option]
                            : currentAnswers.filter(a => a !== option);
                          handleAnswerChange(question.id, newAnswers);
                        }}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormControl>
            )}
            {question.type === 'shortAnswer' && (
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              />
            )}
          </div>
        ))}
        <Button 
          className={classes.submitButton}
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== task.questions.length}
        >
          Submit Answers
        </Button>
        {isCorrect !== null && (
          <Typography color={isCorrect ? "primary" : "error"}>
            {isCorrect ? "Correct! Well done!" : "Incorrect. Try again!"}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplexTask;