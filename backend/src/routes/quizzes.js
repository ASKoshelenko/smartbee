const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const { authenticate, authorize } = require('../middleware/auth');
const { validateQuiz } = require('../middleware/validation');

// Get all quizzes (with filtering and pagination)
router.get('/', async (req, res) => {
  try {
    const {
      subject,
      grade,
      status = 'published',
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const query = { status };
    if (subject) query.subject = subject;
    if (grade) query.grade = grade;

    const quizzes = await Quiz.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'firstName lastName')
      .select('-questions.options.isCorrect -questions.correctAnswer');

    const total = await Quiz.countDocuments(query);

    res.json({
      quizzes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching quizzes'
    });
  }
});

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('author', 'firstName lastName');

    if (!quiz) {
      return res.status(404).json({
        error: 'Quiz not found'
      });
    }

    // If user is not the author, don't send correct answers
    if (req.user?.userId !== quiz.author._id.toString()) {
      quiz.questions = quiz.questions.map(question => ({
        ...question.toObject(),
        correctAnswer: undefined,
        options: question.options.map(option => ({
          ...option.toObject(),
          isCorrect: undefined
        }))
      }));
    }

    res.json({ quiz });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching quiz'
    });
  }
});

// Create new quiz
router.post('/', authenticate, authorize('teacher', 'admin'), validateQuiz, async (req, res) => {
  try {
    const quiz = new Quiz({
      ...req.body,
      author: req.user.userId
    });

    await quiz.save();
    res.status(201).json({ quiz });
  } catch (error) {
    res.status(500).json({
      error: 'Error creating quiz'
    });
  }
});

// Update quiz
router.patch('/:id', authenticate, authorize('teacher', 'admin'), validateQuiz, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        error: 'Quiz not found'
      });
    }

    // Check if user is the author or admin
    if (quiz.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to update this quiz'
      });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'title',
      'description',
      'subject',
      'grade',
      'questions',
      'timeLimit',
      'passingScore',
      'shuffleQuestions',
      'showResults',
      'showExplanations',
      'attempts',
      'status',
      'tags'
    ];

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({
        error: 'Invalid updates'
      });
    }

    updates.forEach(update => quiz[update] = req.body[update]);
    await quiz.save();

    res.json({ quiz });
  } catch (error) {
    res.status(500).json({
      error: 'Error updating quiz'
    });
  }
});

// Delete quiz
router.delete('/:id', authenticate, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        error: 'Quiz not found'
      });
    }

    // Check if user is the author or admin
    if (quiz.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to delete this quiz'
      });
    }

    // Instead of deleting, mark as archived
    quiz.status = 'archived';
    await quiz.save();

    res.json({
      message: 'Quiz archived successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error archiving quiz'
    });
  }
});

// Start quiz attempt
router.post('/:id/attempt', authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        error: 'Quiz not found'
      });
    }

    if (quiz.status !== 'published') {
      return res.status(400).json({
        error: 'Quiz is not available'
      });
    }

    // Check if user has reached attempt limit
    const attempts = await QuizAttempt.countDocuments({
      user: req.user.userId,
      quiz: quiz._id
    });

    if (attempts >= quiz.attempts) {
      return res.status(400).json({
        error: 'Maximum attempts reached'
      });
    }

    // Create new attempt
    const attempt = new QuizAttempt({
      user: req.user.userId,
      quiz: quiz._id,
      startTime: new Date(),
      deviceInfo: {
        browser: req.headers['user-agent'],
        ip: req.ip
      }
    });

    await attempt.save();

    // Get questions without correct answers
    const questions = quiz.getRandomQuestions().map(question => ({
      ...question.toObject(),
      correctAnswer: undefined,
      options: question.options.map(option => ({
        ...option.toObject(),
        isCorrect: undefined
      }))
    }));

    res.json({
      attemptId: attempt._id,
      quiz: {
        ...quiz.toObject(),
        questions
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error starting quiz attempt'
    });
  }
});

// Submit quiz attempt
router.post('/:id/attempt/:attemptId/submit', authenticate, async (req, res) => {
  try {
    const { answers } = req.body;
    const attempt = await QuizAttempt.findById(req.params.attemptId);
    
    if (!attempt) {
      return res.status(404).json({
        error: 'Attempt not found'
      });
    }

    if (attempt.user.toString() !== req.user.userId) {
      return res.status(403).json({
        error: 'Not authorized to submit this attempt'
      });
    }

    if (attempt.completed) {
      return res.status(400).json({
        error: 'Attempt already completed'
      });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        error: 'Quiz not found'
      });
    }

    // Check if time limit exceeded
    if (attempt.isExpired()) {
      attempt.completed = true;
      attempt.endTime = new Date();
      await attempt.save();
      return res.status(400).json({
        error: 'Time limit exceeded'
      });
    }

    // Process answers
    const processedAnswers = answers.map(answer => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      if (!question) return null;

      let isCorrect = false;
      if (question.type === 'text') {
        // For text questions, store answer for manual review
        isCorrect = null;
      } else if (question.type === 'single') {
        isCorrect = answer.answer === question.correctAnswer;
      } else if (question.type === 'multiple') {
        isCorrect = JSON.stringify(answer.answer.sort()) === JSON.stringify(question.correctAnswer.sort());
      } else if (question.type === 'matching') {
        isCorrect = JSON.stringify(answer.answer) === JSON.stringify(question.correctAnswer);
      }

      return {
        question: question._id,
        answer: answer.answer,
        isCorrect,
        points: isCorrect ? question.points : 0,
        timeSpent: answer.timeSpent
      };
    }).filter(Boolean);

    // Update attempt
    attempt.answers = processedAnswers;
    attempt.endTime = new Date();
    attempt.completed = true;
    attempt.calculateScore();

    await attempt.save();

    // Update quiz statistics
    await quiz.calculateStatistics();

    // Prepare response
    const response = {
      score: attempt.score,
      passed: attempt.passed,
      timeSpent: attempt.timeSpent,
      answers: attempt.answers.map(answer => {
        const question = quiz.questions.find(q => q._id.toString() === answer.question.toString());
        return {
          question: {
            text: question.text,
            type: question.type,
            explanation: question.explanation
          },
          answer: answer.answer,
          isCorrect: answer.isCorrect,
          points: answer.points
        };
      })
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: 'Error submitting quiz attempt'
    });
  }
});

// Get attempt history
router.get('/:id/attempts', authenticate, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      user: req.user.userId,
      quiz: req.params.id
    })
    .sort('-startTime')
    .select('-answers.answer');

    res.json({ attempts });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching attempt history'
    });
  }
});

module.exports = router; 