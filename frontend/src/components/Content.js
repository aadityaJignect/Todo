import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

//const API_BASE = 'http://localhost:5001/api/tasks';
const API_BASE = `${process.env.REACT_APP_API_URL}/api/tasks`;


const Content = ({ isDark }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
      setEditingTask(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = (taskData) => {
    if (editingTask) {
      updateTask(editingTask._id, taskData);
    } else {
      createTask(taskData);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="content">
      <h2>Tasks Page Loaded</h2>
      <p>Debug: Loading: {loading.toString()}, Error: {error}, Tasks: {tasks.length}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Tasks</h2>
        <button
          onClick={() => setShowForm(true)}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          ➕ New Task
        </button>
      </div>

      {showForm ? (
        <TaskForm task={editingTask} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <TaskList tasks={tasks} onEdit={handleEdit} onDelete={deleteTask} onToggleComplete={toggleComplete} />
      )}
    </main>
  );
};

export default Content;