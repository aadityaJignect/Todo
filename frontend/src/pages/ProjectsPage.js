import React, { useState, useEffect } from 'react';



// const API_BASE = 'http://localhost:5001/api/projects';
// const TASKS_API = 'http://localhost:5001/api/tasks';
const API_BASE = `${process.env.REACT_APP_API_URL}/api/projects`;
const TASKS_API = `${process.env.REACT_APP_API_URL}/api/tasks`;


const ProjectsPage = ({ isDark }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#007bff'
  });

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch projects: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error('Projects fetch error:', err);
      setError(err.message || 'Failed to fetch projects. Make sure the backend server is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(TASKS_API);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const response = await fetch(`${API_BASE}/${editingProject._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to update project');
      } else {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to create project');
      }
      await fetchProjects();
      setShowForm(false);
      setEditingProject(null);
      setFormData({ name: '', description: '', color: '#007bff' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      color: project.color || '#007bff'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? Tasks will be unassigned.')) return;
    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete project');
      await fetchProjects();
      await fetchTasks();
      if (selectedProject === id) setSelectedProject(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const getProjectTasks = (projectId) => {
    return tasks.filter(task => 
      task.projectId === projectId || task.project === projectId
    );
  };

  if (loading) return <div className="content">Loading projects...</div>;
  if (error) return <div className="content">Error: {error}</div>;

  return (
    <main className="content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Projects</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProject(null);
            setFormData({ name: '', description: '', color: '#007bff' });
          }}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          ➕ New Project
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ 
          maxWidth: '600px', 
          margin: '0 auto 2rem', 
          padding: '1.5rem', 
          border: `1px solid ${isDark ? '#555' : '#ddd'}`, 
          borderRadius: '8px',
          backgroundColor: isDark ? '#333' : '#f8f9fa'
        }}>
          <h3 style={{ color: isDark ? '#fff' : '#000' }}>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: isDark ? '#fff' : '#000' }}>Project Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                marginTop: '0.25rem', 
                borderRadius: '4px', 
                border: `1px solid ${isDark ? '#555' : '#ddd'}`,
                backgroundColor: isDark ? '#444' : '#fff',
                color: isDark ? '#fff' : '#000'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: isDark ? '#fff' : '#000' }}>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                marginTop: '0.25rem', 
                borderRadius: '4px', 
                border: `1px solid ${isDark ? '#555' : '#ddd'}`,
                backgroundColor: isDark ? '#444' : '#fff',
                color: isDark ? '#fff' : '#000'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: isDark ? '#fff' : '#000' }}>Color:</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                marginTop: '0.25rem', 
                borderRadius: '4px', 
                border: `1px solid ${isDark ? '#555' : '#ddd'}`
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
            <button type="button" onClick={() => {
              setShowForm(false);
              setEditingProject(null);
              setFormData({ name: '', description: '', color: '#007bff' });
            }} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <p style={{ color: isDark ? '#aaa' : '#666' }}>No projects yet. Create your first project!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.map(project => {
            const projectTasks = getProjectTasks(project._id);
            const activeTasks = projectTasks.filter(t => !t.completed && !t.archived);
            
            return (
              <div
                key={project._id}
                onClick={() => setSelectedProject(selectedProject === project._id ? null : project._id)}
                style={{
                  border: `2px solid ${project.color}`,
                  borderRadius: '8px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  backgroundColor: isDark ? '#333' : '#fff',
                  transition: 'transform 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, color: project.color }}>{project.name}</h3>
                    {project.description && (
                      <p style={{ margin: '0.5rem 0', color: isDark ? '#aaa' : '#666' }}>{project.description}</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(project);
                      }}
                      style={{ padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project._id);
                      }}
                      style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div style={{ fontSize: '0.9rem', color: isDark ? '#aaa' : '#666' }}>
                  <div>📋 {projectTasks.length} total tasks</div>
                  <div>✅ {activeTasks.length} active tasks</div>
                </div>

                {selectedProject === project._id && projectTasks.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${project.color}` }}>
                    <strong>Tasks:</strong>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                      {projectTasks.slice(0, 5).map(task => (
                        <li key={task._id} style={{ 
                          textDecoration: task.completed ? 'line-through' : 'none',
                          opacity: task.completed ? 0.6 : 1
                        }}>
                          {task.title}
                        </li>
                      ))}
                    </ul>
                    {projectTasks.length > 5 && (
                      <p style={{ fontSize: '0.8rem', color: isDark ? '#aaa' : '#666' }}>...and {projectTasks.length - 5} more</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default ProjectsPage;

