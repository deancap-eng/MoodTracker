import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodSelector from './MoodSelector';
import apiFetch from '../utils/api';
import './MoodEntry.css';

function MoodEntry({ user, token, onLogout }) {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5));
  const [selectedMood, setSelectedMood] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMoodSelect = (moodLevel) => {
    setSelectedMood(moodLevel);
    setShowAuth(true);
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verify password by attempting login
      const loginResponse = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, password })
      });

      if (!loginResponse.ok) {
        setError('Invalid password');
        setLoading(false);
        return;
      }

      // Submit mood entry
      const moodResponse = await apiFetch('/api/mood/entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          moodLevel: selectedMood,
          date,
          time
        })
      });

      if (moodResponse.ok) {
        setSuccess('Mood recorded successfully!');
        setShowAuth(false);
        setPassword('');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        const data = await moodResponse.json();
        setError(data.error || 'Failed to record mood');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowAuth(false);
    setSelectedMood(null);
    setPassword('');
    setError('');
  };

  return (
    <div className="mood-entry-container">
      <div className="mood-entry-header">
        <div>
          <h1 className="mood-entry-title">How are you feeling?</h1>
          <p className="mood-entry-subtitle">Hello, {user.username}</p>
        </div>
        <button onClick={onLogout} className="btn btn-ghost">
          Sign Out
        </button>
      </div>

      <div className="mood-entry-content">
        <div className="card date-time-card">
          <div className="date-time-grid">
            <div className="form-group">
              <label className="label">Date</label>
              <input
                type="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label className="label">Time</label>
              <input
                type="time"
                className="input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <MoodSelector onSelect={handleMoodSelect} selectedMood={selectedMood} />

        {success && (
          <div className="card success-card">
            <p className="success">{success}</p>
          </div>
        )}
      </div>

      {showAuth && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Confirm Your Mood</h2>
            <p className="modal-subtitle">Enter your password to submit</p>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoFocus
                />
              </div>

              {error && <div className="error">{error}</div>}

              <div className="modal-actions">
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner"></span> : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoodEntry;
