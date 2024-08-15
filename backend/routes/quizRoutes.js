const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

// Create a new quiz
router.post('/', auth('tutor'), async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all quizzes for a course
router.get('/course/:courseId', auth(), async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific quiz
router.get('/:id', auth(), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a quiz
router.put('/:id', auth('tutor'), async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a quiz
router.delete('/:id', auth('tutor'), async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz answers
router.post('/:id/submit', auth(), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { answers } = req.body;
    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score++;
      }
    });

    const percentage = (score / quiz.questions.length) * 100;
    const passed = percentage >= quiz.passingScore;

    // Here you would typically save the quiz result to the user's progress
    // This is a placeholder for that functionality
    // await UserProgress.updateQuizResult(req.user._id, quiz._id, score, passed);

    res.json({ score, percentage, passed });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;