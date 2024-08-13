import React, { useState } from 'react';
import { Typography, RadioGroup, FormControlLabel, Radio, Button, Paper } from '@material-ui/core';

const sampleQuiz = {
  questions: [
    {
      id: 1,
      text: "What is React?",
      options: [
        { id: 'a', text: "A JavaScript library for building user interfaces" },
        { id: 'b', text: "A programming language" },
        { id: 'c', text: "A database management system" },
        { id: 'd', text: "An operating system" }
      ],
      correctAnswer: 'a'
    },
    {
      id: 2,
      text: "Which of the following is used to pass data to a component from outside?",
      options: [
        { id: 'a', text: "setState" },
        { id: 'b', text: "render with arguments" },
        { id: 'c', text: "props" },
        { id: 'd', text: "PropTypes" }
      ],
      correctAnswer: 'c'
    }
  ]
};

function Quiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (event) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: event.target.value
    });
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      const score = calculateScore();
      onComplete(score);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    sampleQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return (correctAnswers / sampleQuiz.questions.length) * 100;
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

  const question = sampleQuiz.questions[currentQuestion];

  return (
    <Paper style={{ padding: '2rem', marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>Quiz</Typography>
      <Typography variant="h6" gutterBottom>
        Question {currentQuestion + 1} of {sampleQuiz.questions.length}
      </Typography>
      <Typography variant="body1" gutterBottom>{question.text}</Typography>
      <RadioGroup value={selectedAnswers[currentQuestion] || ''} onChange={handleAnswerChange}>
        {question.options.map((option) => (
          <FormControlLabel key={option.id} value={option.id} control={<Radio />} label={option.text} />
        ))}
      </RadioGroup>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleNext} 
        style={{ marginTop: '1rem' }}
        disabled={!selectedAnswers[currentQuestion]}
      >
        {currentQuestion === sampleQuiz.questions.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </Paper>
  );
}

export default Quiz;