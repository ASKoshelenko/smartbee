const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course.sections.lessons',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number,
    default: 0
  }
});

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
  lessonProgress: [lessonProgressSchema],
  overallProgress: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

userProgressSchema.methods.calculateOverallProgress = function() {
  const totalLessons = this.lessonProgress.length;
  const completedLessons = this.lessonProgress.filter(lp => lp.completed).length;
  this.overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
};

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;