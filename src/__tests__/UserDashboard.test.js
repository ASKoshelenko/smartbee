import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserDashboard from '../pages/UserDashboard';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { GameProvider } from '../contexts/GameContext';
import axios from 'axios';

jest.mock('axios');
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => ({
    user: { name: 'Test User' },
  }),
}));

const mockUserStats = {
  level: 5,
  experience: 250,
  badges: ['beginner', 'fast_learner'],
  streakDays: 7,
};

const mockEnrolledCourses = [
  { _id: '1', title: 'Course 1' },
  { _id: '2', title: 'Course 2' },
];

describe('UserDashboard Component', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('user-stats')) {
        return Promise.resolve({ data: mockUserStats });
      } else if (url.includes('enrolled-courses')) {
        return Promise.resolve({ data: mockEnrolledCourses });
      }
    });

    render(
      <NotificationProvider>
        <AuthProvider>
          <GameProvider>
            <UserDashboard />
          </GameProvider>
        </AuthProvider>
      </NotificationProvider>
    );
  });

  test('renders user dashboard', async () => {
    await waitFor(() => {
      expect(screen.getByText('Welcome, Test User!')).toBeInTheDocument();
      expect(screen.getByText('Level: 5')).toBeInTheDocument();
      expect(screen.getByText('250 / 500 XP')).toBeInTheDocument();
      expect(screen.getByText('Learning Streak: 7 days')).toBeInTheDocument();
      expect(screen.getByText('Course 1')).toBeInTheDocument();
      expect(screen.getByText('Course 2')).toBeInTheDocument();
    });
  });

  test('displays user badges', async () => {
    await waitFor(() => {
      expect(screen.getByText('beginner')).toBeInTheDocument();
      expect(screen.getByText('fast_learner')).toBeInTheDocument();
    });
  });

  test('shows correct number of enrolled courses', async () => {
    await waitFor(() => {
      const enrolledCourses = screen.getAllByText(/Course [12]/);
      expect(enrolledCourses).toHaveLength(2);
    });
  });
});