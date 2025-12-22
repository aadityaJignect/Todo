import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = ({ isDark = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts or form changes
  useEffect(() => {
    clearError();
    setLocalError('');
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (localError) setLocalError('');
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Client-side validation
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/tasks');
    } else {
      setLocalError(result.message);
    }
  };

  // Styling that matches existing components
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: isDark ? '#121212' : '#ffffff',
    padding: '2rem'
  };

  const formStyle = {
    maxWidth: '400px',
    width: '100%',
    padding: '2rem',
    borderRadius: '8px',
    backgroundColor: isDark ? '#333' : '#fff',
    border: `1px solid ${isDark ? '#555' : '#ddd'}`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    marginTop: '0.5rem',
    backgroundColor: isDark ? '#444' : '#fff',
    color: isDark ? '#fff' : '#000',
    border: `1px solid ${isDark ? '#555' : '#ddd'}`,
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: isDark ? '#fff' : '#000',
    fontWeight: '500'
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    marginTop: '1rem'
  };

  const errorStyle = {
    color: '#dc3545',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: isDark ? '#2d1b1b' : '#f8d7da',
    border: `1px solid ${isDark ? '#5c2b2b' : '#f5c6cb'}`,
    borderRadius: '4px'
  };

  const linkStyle = {
    color: '#007bff',
    textDecoration: 'none'
  };

  const displayError = localError || error;

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem', 
          color: isDark ? '#fff' : '#000' 
        }}>
          Login to Your Account
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        {displayError && (
          <div style={errorStyle}>
            {displayError}
          </div>
        )}

        <button 
          type="submit" 
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          color: isDark ? '#ccc' : '#666'
        }}>
          Don't have an account?{' '}
          <Link to="/signup" style={linkStyle}>
            Sign up here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;