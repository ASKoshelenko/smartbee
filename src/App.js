import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Container, Box } from '@material-ui/core';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
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

function App() {
  return (
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
                      <PrivateRoute path="/admin" component={AdminDashboard} />
                      <PrivateRoute path="/tutor" component={TutorDashboard} />
                      <PrivateRoute path="/student" component={StudentDashboard} />
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
  );
}

export default App;