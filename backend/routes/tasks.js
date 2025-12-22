const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/tasks - Get all tasks with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { status, sortBy, search, projectId } = req.query;
    
    // Build filter query - always filter by user
    let filter = { userId: req.user._id };
    
    // Status filter
    if (status) {
      switch (status) {
        case 'active':
          filter.completed = false;
          filter.archived = false;
          break;
        case 'completed':
          filter.completed = true;
          filter.archived = false;
          break;
        case 'archived':
          filter.archived = true;
          break;
        case 'overdue':
          filter.completed = false;
          filter.archived = false;
          filter.dueDate = { $lt: new Date() };
          break;
      }
    }
    
    // Project filter
    if (projectId) {
      filter.$or = [
        { projectId: projectId },
        { project: projectId } // Backward compatibility
      ];
    }
    
    // Search filter (title or description)
    if (search) {
      const searchConditions = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      
      if (filter.$or) {
        // If project filter exists, combine with AND logic
        filter.$and = [
          { $or: filter.$or },
          { $or: searchConditions }
        ];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }
    
    // Build sort query
    let sort = {};
    switch (sortBy) {
      case 'dueDate':
        sort = { dueDate: 1 };
        break;
      case 'dueDateDesc':
        sort = { dueDate: -1 };
        break;
      case 'priority':
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        // We'll sort in memory for priority
        break;
      case 'created':
        sort = { createdAt: -1 };
        break;
      case 'alphabetical':
        sort = { title: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
    
    let tasks = await Task.find(filter).sort(sort);
    
    // Sort by priority if needed (custom sort)
    if (sortBy === 'priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      tasks = tasks.sort((a, b) => {
        return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
      });
    }
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    subtasks: req.body.subtasks,
    tags: req.body.tags,
    project: req.body.project,
    projectId: req.body.projectId,
    userId: req.user._id // Associate task with authenticated user
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/tasks/:id - Get a single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user._id // Ensure user can only access their own tasks
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user._id // Ensure user can only update their own tasks
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.subtasks = req.body.subtasks || task.subtasks;
    task.tags = req.body.tags || task.tags;
    task.project = req.body.project || task.project;
    task.projectId = req.body.projectId !== undefined ? req.body.projectId : task.projectId;
    task.archived = req.body.archived !== undefined ? req.body.archived : task.archived;
    task.updatedAt = Date.now();

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id // Ensure user can only delete their own tasks
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;