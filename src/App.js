import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Container, Box, CircularProgress } from '@material-ui/core';
import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import { GameProvider } from './contexts/GameContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import AdminDashboard from './pages/AdminDashboard';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorHandler from './components/GlobalErrorHandler';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Имитация асинхронной инициализации
    const initializeApp = async () => {
      try {
        // Здесь могут быть асинхронные операции инициализации
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError('Failed to initialize app. Please try again later.');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <GlobalErrorHandler error={error} />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <AuthProvider>
            <CourseProvider>
              <GameProvider>
                <Router>
                  <Box 
                    className="App" 
                    display="flex" 
                    flexDirection="column" 
                    minHeight="100vh"
                    bgcolor="background.default"
                  >
                    <Header />
                    <Container 
                      maxWidth="lg" 
                      component="main" 
                      sx={{ 
                        flexGrow: 1, 
                        py: 8, 
                        px: 2,
                        mt: '64px', 
                      }}
                    >
                      <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/courses" component={Courses} />
                        <PrivateRoute path="/course/:id" component={CourseDetail} />
                        <Route path="/about" component={About} />
                        <Route path="/contact" component={Contact} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <PrivateRoute path="/profile" component={Profile} />
                        <PrivateRoute path="/admin" component={AdminDashboard} roles={['admin']} />
                        <PrivateRoute path="/tutor" component={TutorDashboard} roles={['tutor', 'admin']} />
                        <PrivateRoute path="/student" component={StudentDashboard} roles={['student']} />
                        <Route path="*" render={() => <Redirect to="/" />} />
                      </Switch>
                    </Container>
                    <Footer />
                  </Box>
                </Router>
              </GameProvider>
            </CourseProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;