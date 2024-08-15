const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Importing routes
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userProgressRoutes = require('./routes/userProgressRoutes');
const userStatsRoutes = require('./routes/userStatsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Using routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/user-progress', userProgressRoutes);
app.use('/api/user-stats', userStatsRoutes);
app.use('/api/notifications', notificationRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the SmartBee API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing HTTP server.');
  app.close(() => {
    console.log('HTTP server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});