// routes/courses.js

const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Создание нового курса
router.post('/', async (req, res) => {
  const { title, description, content } = req.body;

  // Проверка ввода (убедитесь, что поля не пустые)
  if (!title || !description || !content) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  const course = new Course({
    title,
    description,
    content,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    console.error('Ошибка сохранения курса:', err); // Подробное логирование ошибки
    res.status(500).json({ message: 'Внутренняя ошибка сервера', error: err.message });
  }
});

// Получение всех курсов
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error('Ошибка получения курсов:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение курса по ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }
    res.json(course);
  } catch (err) {
    console.error('Ошибка получения курса:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновление курса
router.put('/:id', async (req, res) => {
  const { title, description, content } = req.body;

  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, content },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }
    res.json(course);
  } catch (err) {
    console.error('Ошибка обновления курса:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление курса
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }
    res.json({ message: 'Курс удален' });
  } catch (err) {
    console.error('Ошибка удаления курса:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
