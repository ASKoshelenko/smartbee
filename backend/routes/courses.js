// routes/courses.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const checkRole = require('../middleware/checkRole');

// Admin or Tutor can create courses
router.post('/', checkRole('admin'), async (req, res) => {
  const { title, description, content } = req.body;
  // Course creation logic
});

// Admin can delete courses
router.delete('/:id', checkRole('admin'), async (req, res) => {
  const { id } = req.params;
  // Course deletion logic
});

module.exports = router;
