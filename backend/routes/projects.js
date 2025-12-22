const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects - Create a new project
router.post('/', async (req, res) => {
  const project = new Project({
    name: req.body.name,
    description: req.body.description,
    color: req.body.color || '#007bff',
    userId: req.user._id // Associate project with authenticated user
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/projects/:id - Get a single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      userId: req.user._id // Ensure user can only access their own projects
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/projects/:id - Update a project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      userId: req.user._id // Ensure user can only update their own projects
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.color = req.body.color || project.color;
    project.updatedAt = Date.now();

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id // Ensure user can only delete their own projects
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Remove projectId from tasks that reference this project (only user's tasks)
    await Task.updateMany(
      { projectId: req.params.id, userId: req.user._id },
      { $unset: { projectId: '' } }
    );
    
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

