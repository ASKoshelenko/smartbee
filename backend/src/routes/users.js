const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

// Get user profile (admin only)
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses.course', 'title subject grade')
      .populate('completedQuizzes.quiz', 'title subject');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching user profile'
    });
  }
});

// Get all users (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const {
      role,
      grade,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const query = {};
    if (role) query.role = role;
    if (grade) query.grade = grade;

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching users'
    });
  }
});

// Update user role (admin only)
router.patch('/:id/role', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['student', 'teacher', 'admin'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error updating user role'
    });
  }
});

// Get user statistics
router.get('/:id/statistics', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('studyTime streakDays completedQuizzes enrolledCourses');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if user is requesting their own statistics or is admin
    if (req.user.userId !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to view these statistics'
      });
    }

    // Calculate additional statistics
    const totalQuizzes = user.completedQuizzes.length;
    const averageScore = user.completedQuizzes.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes || 0;
    const totalCourses = user.enrolledCourses.length;
    const averageProgress = user.enrolledCourses.reduce((acc, curr) => acc + curr.progress, 0) / totalCourses || 0;

    // Get recent activity
    const recentQuizzes = user.completedQuizzes
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 5);

    const recentCourses = user.enrolledCourses
      .sort((a, b) => b.enrolledAt - a.enrolledAt)
      .slice(0, 5);

    res.json({
      statistics: {
        studyTime: user.studyTime,
        streakDays: user.streakDays,
        totalQuizzes,
        averageScore,
        totalCourses,
        averageProgress,
        recentActivity: {
          quizzes: recentQuizzes,
          courses: recentCourses
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching user statistics'
    });
  }
});

// Update user settings
router.patch('/:id/settings', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if user is updating their own settings or is admin
    if (req.user.userId !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to update these settings'
      });
    }

    const { settings } = req.body;
    const allowedSettings = ['theme', 'notifications'];

    const updates = Object.keys(settings);
    const isValidOperation = updates.every(update => allowedSettings.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        error: 'Invalid settings'
      });
    }

    updates.forEach(update => {
      user.settings[update] = settings[update];
    });

    await user.save();

    res.json({
      message: 'Settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error updating user settings'
    });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Instead of deleting, mark as inactive
    user.status = 'inactive';
    await user.save();

    res.json({
      message: 'User deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deactivating user'
    });
  }
});

module.exports = router; 