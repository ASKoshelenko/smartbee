const express = require('express');
const router = express.Router();
const UserStats = require('../models/UserStats');
const auth = require('../middleware/auth');

// Get user stats
router.get('/', auth(), async (req, res) => {
  try {
    let userStats = await UserStats.findOne({ user: req.user._id });
    if (!userStats) {
      userStats = new UserStats({ user: req.user._id });
      await userStats.save();
    }
    res.json(userStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update experience
router.post('/experience', auth(), async (req, res) => {
  try {
    const { amount } = req.body;
    let userStats = await UserStats.findOne({ user: req.user._id });
    if (!userStats) {
      userStats = new UserStats({ user: req.user._id });
    }
    userStats.experience += amount;
    userStats.level = Math.floor(userStats.experience / 100) + 1;
    await userStats.save();
    res.json(userStats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Award badge
router.post('/badge', auth(), async (req, res) => {
  try {
    const { badgeId } = req.body;
    let userStats = await UserStats.findOne({ user: req.user._id });
    if (!userStats) {
      userStats = new UserStats({ user: req.user._id });
    }
    if (!userStats.badges.includes(badgeId)) {
      userStats.badges.push(badgeId);
    }
    await userStats.save();
    res.json(userStats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;