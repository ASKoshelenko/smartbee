const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const auth = require('../middleware/auth');

// Get user progress
router.get('/', auth(), async (req, res) => {
  try {
    const userProgress = await UserProgress.find({ user: req.user._id });
    const progressMap = {};
    userProgress.forEach(progress => {
      progressMap[progress.course] = progress.progress;
    });
    res.json(progressMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user progress
router.post('/', auth(), async (req, res) => {
  const { courseId, progress } = req.body;

  try {
    let userProgress = await UserProgress.findOne({ user: req.user._id, course: courseId });
    
    if (userProgress) {
      userProgress.progress = progress;
      await userProgress.save();
    } else {
      userProgress = new UserProgress({
        user: req.user._id,
        course: courseId,
        progress: progress
      });
      await userProgress.save();
    }

    res.json(userProgress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;