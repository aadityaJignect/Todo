import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import TasksPage from './pages/TasksPage';
import ProjectsPage from './pages/ProjectsPage';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Component to handle authenticated user redirects
const AuthRedirect = ({ isDark }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner isDark={isDark} />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

// Main app layout for authenticated users
const AuthenticatedLayout = ({ isDark, toggleTheme }) => {
  return (
    <>
      <Header toggleTheme={toggleTheme} isDark={isDark} />
      <div className="main">
        <Sidebar isDark={isDark} />
        <Routes>
          <Route path="/tasks" element={<TasksPage isDark={isDark} />} />
          <Route path="/analytics" element={<AnalyticsPage isDark={isDark} />} /> 
          <Route path="/projects" element={<ProjectsPage isDark={isDark} />} />
          <Route path="/calendar" element={<CalendarPage isDark={isDark} />} />
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <AuthProvider>
      <Router>
        <div className={`App ${isDark ? 'dark' : ''}`}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage isDark={isDark} />} />
            <Route path="/signup" element={<SignupPage isDark={isDark} />} />
            
            {/* Root redirect */}
            <Route path="/" element={<AuthRedirect isDark={isDark} />} />
            
            {/* Protected routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <AuthenticatedLayout isDark={isDark} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


