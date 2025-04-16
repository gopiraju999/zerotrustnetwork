import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const avatars = {
  'prasanthkumargudela@gmail.com':'https://i.pravatar.cc/100?img=54',
  ' vigo1business@gmail.com': 'https://i.pravatar.cc/100?img=7',
  'vigo2business@gmail.com': 'https://i.pravatar.cc/100?img=12',
  'vigo3business@gmail.com': 'https://i.pravatar.cc/100?img=54',
  'vigo4business@gmail.com': 'https://i.pravatar.cc/100?img=3',
};

const Dashboard = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const email = localStorage.getItem('email');

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good Morning 🌅' : hour < 18 ? 'Good Afternoon 🌞' : 'Good Evening 🌙';
  };

  const getRandomQuote = () => {
    const quotes = [
      'Believe in yourself and all that you are! ✨',
      'Dream big and dare to fail! 🚀',
      'Your limitation—it’s only your imagination! 💡',
      'Success is not final, failure is not fatal! 🔥',
      "Don't watch the clock; do what it does—keep going! ⏳",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    navigate('/');
  };

  return (
    <div className="body">
      <div className="title">Vigo</div>
      <div className="welcome-container container">
        <img src={avatars[email]} className="avatar" alt="User Avatar" />
        <h2>
          <span>{getGreeting()}</span>, <span>{user}</span>!
        </h2>
        <div>{time}</div>
        <p>{getRandomQuote()}</p>
        <button className="btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;