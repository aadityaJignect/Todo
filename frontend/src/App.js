import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TasksPage from './pages/TasksPage';
import ProjectsPage from './pages/ProjectsPage';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import './App.css';

const AppRoutes = ({ isDark }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect to "/" on a hard page refresh
    if (window.performance && window.performance.getEntriesByType) {
      const perfEntries = window.performance.getEntriesByType("navigation");
      if (perfEntries.length > 0 && perfEntries[0].type === "reload") {
        navigate('/', { replace: true });
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<TasksPage isDark={isDark} />} />
      <Route path="/tasks" element={<TasksPage isDark={isDark} />} />
      <Route path="/analytics" element={<AnalyticsPage isDark={isDark} />} />
      <Route path="/projects" element={<ProjectsPage isDark={isDark} />} />
      <Route path="/calendar" element={<CalendarPage isDark={isDark} />} />
    </Routes>
  );
};

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <Router>
      <div className={`App ${isDark ? 'dark' : ''}`}>
        <Header toggleTheme={toggleTheme} isDark={isDark} />
        <div className="main">
          <Sidebar isDark={isDark} />
          <AppRoutes isDark={isDark} />
        </div>
      </div>
    </Router>
  );
}

export default App;







{/* 
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TasksPage from './pages/TasksPage';
import ProjectsPage from './pages/ProjectsPage';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import './App.css';





function App() {
  const [isDark, setIsDark] = useState(false);
    const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };


  return (
       
    <Router>
      <div className={`App ${isDark ? 'dark' : ''}`}>
        <Header toggleTheme={toggleTheme} isDark={isDark} />
        <div className="main">
          <Sidebar isDark={isDark} />
          <Routes>
            <Route path="/" element={<TasksPage isDark={isDark} />} />
            <Route path="/tasks" element={<TasksPage isDark={isDark} />} />
            <Route path="/analytics" element={<AnalyticsPage isDark={isDark} />} /> 
            <Route path="/projects" element={<ProjectsPage isDark={isDark} />} />
            <Route path="/calendar" element={<CalendarPage isDark={isDark} />} />
          </Routes>
        </div>
      </div>
     
    </Router>
    
  );
}

export default App;
*/}

