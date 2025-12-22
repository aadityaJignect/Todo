import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleTheme, isDark }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success || !result.success) { // Redirect regardless of server response
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <h1>Todo App</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            color: isDark ? '#fff' : '#000'
          }}>
            <span style={{ fontSize: '0.9rem' }}>
              Welcome, {user.email}
            </span>
            <button 
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Logout
            </button>
          </div>
        )}
        <button className="toggle-btn" onClick={toggleTheme}>
          {isDark ? '☀️ Light' : '🌙 Dark'} Mode
        </button>
      </div>
    </header>
  );
};

export default Header;