import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';


const TaskForm = ({ task, onSave, onCancel, projects = [], isDark = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    subtasks: [],
    tags: [],
    project: '',
    projectId: '',completed: false 
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        subtasks: task.subtasks || [],
        tags: task.tags || [],
        project: task.project || '',
        projectId: task.projectId || '',
        completed: task.completed || false, 
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubtaskChange = (idx, field, value) => {
    const newSubtasks = [...formData.subtasks];
    newSubtasks[idx][field] = value;
    setFormData({ ...formData, subtasks: newSubtasks });
  };

  const addSubtask = () => {
    setFormData({ ...formData, subtasks: [...formData.subtasks, { title: '', completed: false }] });
  };

  const removeSubtask = (idx) => {
    const newSubtasks = formData.subtasks.filter((_, i) => i !== idx);
    setFormData({ ...formData, subtasks: newSubtasks });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleProjectChange = (e) => {
    const selectedProjectId = e.target.value;
    const selectedProject = projects.find(p => p._id === selectedProjectId);
    setFormData({
      ...formData,
      projectId: selectedProjectId || '',
      project: selectedProject ? selectedProject.name : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.25rem',
    backgroundColor: isDark ? '#333' : '#fff',
    color: isDark ? '#fff' : '#000',
    border: `1px solid ${isDark ? '#555' : '#ddd'}`,
    borderRadius: '4px',
    width: '97%'
  };

  const labelStyle = {
    color: isDark ? '#fff' : '#000'
  };

  // Function to handle the "Mark as Not Completed" button
  const handleMarkAsNotCompleted = () => {
    setFormData({ ...formData, completed: false });
  };
  const todayDate = new Date().toISOString().split('T')[0]; formatDate(todayDate);

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px',width: '100%', margin: '0 auto',borderRadius: '8px', backgroundColor: isDark ? '#444' : '#fff' }}>
      <h3 style={{ color: isDark ? '#fff' : '#000' }}>{task ? 'Edit Task' : 'Create New Task'}</h3>

      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={inputStyle}
          width='100%'
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          style={inputStyle}
         
        />
      </div>

      <div style={{ marginBottom: '1rem' }} >
        <label style={labelStyle}>Priority:</label>
        <select name="priority" value={formData.priority} onChange={handleChange} style={inputStyle} >
        <option value="">Select Priority</option> {/* Blank option */}
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }} >
        <label style={labelStyle}>Due Date:</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          style={inputStyle}
          min={todayDate}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Project:</label>
        <select
          name="projectId"
          value={formData.projectId}
          onChange={handleProjectChange}
          style={inputStyle}
        >
          <option value="">No Project</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>{project.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Tags:</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Add a tag"
            style={{ 
              flex: 1, 
              padding: '0.5rem',
              backgroundColor: isDark ? '#333' : '#fff',
              color: isDark ? '#fff' : '#000',
              border: `1px solid ${isDark ? '#555' : '#ddd'}`,
              borderRadius: '4px'
            }}
          />
          <button type="button" onClick={handleAddTag} style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Add
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {formData.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Subtasks:</label>
        {formData.subtasks.map((sub, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input
              type="text"
              placeholder="Subtask title"
              value={sub.title}
              onChange={(e) => handleSubtaskChange(idx, 'title', e.target.value)}
              style={{ 
                flex: 1, 
                padding: '0.5rem', 
                marginRight: '0.5rem',
                backgroundColor: isDark ? '#333' : '#fff',
                color: isDark ? '#fff' : '#000',
                border: `1px solid ${isDark ? '#555' : '#ddd'}`,
                borderRadius: '4px'
              }}
            />
            <button 
              type="button" 
              onClick={() => removeSubtask(idx)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: isDark ? '#555' : '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={addSubtask}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isDark ? '#555' : '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Subtask
        </button>
      </div>

       {/* Mark as Not Completed Button */}
      {formData.completed && (
        <div style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={handleMarkAsNotCompleted}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc3545', // Red color for "not completed"
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '30%'
            }}
          >
            Mark as Not Completed
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px',marginLeft: '30%' }}>
          {task ? 'Update Task' : 'Create Task'}
        </button>
        <button type="button" onClick={onCancel} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;