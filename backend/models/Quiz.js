const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer'],
    required: true
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String,
    required: true
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course.sections.lessons',
    required: true
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number,
    default: 0
  },
  passingScore: {
    type: Number,
    required: true
  }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;