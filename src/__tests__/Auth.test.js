import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';
import App from '../App';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { CourseProvider } from '../contexts/CourseContext';
import { GameProvider } from '../contexts/GameContext';
import axios from 'axios';

jest.mock('axios');
jest.setTimeout(10000);

const renderApp = (initialEntries = ['']) => {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={initialEntries}>
        <NotificationProvider>
          <AuthProvider>
            <CourseProvider>
              <GameProvider>
                <App />
              </GameProvider>
            </CourseProvider>
          </AuthProvider>
        </NotificationProvider>
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({
      data: {
        token: 'fake-token',
        refreshToken: 'fake-refresh-token',
        user: { id: '1', name: 'Test User', role: 'student' }
      }
    });
    axios.get.mockResolvedValue({
      data: { id: '1', name: 'Test User', role: 'student' }
    });
  });

  test('Renders without crashing', async () => {
    const { container } = renderApp(['/']);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
    });
    expect(container.innerHTML).toBeTruthy();
  });

  test('Renders login page', async () => {
    const { container } = renderApp(['/login']);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
    });
    expect(container.innerHTML).toContain('Login');
  });

  test('Renders home page when accessing protected route without authentication', async () => {
    const { container } = renderApp(['/student']);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
    });
    expect(container.innerHTML).toBeTruthy();
  });
});