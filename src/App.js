import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Container, Box, CircularProgress, Button } from '@material-ui/core';
import { useTransition, animated } from 'react-spring';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import { GameProvider } from './contexts/GameContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorHandler from './components/GlobalErrorHandler';
import PrivateRoute from './components/PrivateRoute';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const Profile = lazy(() => import('./components/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const TutorDashboard = lazy(() => import('./pages/TutorDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// AnimatedRoutes component
function AnimatedRoutes() {
  const location = useLocation();
  
  const transitions = useTransition(location, {
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  });

  return transitions((props, item) => (
    <animated.div style={props}>
      <Switch location={item}>
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
    </animated.div>
  ));
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeApp = async () => {
    try {
      // Simulate app initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to initialize app:', err);
      setError('Failed to initialize app. Please try again later.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
    return (
      <GlobalErrorHandler 
        error={error} 
        onRetry={() => {
          setError(null);
          setIsLoading(true);
          initializeApp();
        }} 
      />
    );
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
                  <ScrollToTop />
                  <Box 
                    className="App" 
                    display="flex" 
                    flexDirection="column" 
                    minHeight="100vh"
                    bgcolor="background.default"
                  >
                    <Header />
                    <Container 
                      maxWidth={false} 
                      component="main" 
                      style={{
                        flexGrow: 1, 
                        paddingTop: '64px', 
                        paddingLeft: 0,
                        paddingRight: 0,
                      }}
                    >
                      <Suspense fallback={
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)">
                          <CircularProgress />
                        </Box>
                      }>
                        <AnimatedRoutes />
                      </Suspense>
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