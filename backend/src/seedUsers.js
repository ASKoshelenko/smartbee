const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const users = [
  {
    email: 'admin@sb.com',
    password: '123456',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    grade: 11
  },
  {
    email: 'tutor@sb.com',
    password: '123456',
    firstName: 'Tutor',
    lastName: 'User',
    role: 'teacher',
    grade: 11
  },
  {
    email: 'student@sb.com',
    password: '123456',
    firstName: 'Student',
    lastName: 'User',
    role: 'student',
    grade: 11
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  for (const userData of users) {
    const exists = await User.findOne({ email: userData.email });
    if (!exists) {
      const user = new User(userData);
      await user.save();
      console.log(`Created: ${user.email} (${user.role})`);
    } else {
      console.log(`Exists: ${userData.email}`);
    }
  }

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}); 