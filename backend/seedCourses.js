const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const sampleCourses = [
  {
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    sections: [
      {
        title: "HTML Fundamentals",
        order: 1,
        lessons: [
          {
            title: "What is HTML?",
            content: "HTML stands for HyperText Markup Language. It's the standard markup language for creating web pages.",
            videoUrl: "https://example.com/intro-to-html.mp4",
            order: 1
          },
          {
            title: "Basic HTML Tags",
            content: "Learn about essential HTML tags like <head>, <body>, <p>, and <div>.",
            imageUrls: ["https://example.com/html-tags-infographic.jpg"],
            order: 2
          }
        ]
      },
      {
        title: "CSS Basics",
        order: 2,
        lessons: [
          {
            title: "Introduction to CSS",
            content: "CSS (Cascading Style Sheets) is used to style and layout web pages.",
            videoUrl: "https://example.com/intro-to-css.mp4",
            order: 1
          },
          {
            title: "CSS Selectors",
            content: "Learn how to select HTML elements to apply styles using CSS selectors.",
            imageUrls: ["https://example.com/css-selectors-cheatsheet.png"],
            order: 2
          }
        ]
      }
    ]
  },
  {
    title: "Python for Beginners",
    description: "Start your journey into programming with Python",
    sections: [
      {
        title: "Getting Started with Python",
        order: 1,
        lessons: [
          {
            title: "What is Python?",
            content: "Python is a high-level, interpreted programming language known for its simplicity and readability.",
            videoUrl: "https://example.com/intro-to-python.mp4",
            order: 1
          },
          {
            title: "Setting Up Python Environment",
            content: "Learn how to install Python and set up your development environment.",
            imageUrls: ["https://example.com/python-setup-guide.jpg"],
            order: 2
          }
        ]
      },
      {
        title: "Python Basics",
        order: 2,
        lessons: [
          {
            title: "Variables and Data Types",
            content: "Understand how to declare variables and work with different data types in Python.",
            videoUrl: "https://example.com/python-variables.mp4",
            order: 1
          },
          {
            title: "Control Structures",
            content: "Learn about if statements, loops, and other control structures in Python.",
            imageUrls: ["https://example.com/python-control-structures.png"],
            order: 2
          }
        ]
      }
    ]
  },
  {
    title: "Digital Art for Beginners",
    description: "Discover the world of digital art and illustration",
    sections: [
      {
        title: "Introduction to Digital Art",
        order: 1,
        lessons: [
          {
            title: "What is Digital Art?",
            content: "Digital art is any artistic work or practice that uses digital technologies as an essential part of the creative or presentation process.",
            videoUrl: "https://example.com/intro-to-digital-art.mp4",
            order: 1
          },
          {
            title: "Choosing Your Digital Art Software",
            content: "Learn about different digital art software options and how to choose the right one for you.",
            imageUrls: ["https://example.com/digital-art-software-comparison.jpg"],
            order: 2
          }
        ]
      },
      {
        title: "Basic Digital Drawing Techniques",
        order: 2,
        lessons: [
          {
            title: "Understanding Layers",
            content: "Learn how to use layers in digital art to create complex compositions.",
            videoUrl: "https://example.com/digital-art-layers.mp4",
            order: 1
          },
          {
            title: "Digital Coloring Basics",
            content: "Discover techniques for coloring your digital artwork.",
            imageUrls: ["https://example.com/digital-coloring-guide.png"],
            order: 2
          }
        ]
      }
    ]
  }
];

async function seedCourses() {
  try {
    // Create a dummy tutor
    const dummyTutor = await User.findOneAndUpdate(
      { email: 'dummytutor@example.com' },
      { 
        name: 'Dummy Tutor',
        email: 'dummytutor@example.com',
        password: 'dummypassword',
        role: 'tutor'
      },
      { upsert: true, new: true }
    );

    await Course.deleteMany({}); // Clear existing courses
    
    const coursesWithTutor = sampleCourses.map(course => ({
      ...course,
      tutor: dummyTutor._id
    }));

    const createdCourses = await Course.create(coursesWithTutor);
    console.log(`${createdCourses.length} courses have been created.`);
  } catch (error) {
    console.error('Error seeding courses:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedCourses();