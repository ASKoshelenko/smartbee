// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import { MemoryRouter } from 'react-router-dom';
// import { ThemeProvider } from '@material-ui/core/styles';
// import theme from '../theme';
// import App from '../App';
// import { AuthProvider } from '../contexts/AuthContext';
// import { NotificationProvider } from '../contexts/NotificationContext';
// import { CourseProvider } from '../contexts/CourseContext';
// import { GameProvider } from '../contexts/GameContext';
// import axios from 'axios';

// jest.mock('axios');
// jest.mock('../components/Auth/Login', () => {
//   return function DummyLogin() {
//     return (
//       <div>
//         <h1>Sign in to SmartBee</h1>
//         <input aria-label="Email Address" />
//         <input aria-label="Password" type="password" />
//         <button>Sign In</button>
//       </div>
//     );
//   };
// });

// jest.setTimeout(10000); // Увеличиваем время ожидания для всех тестов

// describe('Authentication and Protected Routes', () => {
//   const renderApp = (initialEntries = ['']) => {
//     render(
//       <ThemeProvider theme={theme}>
//         <MemoryRouter initialEntries={initialEntries}>
//           <NotificationProvider>
//             <AuthProvider>
//               <CourseProvider>
//                 <GameProvider>
//                   <App />
//                 </GameProvider>
//               </CourseProvider>
//             </AuthProvider>
//           </NotificationProvider>
//         </MemoryRouter>
//       </ThemeProvider>
//     );
//   };

//   beforeEach(() => {
//     axios.post.mockResolvedValue({
//       data: {
//         token: 'fake-token',
//         user: { id: '1', name: 'Test User', role: 'student' }
//       }
//     });
//   });

//   test('Login as student', async () => {
//     renderApp(['/login']);
    
//     await waitFor(() => {
//       expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
//     });

//     fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'student@sb.com' } });
//     fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '111111' } });
//     fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/Student Dashboard/i)).toBeInTheDocument();
//     });
//   });

//   test('Login as teacher', async () => {
//     axios.post.mockResolvedValueOnce({
//       data: {
//         token: 'fake-token',
//         user: { id: '2', name: 'Teacher User', role: 'tutor' }
//       }
//     });

//     renderApp(['/login']);
    
//     await waitFor(() => {
//       expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
//     });

//     fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'teacher@sb.com' } });
//     fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '111111' } });
//     fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/Tutor Dashboard/i)).toBeInTheDocument();
//     });
//   });

//   test('Login as admin', async () => {
//     axios.post.mockResolvedValueOnce({
//       data: {
//         token: 'fake-token',
//         user: { id: '3', name: 'Admin User', role: 'admin' }
//       }
//     });

//     renderApp(['/login']);
    
//     await waitFor(() => {
//       expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
//     });

//     fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'admin@sb.com' } });
//     fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '111111' } });
//     fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
//     });
//   });

//   test('Logout', async () => {
//     renderApp(['/login']);
    
//     await waitFor(() => {
//       expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
//     });

//     fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'student@sb.com' } });
//     fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '111111' } });
//     fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/Student Dashboard/i)).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByText(/Logout/i));

//     await waitFor(() => {
//       expect(screen.getByText(/Sign in to SmartBee/i)).toBeInTheDocument();
//     });
//   });

//   test('Access protected route without authentication', async () => {
//     renderApp(['/student']);

//     await waitFor(() => {
//       expect(screen.getByText(/Sign in to SmartBee/i)).toBeInTheDocument();
//     });
//   });

//   test('Access admin route as student', async () => {
//     renderApp(['/login']);
    
//     await waitFor(() => {
//       expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
//     });

//     fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'student@sb.com' } });
//     fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '111111' } });
//     fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/Student Dashboard/i)).toBeInTheDocument();
//     });

//     renderApp(['/admin']);

//     await waitFor(() => {
//       expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
//     });
//   });
// });