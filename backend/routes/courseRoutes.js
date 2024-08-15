const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const UserProgress = require('../models/UserProgress');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Get all courses with search and filters
router.get('/', async (req, res) => {
  try {
    const { search, category, level, minPrice, maxPrice, sortBy } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    let sort = {};
    if (sortBy === 'price_asc') sort.price = 1;
    if (sortBy === 'price_desc') sort.price = -1;
    if (sortBy === 'rating') sort.averageRating = -1;

    const courses = await Course.find(query)
      .sort(sort)
      .populate('tutor', 'name');

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available courses (not enrolled by the user)
router.get('/available', auth(), async (req, res) => {
  try {
    const enrolledCourses = await UserProgress.find({ user: req.user._id }).distinct('course');
    const availableCourses = await Course.find({ _id: { $nin: enrolledCourses } }).populate('tutor', 'name');
    res.json(availableCourses);
  } catch (error) {
    console.error('Error fetching available courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get courses for a specific tutor
router.get('/tutor', auth('tutor'), async (req, res) => {
  try {
    const courses = await Course.find({ tutor: req.user._id });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching tutor courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('tutor', 'name');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new course
router.post('/', auth('tutor'), async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      tutor: req.user._id
    });
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a course
router.put('/:id', auth('tutor'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this course' });
    }
    
    Object.assign(course, req.body);
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a course
router.delete('/:id', auth('tutor'), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const course = await Course.findById(req.params.id).session(session);
    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'You are not authorized to delete this course' });
    }
    
    // Delete related user progress
    await UserProgress.deleteMany({ course: course._id }).session(session);
    
    // Delete the course
    await course.remove({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in a course
router.post('/:id/enroll', auth(), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user is already enrolled
    const existingProgress = await UserProgress.findOne({
      user: req.user._id,
      course: course._id
    });

    if (existingProgress) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Create new progress entry
    const newProgress = new UserProgress({
      user: req.user._id,
      course: course._id,
      progress: {
        completed: false,
        completion: 0
      }
    });

    await newProgress.save();

    // Update the course's enrolledStudents count
    await Course.findByIdAndUpdate(course._id, { $inc: { enrolledStudents: 1 } });

    res.status(201).json({ message: 'Successfully enrolled in the course' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('reviews.user', 'name');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course.reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;