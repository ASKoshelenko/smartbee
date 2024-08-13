// models/Course.js
const mongoose = require('mongoose');

// Определяем схему курса
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  quizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Создаем модель курса на основе схемы
const Course = mongoose.model('Course', courseSchema);

// Экспортируем модель для использования в других частях приложения
module.exports = Course;
