
const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});



const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  dueDate: Date,
  subtasks: [subtaskSchema],
  tags: [String],
  project: String, // Keep for backward compatibility
  projectId: String, // New field for project reference
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // New field for user association
  archived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Task', taskSchema);
