import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateCourse from '../components/CreateCourse';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { CourseProvider } from '../contexts/CourseContext';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('CreateCourse Component', () => {
  beforeEach(() => {
    render(
      <NotificationProvider>
        <AuthProvider>
          <CourseProvider>
            <CreateCourse />
          </CourseProvider>
        </AuthProvider>
      </NotificationProvider>
    );
  });

  test('renders create course form', () => {
    expect(screen.getByText('Create New Course')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /content/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Course' })).toBeInTheDocument();
  });

  test('submits form with course data', async () => {
    axios.post.mockResolvedValue({ data: { id: '1', title: 'Test Course' } });

    fireEvent.change(screen.getByRole('textbox', { name: /title/i }), { target: { value: 'Test Course' } });
    fireEvent.change(screen.getByRole('textbox', { name: /description/i }), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByRole('textbox', { name: /content/i }), { target: { value: 'Test Content' } });

    fireEvent.click(screen.getByRole('button', { name: 'Create Course' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5001/api/courses', {
        title: 'Test Course',
        description: 'Test Description',
        content: 'Test Content',
      }, expect.any(Object));
    });
  });

  test('displays error message on failed submission', async () => {
    axios.post.mockRejectedValue(new Error('Failed to create course'));

    fireEvent.change(screen.getByRole('textbox', { name: /title/i }), { target: { value: 'Test Course' } });
    fireEvent.change(screen.getByRole('textbox', { name: /description/i }), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByRole('textbox', { name: /content/i }), { target: { value: 'Test Content' } });

    fireEvent.click(screen.getByRole('button', { name: 'Create Course' }));

    await waitFor(() => {
      expect(screen.getByText('An error occurred while creating the course')).toBeInTheDocument();
    });
  });
});