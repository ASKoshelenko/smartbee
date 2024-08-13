// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@material-ui/core';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext.js';
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
import UserDashboard from './pages/UserDashboard';
import CreateCourse from './components/CreateCourse';

// Import ProtectedRoute
import ProtectedRoute from './components/ProtectedRoute'; // Make sure this import is present

// Import the new dashboard components
import AdminDashboard from './pages/AdminDashboard';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CourseProvider>
          <Router>
            <div className="App">
              <Header />
              <main>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/courses" component={Courses} />
                  <PrivateRoute path="/course/:id" component={CourseDetail} />
                  <Route path="/about" component={About} />
                  <Route path="/contact" component={Contact} />
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <PrivateRoute path="/dashboard" component={UserDashboard} />
                  <Route path="/create-course" component={CreateCourse} />
                  <ProtectedRoute path="/admin" requiredRole="admin" component={AdminDashboard} />
                  <ProtectedRoute path="/tutor" requiredRole="tutor" component={TutorDashboard} />
                  <ProtectedRoute path="/student" requiredRole="student" component={StudentDashboard} />
                </Switch>
              </main>
              <Footer />
            </div>
          </Router>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
