import React from 'react';

const Header = ({ toggleTheme, isDark }) => {
  return (
    <header className="header">
      <h1>Todo App update</h1>
      <button className="toggle-btn" onClick={toggleTheme}>
        {isDark ? '☀️ Light' : '🌙 Dark'} Mode
      </button>
    </header>
  );
};

export default Header;