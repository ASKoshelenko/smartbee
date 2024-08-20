import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography } from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function CreateCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/courses', 
        { title, description, content },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      showNotification('Course created successfully', 'success');
      history.push('/tutor/courses');
    } catch (error) {
      console.error('Error:', error);
      showNotification('An error occurred while creating the course', 'error');
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
            id="title"
            label="Title"
            name="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="content"
            label="Content"
            name="content"
            multiline
            rows={4}
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