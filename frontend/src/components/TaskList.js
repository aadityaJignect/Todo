import React from 'react';
import { formatDate } from '../utils/dateUtils';

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete, projects = [], isDark = false }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#dc3545'; // Red
      case 'Medium': return '#ffc107'; // Yellow
      case 'Low': return '#28a745'; // Green
      default: return '#6c757d';
    }
  };

  return (
    <div>
      <h3 style={{ color: isDark ? '#fff' : '#000' }}>Your Tasks</h3>
      {tasks.length === 0 ? (
        <p style={{ color: isDark ? '#aaa' : '#666' }}>No tasks found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(task => (
            <li key={task._id} style={{
              border: `1px solid ${isDark ? '#555' : '#ddd'}`,
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '0.5rem',
              backgroundColor: task.completed 
                ? (isDark ? '#2a2a2a' : '#f8f9fa') 
                : (isDark ? '#333' : '#fff'),
              opacity: task.completed ? 0.7 : 1,
              color: isDark ? '#fff' : '#000'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, textDecoration: task.completed ? 'line-through' : 'none', color: isDark ? '#fff' : '#000' }}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p style={{ margin: '0.5rem 0', color: isDark ? '#ccc' : '#666' }}>{task.description}</p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                      backgroundColor: getPriorityColor(task.priority),
                      color: '#fff',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span style={{ color: isDark ? '#ccc' : '#666' }}>📅 {formatDate(task.dueDate)}</span>
                    )}
                    {(() => {
                      const project = projects.find(p => p._id === (task.projectId || task.project));
                      return project ? (
                        <span style={{ color: project.color }}>📁 {project.name}</span>
                      ) : (
                        task.project && <span style={{ color: isDark ? '#ccc' : '#666' }}>📁 {task.project}</span>
                      );
                    })()}
                    {task.tags && task.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                        {task.tags.map((tag, idx) => (
                          <span key={idx} style={{ 
                            fontSize: '0.75rem', 
                            backgroundColor: isDark ? '#555' : '#e9ecef', 
                            color: isDark ? '#fff' : '#000',
                            padding: '0.125rem 0.5rem', 
                            borderRadius: '4px' 
                          }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <strong style={{ color: isDark ? '#fff' : '#000' }}>Subtasks:</strong>
                      <ul style={{ marginTop: '0.25rem', paddingLeft: '1.5rem' }}>
                        {task.subtasks.map((sub, idx) => (
                          <li key={idx} style={{ 
                            textDecoration: sub.completed ? 'line-through' : 'none',
                            color: isDark ? '#ccc' : '#666',
                            marginBottom: '0.25rem'
                          }}>
                            {sub.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    
                  <button 
                    onClick={() => onToggleComplete(task._id, !task.completed)}
                    disabled={task.completed} 
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: isDark ? '#555' : '#6c757d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                     ✅ Mark as Complete
                  </button>
                  <button 
                    onClick={() => onEdit(task)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: isDark ? '#0056b3' : '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => onDelete(task._id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;