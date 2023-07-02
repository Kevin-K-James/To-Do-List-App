import React, { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    const res = await axios.post('http://localhost:3001/users/login', { username, password });
    setToken(res.data.token);
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <h2>Login</h2>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input type="text" className="form-control" id="username" value={username} onChange={e => setUsername(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary">Login</button>
    </form>
  );
  
}

export default Login;
