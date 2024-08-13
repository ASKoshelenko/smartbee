import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography } from '@material-ui/core';

function CreateCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, content }),
      });
      if (response.ok) {
        const course = await response.json();
        alert('Course created successfully');
        console.log(course);
        setTitle('');
        setDescription('');
        setContent('');
      } else {
        alert('Failed to create course');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the course');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ marginTop: '2rem', padding: '2rem' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create New Course
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
          >
            Create Course
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateCourse;
