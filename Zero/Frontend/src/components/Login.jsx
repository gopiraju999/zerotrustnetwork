import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const users = {
  'vigo2business@gmail.com':'Gopi',
  'vigo3business@gmail.com':'Vikas',
  'vigo4business@gmail.com':'Prasanth',
  
  'vigomain1@gmail.com':'Admin'

};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
   const expectedPassword = `vigo@${users[username]?.toLowerCase()}`;
    if (users[username] && password === expectedPassword) {
      localStorage.setItem('email', username);
      localStorage.setItem('user', users[username]);
      navigate('/mfa');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="body">
      <div className="title">Vigo</div>
      <div className="login-container container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;