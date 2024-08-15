const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Get user progress for all courses
router.get('/', auth(), async (req, res) => {
  try {
    const userProgress = await UserProgress.find({ user: req.user._id }).populate('course', 'title');
    res.json(userProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user progress for a specific course
router.get('/:courseId', auth(), async (req, res) => {
  try {
    const userProgress = await UserProgress.findOne({ user: req.user._id, course: req.params.courseId });
    if (!userProgress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    res.json(userProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update lesson progress
router.post('/:courseId/lesson/:lessonId', auth(), async (req, res) => {
  try {
    const { completed, timeSpent } = req.body;
    let userProgress = await UserProgress.findOne({ user: req.user._id, course: req.params.courseId });

    if (!userProgress) {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      userProgress = new UserProgress({
        user: req.user._id,
        course: req.params.courseId,
        lessonProgress: course.sections.flatMap(section => 
          section.lessons.map(lesson => ({
            lesson: lesson._id,
            completed: false,
            timeSpent: 0
          }))
        )
      });
    }

    const lessonProgress = userProgress.lessonProgress.find(lp => lp.lesson.toString() === req.params.lessonId);
    if (!lessonProgress) {
      return res.status(404).json({ message: 'Lesson not found in progress' });
    }

    lessonProgress.completed = completed;
    lessonProgress.timeSpent += timeSpent;

    userProgress.calculateOverallProgress();
    userProgress.lastAccessed = Date.now();

    await userProgress.save();
    res.json(userProgress);
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;