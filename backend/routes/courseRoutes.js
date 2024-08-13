const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Get all courses (public route)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().select('-tutor'); // Exclude tutor field for privacy
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// Get courses for a specific tutor
router.get('/tutor', auth('tutor'), async (req, res) => {
  try {
    const courses = await Course.find({ tutor: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tutor courses', error: error.message });
  }
});

// Get a specific course (public route)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select('-tutor');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
});

// Create a new course
router.post('/', auth('tutor'), async (req, res) => {
  const course = new Course({
    ...req.body,
    tutor: req.user._id
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error creating course', error: error.message });
  }
});

// Update a course
router.put('/:id', auth('tutor'), async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, tutor: req.user._id });
    if (!course) {
      return res.status(404).json({ message: 'Course not found or you are not authorized to update it' });
    }
    
    Object.assign(course, req.body);
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error updating course', error: error.message });
  }
});

// Delete a course
router.delete('/:id', auth('tutor'), async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, tutor: req.user._id });
    if (!course) {
      return res.status(404).json({ message: 'Course not found or you are not authorized to delete it' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

module.exports = router;