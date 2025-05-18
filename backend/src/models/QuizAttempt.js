const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.Mixed, // Can be string, array, or object depending on question type
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  }
});

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  answers: [answerSchema],
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  passed: {
    type: Boolean
  },
  feedback: {
    type: String
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
    ip: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
quizAttemptSchema.index({ user: 1, quiz: 1 });
quizAttemptSchema.index({ startTime: -1 });
quizAttemptSchema.index({ completed: 1 });

// Method to calculate score
quizAttemptSchema.methods.calculateScore = function() {
  if (!this.answers.length) return 0;

  const totalPoints = this.answers.reduce((acc, curr) => acc + curr.points, 0);
  const earnedPoints = this.answers
    .filter(answer => answer.isCorrect)
    .reduce((acc, curr) => acc + curr.points, 0);

  this.score = (earnedPoints / totalPoints) * 100;
  this.passed = this.score >= this.quiz.passingScore;
  return this.score;
};

// Method to check if attempt is expired
quizAttemptSchema.methods.isExpired = function() {
  if (!this.quiz.timeLimit) return false;
  const timeLimitMs = this.quiz.timeLimit * 60 * 1000;
  return Date.now() - this.startTime > timeLimitMs;
};

// Method to get attempt summary
quizAttemptSchema.methods.getSummary = function() {
  return {
    quizId: this.quiz,
    courseId: this.course,
    score: this.score,
    passed: this.passed,
    timeSpent: this.timeSpent,
    completed: this.completed,
    startTime: this.startTime,
    endTime: this.endTime,
    totalQuestions: this.answers.length,
    correctAnswers: this.answers.filter(a => a.isCorrect).length
  };
};

// Pre-save middleware to update time spent
quizAttemptSchema.pre('save', function(next) {
  if (this.endTime) {
    this.timeSpent = Math.floor((this.endTime - this.startTime) / 1000);
  }
  next();
});

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = QuizAttempt; 