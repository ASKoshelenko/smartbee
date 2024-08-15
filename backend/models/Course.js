const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  videoUrl: {
    type: String
  },
  imageUrls: [String]
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    required: true
  },
  lessons: [lessonSchema]
});

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sections: [sectionSchema],
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    default: 'Uncategorized',
    trim: true
  },
  tags: [String],
  imageUrl: String,
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  duration: {
    type: Number,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

courseSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
    this.averageRating = (sum / this.reviews.length).toFixed(1);
    this.totalRatings = this.reviews.length;
  }
};

courseSchema.methods.addReview = function(userId, rating, comment) {
  this.reviews.push({ user: userId, rating, comment });
  this.calculateAverageRating();
};

courseSchema.methods.removeReview = function(reviewId) {
  this.reviews = this.reviews.filter(review => review._id.toString() !== reviewId.toString());
  this.calculateAverageRating();
};

courseSchema.methods.incrementEnrolledStudents = function() {
  this.enrolledStudents += 1;
};

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

courseSchema.virtual('totalLessons').get(function() {
  return this.sections.reduce((total, section) => total + section.lessons.length, 0);
});

courseSchema.index({ category: 1, averageRating: -1 });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;