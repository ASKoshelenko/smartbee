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
    default: 0,  // Изменено: теперь по умолчанию 0
    min: 0
  },
  category: {
    type: String,
    default: 'Uncategorized',  // Изменено: теперь есть значение по умолчанию
    trim: true
  },
  tags: [String],
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Метод для расчета среднего рейтинга
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

// Метод для добавления нового отзыва
courseSchema.methods.addReview = function(userId, rating, comment) {
  this.reviews.push({ user: userId, rating, comment });
  this.calculateAverageRating();
};

// Метод для удаления отзыва
courseSchema.methods.removeReview = function(reviewId) {
  this.reviews = this.reviews.filter(review => review._id.toString() !== reviewId.toString());
  this.calculateAverageRating();
};

// Метод для увеличения количества зачисленных студентов
courseSchema.methods.incrementEnrolledStudents = function() {
  this.enrolledStudents += 1;
};

// Middleware для обновления updatedAt при изменении курса
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Виртуальное свойство для получения количества уроков
courseSchema.virtual('totalLessons').get(function() {
  return this.sections.reduce((total, section) => total + section.lessons.length, 0);
});

// Индексы для оптимизации запросов
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, averageRating: -1 });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;