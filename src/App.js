import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import Register from './Register';
import Login from './Login';
import jwt_decode from 'jwt-decode';
import backgroundImage from './background.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('none');
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(token ? jwt_decode(token)._id : null);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:3001/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setUserId(jwt_decode(token)._id);
    } else {
      localStorage.removeItem('token');
      setUserId(null);
    }
  }, [token]);

  const updateTask = async task => {
    task.completed = !task.completed;
    await axios.put(`http://localhost:3001/tasks/${task._id}`, task, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  const deleteTask = async task => {
    await axios.delete(`http://localhost:3001/tasks/${task._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  }).filter(task => {
    return task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title);
    if (sort === 'priority') return a.priority.localeCompare(b.priority);
    if (sort === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
    return 0;
  });

  if (!token) {
    return (
      <div>
        <Register />
        <Login setToken={setToken} />
      </div>
    );
  }

  return (
    <div className="container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      <h1 className="my-3">Tasks</h1>
      <TaskForm refreshTasks={fetchTasks} taskToEdit={taskToEdit} />
      <div className="my-3">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search tasks"
        />
        <button className="btn btn-secondary me-2" onClick={() => setFilter('all')}>All tasks</button>
        <button className="btn btn-secondary me-2" onClick={() => setFilter('completed')}>Completed tasks</button>
        <button className="btn btn-secondary me-2" onClick={() => setFilter('incomplete')}>Incomplete tasks</button>
        <button className="btn btn-secondary me-2" onClick={() => setSort('title')}>Sort by title</button>
        <button className="btn btn-secondary me-2" onClick={() => setSort('priority')}>Sort by priority</button>
        <button className="btn btn-secondary me-2" onClick={() => setSort('dueDate')}>Sort by due date</button>
        <button className="btn btn-secondary" onClick={() => setToken(null)}>Logout</button>

      </div>
      {sortedTasks.map(task => (
        <div key={task._id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text">{task.description}</p>
            <p className="card-text"><small className="text-muted">Priority: {task.priority}</small></p>
            <p className="card-text"><small className="text-muted">Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}</small></p>
            <p className="card-text"><small className="text-muted">Category: {task.category}</small></p> {/* display the category */}
            <button className="btn btn-primary me-2" onClick={() => updateTask(task)}>
              Mark as {task.completed ? 'incomplete' : 'complete'}
            </button>
            <button className="btn btn-warning me-2" onClick={() => setTaskToEdit(task)}>Edit task</button>
            <button className="btn btn-danger" onClick={() => deleteTask(task)}>Delete task</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
