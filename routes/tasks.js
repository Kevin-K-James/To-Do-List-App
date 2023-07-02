const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

// Get a single task by ID
router.get('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.send(task);
});

// Create a new task
router.post('/', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.send(task);
});

// Update a task
router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(task);
});

// Delete a task
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send('Task deleted');
});

module.exports = router;
