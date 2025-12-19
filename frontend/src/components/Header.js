import React from 'react';

const Header = ({ toggleTheme, isDark }) => {
  return (
    <header className="header">
      <h1>Todo App Updated at 2:20</h1>
      <button className="toggle-btn" onClick={toggleTheme}>
        {isDark ? '☀️ Light' : '🌙 Dark'} Mode
      </button>
    </header>
  );
};

export default Header;