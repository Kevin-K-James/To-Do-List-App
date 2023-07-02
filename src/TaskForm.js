import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskForm({ refreshTasks, taskToEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState(''); // new state variable for the category

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.slice(0, 10) : '');
      setCategory(taskToEdit.category); // set the category when editing a task
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setCategory(''); // reset the category when not editing a task
    }
  }, [taskToEdit]);

  const handleSubmit = async event => {
    event.preventDefault();

    const task = {
      title,
      description,
      priority,
      dueDate,
      category, // include the category in the task object
    };

    if (taskToEdit) {
      await axios.put(`http://localhost:3001/tasks/${taskToEdit._id}`, task);
    } else {
      await axios.post('http://localhost:3001/tasks', task);
    }

    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
    setCategory(''); // reset the category after submitting the form
    refreshTasks();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" className="form-control" id="title" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea className="form-control" id="description" value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="priority" className="form-label">Priority</label>
        <select className="form-select" id="priority" value={priority} onChange={e => setPriority(e.target.value)} required>
          <option value="">Choose...</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="dueDate" className="form-label">Due Date</label>
        <input type="date" className="form-control" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">Category</label>
        <input type="text" className="form-control" id="category" value={category} onChange={e => setCategory(e.target.value)} /> {/* new input for the category */}
      </div>
      <button type="submit" className="btn btn-primary">{taskToEdit ? 'Update' : 'Add'} Task</button>
    </form>
  );
  
}

export default TaskForm;
