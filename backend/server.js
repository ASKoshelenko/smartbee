const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Importing routes
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courseRoutes'); // Changed to courseRoutes
const quizRoutes = require('./routes/quizRoutes');
const userProgressRoutes = require('./routes/userProgressRoutes');

// Using routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/user-progress', userProgressRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the SmartBee API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});