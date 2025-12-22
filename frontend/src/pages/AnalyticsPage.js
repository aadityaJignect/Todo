/*
import React from 'react';

const AnalyticsPage = ({ isDark }) => {
  return (
    <main className="content">
      <h2>Analytics</h2>
      <p>Analytics dashboard will be implemented in Iteration 5.</p>
    </main>
  );
};

export default AnalyticsPage;

*/


import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';



import { formatDate } from '../utils/dateUtils';

//const API_BASE = 'http://localhost:5001/api/tasks';
const API_BASE = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/tasks`;


const AnalyticsPage = ({ isDark }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE, {
        credentials: 'include' // Include authentication cookies
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data); // Set all tasks
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks on component mount
  }, []);

  // Calculate metrics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed === true).length;
  const pendingTasks = tasks.filter((task) => task.completed === false).length;

  const completionPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

  // --- Weekly Capacity Planner Logic ---
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
    }
    return days;
  };

  // Group tasks by their due date (for the next 7 days)
  const groupTasksByDay = () => {
    const days = getNext7Days();
    const taskCountByDay = {};

    tasks.forEach((task) => {
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0]; formatDate(task.dueDate); // 'YYYY-MM-DD'
      if (days.includes(taskDate)) {
        if (!taskCountByDay[taskDate]) {
          taskCountByDay[taskDate] = 0;
        }
        taskCountByDay[taskDate]++;
      }
    });

    return days.map((day) => ({
      date: day,
      taskCount: taskCountByDay[day] || 0,
    }));
  };

  const weeklyTasks = groupTasksByDay();

  // --- UI --- 
  const cardStyle = {
    backgroundColor: isDark ? '#444' : '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: isDark ? '#fff' : '#333',
    textAlign: 'center',
    width: '25%',
  };

  const gridStyle = {
    display: 'flex',
    justifyContent: 'space-evenly',  
    flexWrap: 'wrap', 
    marginTop: '20px',

  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const numberStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#007bff',
  };

  const loadingErrorStyle = {
    fontSize: '16px',
    padding: '20px',
    backgroundColor: isDark ? '#444' : '#f8d7da',
    color: isDark ? '#fff' : '#721c24',
    borderRadius: '4px',
    textAlign: 'center',
  };

  const overloadThreshold = 5; // Example overload threshold

  // Function to determine styles for overload days
  const getDayStyle = (taskCount) => {
    return taskCount >= overloadThreshold
      ? {
          backgroundColor: '#e74c3c', // Red background for overload
          color: '#fff',
          padding: '12px',
          borderRadius: '6px',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          width: 'fit-content',marginBottom: '10px',
        }
      : {
          backgroundColor: isDark ? '#555' : '#f0f0f0',
          color: isDark ? '#fff' : '#333',
          padding: '12px',
          borderRadius: '6px',
          fontWeight: 'bold',width: 'fit-content',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.3s',marginBottom: '10px',
        };
  };

  // Style for hover effect
  const getHoverStyle = () => ({
    ':hover': {
      backgroundColor: isDark ? '#666' : '#d3d3d3',
      transform: 'scale(1.05)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
  });

   if (loading) {
  return (
    <main className="content">
      <LoadingSpinner isDark={isDark} />
    </main>
  );
}
  if (error) return <div style={loadingErrorStyle}>Error: {error}</div>;

  return (
    <main
      style={{
        padding: '20px',
        backgroundColor: isDark ? '#333' : '#fff',
        color: isDark ? '#fff' : '#000',
        transition: 'background-color 0.3s ease',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Analytics Dashboard</h2>

      <div style={gridStyle}>
        {/* Completion Percentage Card */}
        <div style={cardStyle}>
          <div style={titleStyle}>Completion Percentage</div>
          <div style={numberStyle}>{completionPercentage}%</div>
        </div>

        {/* Total Tasks Count Card */}
        <div style={cardStyle}>
          <div style={titleStyle}>Total Tasks</div>
          <div style={numberStyle}>{totalTasks}</div>
        </div>

        {/* Completed vs Pending Card */}
        <div style={cardStyle}>
          <div style={titleStyle}>Completed vs Pending</div>
          <div style={{ fontSize: '18px' }}>
            <div>
              Completed: <strong>{completedTasks}</strong>
            </div>
            <div>
              Pending: <strong>{pendingTasks}</strong>
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ textAlign: 'start', marginTop: '40px' }}>Weekly Task Planner</h3>
      <div style={{ marginTop: '20px' }}>
        {weeklyTasks.map((day) => (
          <div
            key={day.date}
            style={{
              ...getDayStyle(day.taskCount),
              ...getHoverStyle(),
            }}
          >
            <strong>{new Date(day.date).toLocaleDateString()}</strong>: {day.taskCount} tasks
          </div>
        ))}
      </div>
    </main>
  );
};

export default AnalyticsPage;
