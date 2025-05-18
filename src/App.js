import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, CircularProgress, Box } from '@material-ui/core';
import theme from './theme';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Courses = React.lazy(() => import('./pages/Courses'));
const CourseDetail = React.lazy(() => import('./pages/CourseDetail'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Loading component
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

// Home redirect component
const HomeRedirect = () => {
  const token = localStorage.getItem('token');
  return token ? <Redirect to="/dashboard" /> : <Redirect to="/login" />;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <Suspense fallback={<LoadingFallback />}>
                <Switch>
                  {/* Public routes */}
                  <Route exact path="/" component={HomeRedirect} />
                  <Route path="/login" component={LoginForm} />
                  <Route path="/register" component={RegisterForm} />
                  
                  {/* Protected routes */}
                  <PrivateRoute path="/dashboard">
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </PrivateRoute>
                  
                  <PrivateRoute path="/profile">
                    <Layout>
                      <Profile />
                    </Layout>
                  </PrivateRoute>
                  
                  <PrivateRoute path="/courses" exact>
                    <Layout>
                      <Courses />
                    </Layout>
                  </PrivateRoute>
                  
                  <PrivateRoute path="/courses/:courseId">
                    <Layout>
                      <CourseDetail />
                    </Layout>
                  </PrivateRoute>
                  
                  <PrivateRoute path="/quiz/:quizId">
                    <Layout>
                      <Quiz />
                    </Layout>
                  </PrivateRoute>
                  
                  {/* 404 page */}
                  <Route path="*" component={NotFound} />
                </Switch>
              </Suspense>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;