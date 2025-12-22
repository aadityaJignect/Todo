import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api`;

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth status with API:', `${API_BASE_URL}/auth/me`);
        
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include', // Include cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Auth check response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Auth check response data:', data);
          if (data.success) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [API_BASE_URL]);

  const register = async (email, password, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Attempting registration with:', { email, API_BASE_URL });

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      console.log('Registration response status:', response.status);

      const data = await response.json();
      console.log('Registration response data:', data);

      if (response.ok && data.success) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        setError(data.message || 'Registration failed');
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = 'Network error during registration';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Attempting login with:', { email, API_BASE_URL });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);

      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok && data.success) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        setError(data.message || 'Login failed');
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Network error during login';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Clear user state regardless of response (in case server is down)
      setUser(null);
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: 'Logout failed on server' };
      }
    } catch (error) {
      // Clear user state even if network fails
      setUser(null);
      return { success: false, message: 'Network error during logout' };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};