const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  progress: {
    completed: Boolean,
    quizScore: Number,
    completion: Number,
    lastLesson: {
      sectionIndex: Number,
      lessonIndex: Number
    }
  }
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;