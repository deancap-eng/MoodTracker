import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MoodEntry from './components/MoodEntry';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const handleLogin = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/login"
            element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/mood-entry" />}
          />
          <Route
            path="/register"
            element={!token ? <Register onRegister={handleLogin} /> : <Navigate to="/mood-entry" />}
          />
          <Route
            path="/mood-entry"
            element={token ? <MoodEntry user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard"
            element={token ? <Dashboard user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to={token ? "/mood-entry" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
