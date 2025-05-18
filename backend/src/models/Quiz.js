const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['single', 'multiple', 'text', 'matching']
  },
  text: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean,
    explanation: String
  }],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be string, array, or object depending on question type
    required: function() {
      return this.type !== 'text'; // Text questions don't have predefined answers
    }
  },
  points: {
    type: Number,
    required: true,
    default: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  explanation: {
    type: String,
    required: true
  },
  image: {
    url: String,
    alt: String
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['ukrainian', 'math', 'history', 'english', 'physics', 'chemistry', 'biology']
  },
  grade: {
    type: Number,
    required: true,
    min: 9,
    max: 11
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number, // in minutes
    required: true
  },
  passingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  shuffleQuestions: {
    type: Boolean,
    default: true
  },
  showResults: {
    type: Boolean,
    default: true
  },
  showExplanations: {
    type: Boolean,
    default: true
  },
  attempts: {
    type: Number,
    default: 1,
    min: 1
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  statistics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
quizSchema.index({ subject: 1, grade: 1 });
quizSchema.index({ tags: 1 });
quizSchema.index({ status: 1 });

// Method to calculate quiz statistics
quizSchema.methods.calculateStatistics = async function() {
  const QuizAttempt = mongoose.model('QuizAttempt');
  const attempts = await QuizAttempt.find({ quiz: this._id });

  if (attempts.length === 0) return;

  this.statistics = {
    totalAttempts: attempts.length,
    averageScore: attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length,
    completionRate: (attempts.filter(a => a.completed).length / attempts.length) * 100,
    averageTime: attempts.reduce((acc, curr) => acc + curr.timeSpent, 0) / attempts.length
  };

  await this.save();
};

// Method to get random questions
quizSchema.methods.getRandomQuestions = function(count) {
  const questions = [...this.questions];
  if (this.shuffleQuestions) {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  }
  return questions.slice(0, count || questions.length);
};

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz; 