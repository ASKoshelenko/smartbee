import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Container } from '@material-ui/core';
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
import UserDashboard from './pages/UserDashboard';
import InstructorDashboard from './pages/InstructorDashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <CourseProvider>
            <GameProvider>
              <Router>
                <div className="App">
                  <Header />
                  <Container maxWidth="lg" style={{ padding: '0 16px' }}>
                    <main style={{ marginTop: '64px', marginBottom: '64px' }}>
                      <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/courses" component={Courses} />
                        <PrivateRoute path="/course/:id" component={CourseDetail} />
                        <Route path="/about" component={About} />
                        <Route path="/contact" component={Contact} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <PrivateRoute path="/dashboard" component={UserDashboard} />
                        <PrivateRoute path="/instructor" component={InstructorDashboard} />
                      </Switch>
                    </main>
                  </Container>
                  <Footer />
                </div>
              </Router>
            </GameProvider>
          </CourseProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
