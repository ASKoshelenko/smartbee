const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

// Get all courses (with filtering and pagination)
router.get('/', async (req, res) => {
  try {
    const {
      subject,
      grade,
      level,
      status = 'published',
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const query = { status };
    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (level) query.level = level;

    const courses = await Course.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'firstName lastName')
      .select('-lessons.content -ratings');

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching courses'
    });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('author', 'firstName lastName')
      .populate('prerequisites', 'title description');

    if (!course) {
      return res.status(404).json({
        error: 'Course not found'
      });
    }

    // If user is not the author, don't send full lesson content
    if (req.user?.userId !== course.author._id.toString()) {
      course.lessons = course.lessons.map(lesson => ({
        ...lesson.toObject(),
        content: undefined
      }));
    }

    res.json({ course });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching course'
    });
  }
});

// Create new course
router.post('/', authenticate, authorize('teacher', 'admin'), validateRequest, async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      author: req.user.userId
    });

    await course.save();
    res.status(201).json({ course });
  } catch (error) {
    res.status(500).json({
      error: 'Error creating course'
    });
  }
});

// Update course
router.patch('/:id', authenticate, authorize('teacher', 'admin'), validateRequest, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        error: 'Course not found'
      });
    }

    // Check if user is the author or admin
    if (course.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to update this course'
      });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'title',
      'description',
      'subject',
      'grade',
      'level',
      'duration',
      'lessons',
      'quizzes',
      'prerequisites',
      'tags',
      'status',
      'coverImage'
    ];

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({
        error: 'Invalid updates'
      });
    }

    updates.forEach(update => course[update] = req.body[update]);
    await course.save();

    res.json({ course });
  } catch (error) {
    res.status(500).json({
      error: 'Error updating course'
    });
  }
});

// Delete course
router.delete('/:id', authenticate, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        error: 'Course not found'
      });
    }

    // Check if user is the author or admin
    if (course.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to delete this course'
      });
    }

    // Instead of deleting, mark as archived
    course.status = 'archived';
    await course.save();

    res.json({
      message: 'Course archived successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error archiving course'
    });
  }
});

// Enroll in course
router.post('/:id/enroll', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        error: 'Course not found'
      });
    }

    if (course.status !== 'published') {
      return res.status(400).json({
        error: 'Course is not available for enrollment'
      });
    }

    const user = await User.findById(req.user.userId);
    const isEnrolled = user.enrolledCourses.some(
      e => e.course.toString() === course._id.toString()
    );

    if (isEnrolled) {
      return res.status(400).json({
        error: 'Already enrolled in this course'
      });
    }

    user.enrolledCourses.push({
      course: course._id,
      progress: 0
    });

    course.enrollmentCount += 1;
    await Promise.all([user.save(), course.save()]);

    res.json({
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error enrolling in course'
    });
  }
});

// Update course progress
router.patch('/:id/progress', authenticate, async (req, res) => {
  try {
    const { lessonId, completed } = req.body;
    const user = await User.findById(req.user.userId);
    
    const enrollment = user.enrolledCourses.find(
      e => e.course.toString() === req.params.id
    );

    if (!enrollment) {
      return res.status(404).json({
        error: 'Not enrolled in this course'
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        error: 'Course not found'
      });
    }

    // Update completed lessons
    if (!enrollment.completedLessons) {
      enrollment.completedLessons = [];
    }

    if (completed) {
      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }
    } else {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        id => id.toString() !== lessonId
      );
    }

    // Calculate progress
    const totalLessons = course.lessons.length;
    enrollment.progress = (enrollment.completedLessons.length / totalLessons) * 100;

    await user.save();

    res.json({
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error updating course progress'
    });
  }
});

// Rate course
router.post('/:id/rate', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        error: 'Course not found'
      });
    }

    // Check if user is enrolled
    const user = await User.findById(req.user.userId);
    const isEnrolled = user.enrolledCourses.some(
      e => e.course.toString() === course._id.toString()
    );

    if (!isEnrolled) {
      return res.status(400).json({
        error: 'Must be enrolled to rate the course'
      });
    }

    // Check if user has already rated
    const existingRating = course.ratings.find(
      r => r.user.toString() === req.user.userId
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
      existingRating.createdAt = new Date();
    } else {
      course.ratings.push({
        user: req.user.userId,
        rating,
        comment
      });
    }

    // Update average rating
    course.calculateAverageRating();
    await course.save();

    res.json({
      message: 'Rating submitted successfully',
      averageRating: course.averageRating
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error submitting rating'
    });
  }
});

module.exports = router; 