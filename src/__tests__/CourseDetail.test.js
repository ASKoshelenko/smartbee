import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CourseDetail from '../pages/CourseDetail';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { CourseProvider } from '../contexts/CourseContext';
import { GameProvider } from '../contexts/GameContext';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: '1',
  }),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

// Мок для AuthContext
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => ({
    user: { id: '1', name: 'Test User' },
  }),
}));

// Мок для CourseContext
jest.mock('../contexts/CourseContext', () => ({
  ...jest.requireActual('../contexts/CourseContext'),
  useCourses: () => ({
    userProgress: { '1': { completed: false, completion: 50 } },
    updateProgress: jest.fn(),
  }),
}));

// Мок для GameContext
jest.mock('../contexts/GameContext', () => ({
  ...jest.requireActual('../contexts/GameContext'),
  useGame: () => ({
    updateExperience: jest.fn(),
    awardBadge: jest.fn(),
  }),
}));

const mockCourse = {
  _id: '1',
  title: 'Test Course',
  description: 'This is a test course',
  sections: [
    {
      _id: 's1',
      title: 'Section 1',
      lessons: [
        { _id: 'l1', title: 'Lesson 1', content: 'Lesson 1 content' },
      ],
    },
  ],
  image: 'test-image.jpg',
};

const mockReviews = [
  { user: { name: 'Test User' }, rating: 5, comment: 'Great course!' },
];

describe('CourseDetail Component', () => {
  beforeEach(async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/reviews')) {
        return Promise.resolve({ data: mockReviews });
      }
      return Promise.resolve({ data: mockCourse });
    });
    
    render(
      <NotificationProvider>
        <AuthProvider>
          <CourseProvider>
            <GameProvider>
              <CourseDetail />
            </GameProvider>
          </CourseProvider>
        </AuthProvider>
      </NotificationProvider>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
  });

  test('renders course details', async () => {
    await waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
      expect(screen.getByText('This is a test course')).toBeInTheDocument();
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Lesson 1')).toBeInTheDocument();
    });
  });

  test('displays course progress', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Course Progress: 50%/)).toBeInTheDocument();
    });
  });

  test('displays reviews', async () => {
    await waitFor(() => {
      expect(screen.getByText('Reviews')).toBeInTheDocument();
      expect(screen.getByText('Great course!')).toBeInTheDocument();
    });
  });

  test('shows add review form when user is logged in', async () => {
    await waitFor(() => {
      expect(screen.getByText('Add Your Review')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit Review' })).toBeInTheDocument();
    });
  });

  test('allows adding a new review', async () => {
    await waitFor(() => {
      const commentInput = screen.getByLabelText('Your comment');
      fireEvent.change(commentInput, { target: { value: 'New review comment' } });
      
      const submitButton = screen.getByRole('button', { name: 'Submit Review' });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/reviews'),
        expect.objectContaining({ comment: 'New review comment' }),
        expect.any(Object)
      );
    });
  });
});