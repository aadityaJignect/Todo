/*

import React from 'react';

const CalendarPage = ({ isDark }) => {
  return (
    <main className="content">
      <h2>Calendar</h2>
      <p>Calendar view will be implemented in Iteration 4.</p>
    </main>
  );
};
export default CalendarPage;
*/
import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';


//const API_BASE = 'http://localhost:5001/api/tasks';
const API_BASE = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/tasks`;


const CalendarPage = ({ isDark }) => {
  // Local state for tasks, month, and year
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for current month and year
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  // Fetch tasks from the API (assuming the task data includes a due date)
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

  // Filter tasks based on the current month and year
  const filterTasksByDate = useCallback(() => {
    const filtered = tasks.filter(task => {
      const taskDueDate = new Date(task.dueDate);
      return taskDueDate.getMonth() === currentMonth && taskDueDate.getFullYear() === currentYear;
    });
    setFilteredTasks(filtered);
  }, [tasks, currentMonth, currentYear]);

  useEffect(() => {
    fetchTasks(); // Fetch tasks on component mount
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      filterTasksByDate(); // Apply date filtering once tasks are fetched
    }
  }, [tasks, currentMonth, currentYear, filterTasksByDate]);

  // Navigation functions to go to previous or next month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Helper function to generate the days of the month (first day, total days)
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = [];

    // Fill in empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }

    // Fill in the days of the month
    for (let day = 1; day <= totalDaysInMonth; day++) {
      calendarDays.push(day);
    }

    return calendarDays;
  };

  const calendarDays = generateCalendarDays();

  // Render tasks for a specific day
  const renderTasksForDay = (day) => {
    const tasksForDay = filteredTasks.filter(task => {
      const taskDueDate = new Date(task.dueDate);
      return taskDueDate.getDate() === day;
    });

    return tasksForDay.length ? (
      tasksForDay.map(task => (
        <div 
          key={task._id} 
          style={{
            ...taskItemStyle, 
            backgroundColor: getPriorityColor(task.priority), 
            fontWeight: task.completed ? 'normal' : 'bold',   // Muted for completed tasks
            color: task.completed ? '#aaa' : 'white',         // Muted color for completed tasks
          }}
        >
          <span>{task.title}</span>
        </div>
      ))
    ) : (
      <span>No tasks</span>
    );
  };

  // Helper function to get the color based on task priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#dc3545'; // Red
      case 'Medium': return '#ffc107'; // Yellow
      case 'Low': return '#28a745'; // Green
      default:
        return 'transparent';
    }
  };

  // Error handling UI
  const loadingErrorStyle = {
    fontSize: '16px',
    padding: '20px',
    backgroundColor: isDark ? '#444' : '#f8d7da',
    color: isDark ? '#fff' : '#721c24',
    borderRadius: '4px',
    textAlign: 'center',
  };

  if (loading) {
  return (
    <main className="content">
      <LoadingSpinner isDark={isDark} />
    </main>
  );
}
  if (error) return <div style={loadingErrorStyle}>Error: {error}</div>;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Inline styles
  const calendarGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '10px',
  };

  const calendarCellStyle = (day) => ({
    padding: '10px',
    border: `1px solid ${isDark ? '#555' : '#ddd'}`,
    backgroundColor: isDark ? '#444' : '#fff',
    borderRadius: '4px',
    textAlign: 'center',
    position: 'relative',
    minHeight: '80px',
    ...(day === currentDate.getDate() && {
      border: '2px solid blue', // Highlight today's cell
    }),
  });

  const dayNumberStyle = {
    fontWeight: 'bold',
  };

  const taskItemStyle = {
    fontSize: '12px',
    padding: '4px',
    marginTop: '4px',
    borderRadius: '4px',
  };

  const navigationButtonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const navigationButtonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  };

  const monthYearDisplayStyle = {
    fontWeight: 'bold',
    padding: '8px 12px',
    backgroundColor: isDark ? '#555' : '#f5f5f5',
    borderRadius: '4px',
  };

  // Today's and Upcoming tasks section
  const todayTasks = tasks.filter(task => {
    const taskDueDate = new Date(task.dueDate);
    return taskDueDate.toDateString() === currentDate.toDateString(); // Today's tasks
  });

  const upcomingTasks = tasks.filter(task => {
    const taskDueDate = new Date(task.dueDate);
    const dayDifference = (taskDueDate - currentDate) / (1000 * 3600 * 24); // Difference in days
    return dayDifference > 0 && dayDifference <= 7; // Tasks due within the next 7 days
  });

  return (
    <main style={{ padding: '20px', backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000' , overflowY: 'auto'}}>
      <div style={headerStyle}>
        <h2>Calendar</h2>
        <div style={{ display: 'flex' }}>
          <button
            onClick={goToPreviousMonth}
            style={{ ...navigationButtonStyle, marginRight: '10px' }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = navigationButtonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = navigationButtonStyle.backgroundColor)}
          >
            Previous
          </button>
          <span style={monthYearDisplayStyle}>
            {months[currentMonth]} {currentYear}
          </span>
          <button
            onClick={goToNextMonth}
            style={{ ...navigationButtonStyle, marginLeft: '10px' }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = navigationButtonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = navigationButtonStyle.backgroundColor)}
          >
            Next
          </button>
        </div>
      </div>

      <div style={calendarGridStyle}>
        {calendarDays.map((day, index) => (
          <div key={index} style={calendarCellStyle(day)}>
            {day && <div style={dayNumberStyle}>{day}</div>}
            {day && renderTasksForDay(day)}
          </div>
        ))}
      </div>

      {/* Today’s Tasks Section */}
      <div style={{ marginTop: '2rem', width: 'fit-content' }}>
        <h3>Today's Tasks</h3>
        {todayTasks.length ? (
          todayTasks.map(task => (
            <div
              key={task._id}
              style={{
                ...taskItemStyle,
                backgroundColor: getPriorityColor(task.priority),
                fontWeight: task.completed ? 'normal' : 'bold',
                color: task.completed ? '#aaa' : 'white',
              }}
            >
              <span>{task.title}</span>
            </div>
          ))
        ) : (
          <p>No tasks for today.</p>
        )}
      </div>

      {/* Upcoming Tasks Section */}
      <div style={{ marginTop: '2rem' , width: 'fit-content' }}>
        <h3>Upcoming (Next 7 Days)</h3>
        {upcomingTasks.length ? (
          upcomingTasks.map(task => (
            <div
              key={task._id}
              style={{
                ...taskItemStyle,
                backgroundColor: getPriorityColor(task.priority),
                fontWeight: task.completed ? 'normal' : 'bold',
                color: task.completed ? '#aaa' : 'white',
              }}
            >
              <span>{task.title}</span>
            </div>
          ))
        ) : (
          <p>No upcoming tasks.</p>
        )}
      </div>
    </main>
  );
};

export default CalendarPage;
