const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
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
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  lessons: [{
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    duration: {
      type: Number, // in minutes
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    resources: [{
      type: {
        type: String,
        enum: ['video', 'document', 'link', 'quiz'],
        required: true
      },
      title: String,
      url: String,
      description: String
    }]
  }],
  quizzes: [{
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    order: Number,
    required: {
      type: Boolean,
      default: false
    }
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  coverImage: {
    url: String,
    alt: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
courseSchema.index({ subject: 1, grade: 1, level: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ status: 1 });

// Method to calculate average rating
courseSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  this.averageRating = sum / this.ratings.length;
  return this.averageRating;
};

// Method to get course progress for a user
courseSchema.methods.getUserProgress = async function(userId) {
  const user = await mongoose.model('User').findById(userId);
  if (!user) return null;

  const enrollment = user.enrolledCourses.find(
    e => e.course.toString() === this._id.toString()
  );

  if (!enrollment) return null;

  return {
    progress: enrollment.progress,
    enrolledAt: enrollment.enrolledAt,
    completedLessons: enrollment.completedLessons || [],
    completedQuizzes: enrollment.completedQuizzes || []
  };
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 