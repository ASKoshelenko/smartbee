import React, { useState } from 'react';
import { 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Button, 
  Paper,
  TextField,
  Checkbox,
  FormGroup
} from '@material-ui/core';

const EnhancedQuiz = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleMultipleAnswerChange = (value) => {
    const currentAnswers = answers[currentQuestion] || [];
    const newAnswers = currentAnswers.includes(value)
      ? currentAnswers.filter(answer => answer !== value)
      : [...currentAnswers, value];
    setAnswers({ ...answers, [currentQuestion]: newAnswers });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      const score = calculateScore();
      onComplete(score);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (question.type === 'multiple-choice') {
        if (answers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      } else if (question.type === 'multiple-answer') {
        const userAnswers = answers[index] || [];
        if (JSON.stringify(userAnswers.sort()) === JSON.stringify(question.correctAnswers.sort())) {
          correctAnswers++;
        }
      } else if (question.type === 'true-false') {
        if (answers[index] === question.correctAnswer.toString()) {
          correctAnswers++;
        }
      } else if (question.type === 'short-answer') {
        if (answers[index].toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          correctAnswers++;
        }
      }
    });
    return (correctAnswers / questions.length) * 100;
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <Paper style={{ padding: '2rem', marginTop: '2rem' }}>
        <Typography variant="h4" gutterBottom>Quiz Results</Typography>
        <Typography variant="h5">
          You scored {score.toFixed(2)}%
        </Typography>
      </Paper>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Paper style={{ padding: '2rem', marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>Quiz</Typography>
      <Typography variant="h6" gutterBottom>
        Question {currentQuestion + 1} of {questions.length}
      </Typography>
      <Typography variant="body1" gutterBottom>{question.text}</Typography>
      
      {question.type === 'multiple-choice' && (
        <RadioGroup value={answers[currentQuestion] || ''} onChange={(e) => handleAnswerChange(e.target.value)}>
          {question.options.map((option) => (
            <FormControlLabel key={option.id} value={option.id} control={<Radio />} label={option.text} />
          ))}
        </RadioGroup>
      )}

      {question.type === 'multiple-answer' && (
        <FormGroup>
          {question.options.map((option) => (
            <FormControlLabel
              key={option.id}
              control={
                <Checkbox
                  checked={(answers[currentQuestion] || []).includes(option.id)}
                  onChange={() => handleMultipleAnswerChange(option.id)}
                />
              }
              label={option.text}
            />
          ))}
        </FormGroup>
      )}

      {question.type === 'true-false' && (
        <RadioGroup value={answers[currentQuestion] || ''} onChange={(e) => handleAnswerChange(e.target.value)}>
          <FormControlLabel value="true" control={<Radio />} label="True" />
          <FormControlLabel value="false" control={<Radio />} label="False" />
        </RadioGroup>
      )}

      {question.type === 'short-answer' && (
        <TextField
          fullWidth
          variant="outlined"
          value={answers[currentQuestion] || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
          margin="normal"
        />
      )}

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleNext} 
        style={{ marginTop: '1rem' }}
        disabled={!answers[currentQuestion]}
      >
        {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </Paper>
  );
};

export default EnhancedQuiz;