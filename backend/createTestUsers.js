const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('./models/User');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in the .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const testUsers = [
      { name: 'Test Student', email: 'student@example.com', password: 'password123', role: 'student' },
      { name: 'Test Tutor', email: 'tutor@example.com', password: 'password123', role: 'tutor' },
      { name: 'Test Admin', email: 'admin@example.com', password: 'password123', role: 'admin' }
    ];

    for (const user of testUsers) {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = new User({
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role
        });
        await newUser.save();
        console.log(`Created ${user.role} user: ${user.email}`);
      } else {
        console.log(`User ${user.email} already exists`);
      }
    }

    console.log('Test users creation completed');
    await mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });