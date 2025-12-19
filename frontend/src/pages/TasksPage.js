import React, { useState, useEffect, useCallback } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';


 
 
// const API_BASE = 'http://localhost:5001/api/tasks';
// const PROJECTS_API = 'http://localhost:5001/api/projects';
const API_BASE = `${process.env.REACT_APP_API_URL}/api/tasks`;
const PROJECTS_API = `${process.env.REACT_APP_API_URL}/api/projects`;

 
const TasksPage = ({ isDark }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  
 
  // Filter and sort state
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [searchQuery, setSearchQuery] = useState('');


 
  const fetchProjects = async () => {
    try {
      const response = await fetch(PROJECTS_API);
      if (!response.ok) {
        console.warn('Failed to fetch projects:', response.status);
        return;
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      // Don't set error state for projects - it's not critical for tasks page
    }
  };
 
  const applyFiltersAndSort = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
     
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (projectFilter !== 'all') {
        params.append('projectId', projectFilter);
      }
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
 
      const queryString = params.toString();
      const url = queryString ? `${API_BASE}?${queryString}` : API_BASE;
     
      console.log('Fetching tasks from:', url); // Debug log
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch tasks: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      console.log('Received tasks:', data.length); // Debug log
      setFilteredTasks(data);
      setTasks(data); // Also update tasks state for reference
    } catch (err) {
      console.error('Filter error:', err);
      setError(err.message || 'Failed to fetch tasks. Make sure the backend server is running on port 5001.');
      setFilteredTasks([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, projectFilter, sortBy, searchQuery]);
 
  useEffect(() => {
    fetchProjects();
    // Initial load
    applyFiltersAndSort();
  }, []);
 
  useEffect(() => {
    // Apply filters when they change - use a small delay for search to debounce
    const timeoutId = setTimeout(() => {
      applyFiltersAndSort();
    }, searchQuery ? 300 : 0); // Debounce search by 300ms
 
    return () => clearTimeout(timeoutId);
  }, [applyFiltersAndSort]);
 
  const createTask = async (taskData) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!response.ok) throw new Error('Failed to create task');
      await applyFiltersAndSort(); // Refresh with current filters
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
      await applyFiltersAndSort(); // Refresh with current filters
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
      await applyFiltersAndSort(); // Refresh with current filters
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
      await applyFiltersAndSort(); // Refresh with current filters
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
 
  if (loading) return <div className="content">Loading tasks...</div>;
  if (error) return <div className="content">Error: {error}</div>;
 
  return (
    <main className="content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Tasks</h2>
        {!showForm&&
        <button
          onClick={() => setShowForm(true)}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
        >
          ➕ New Task
        </button>}
      </div>
 
      {!showForm && (
        <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          {/* Global Search */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '98%',
                height: '18px',
                padding: '0.5rem',
                borderRadius: '4px',
                border: `1px solid ${isDark ? '#555' : '#ddd'}`,
                backgroundColor: isDark ? '#333' : '#fff',
                color: isDark ? '#fff' : '#000'
              }}
            />
          </div>
 
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: `1px solid ${isDark ? '#555' : '#ddd'}`,
              backgroundColor: isDark ? '#333' : '#fff',
              color: isDark ? '#fff' : '#000'
            }}
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
            <option value="overdue">Overdue</option>
          </select>
 
          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: `1px solid ${isDark ? '#555' : '#ddd'}`,
              backgroundColor: isDark ? '#333' : '#fff',
              color: isDark ? '#fff' : '#000'
            }}
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </select>
 
          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: `1px solid ${isDark ? '#555' : '#ddd'}`,
              backgroundColor: isDark ? '#333' : '#fff',
              color: isDark ? '#fff' : '#000'
            }}
          >
            <option value="created">Created (Newest)</option>
            <option value="dueDate">Due Date (Earliest)</option>
            <option value="dueDateDesc">Due Date (Latest)</option>
            <option value="priority">Priority</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      )}
 
      {showForm ? (
        <TaskForm
          task={editingTask}
          onSave={handleSave}
          onCancel={handleCancel}
          projects={projects}
          isDark={isDark}
        />
      ) : (
        <TaskList
        tasks={filteredTasks}
        onEdit={handleEdit}
        onDelete={deleteTask}
        onToggleComplete={toggleComplete} 
          projects={projects}
          isDark={isDark}
        />
      )}
    </main>
  );
};
 
export default TasksPage;
 