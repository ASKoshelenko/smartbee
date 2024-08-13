// backend/models/Quiz.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['multiple-choice', 'multiple-answer', 'true-false', 'short-answer'],
    required: true 
  },
  options: [{ 
    id: String, 
    text: String 
  }],
  correctAnswer: String,
  correctAnswers: [String]
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [questionSchema],
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;