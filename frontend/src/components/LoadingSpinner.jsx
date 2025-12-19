// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ isDark, text = 'Loading...' }) => {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: isDark ? '#fff' : '#333'
    }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          border: `4px solid ${isDark ? '#444' : '#ddd'}`,
          borderTop: `4px solid ${isDark ? '#0d6efd' : '#28a745'}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}
      />
      <span style={{ fontSize: '1rem', opacity: 0.8 }}>{text}</span>

      {/* Inline keyframes */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
