import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isDark }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li className={isActive('/') || isActive('/tasks') ? 'active' : ''}>
            <Link to="/tasks">📋 Tasks</Link>
          </li>
          <li className={isActive('/projects') ? 'active' : ''}>
            <Link to="/projects">📁 Projects</Link>
          </li>
          <li className={isActive('/calendar') ? 'active' : ''}>
            <Link to="/calendar">📅 Calendar</Link>
          </li>
          <li className={isActive('/analytics') ? 'active' : ''}>
            <Link to="/analytics">📊 Analytics</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;