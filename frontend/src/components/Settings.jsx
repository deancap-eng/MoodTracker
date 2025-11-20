import React, { useState, useEffect } from 'react';
import apiFetch, { API_BASE_URL } from '../utils/api';
import './Settings.css';

function Settings({ user, token, onLogout, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [serverUrl, setServerUrl] = useState(localStorage.getItem('serverUrl') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  const fetchActiveSessions = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/api/mood/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleServerUrlSave = () => {
    if (serverUrl) {
      localStorage.setItem('serverUrl', serverUrl);
      setSuccess('Server URL saved! Please restart the app for changes to take effect.');
    } else {
      localStorage.removeItem('serverUrl');
      setSuccess('Server URL cleared! Using default localhost.');
    }

    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings & Remote Users</h2>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>

        <div className="settings-content">
          {/* Server Configuration */}
          <div className="settings-section card">
            <h3 className="section-title">Server Configuration</h3>
            <p className="section-description">
              For remote access, enter the server's IP address or hostname.
              <br />
              Current API URL: <code>{API_BASE_URL || 'http://localhost:3000'}</code>
            </p>

            <div className="form-group">
              <label className="label">Server URL (optional)</label>
              <input
                type="text"
                className="input"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://192.168.1.100:3000"
              />
              <small className="input-hint">
                Leave empty for localhost. Format: http://[IP or hostname]:3000
              </small>
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <button onClick={handleServerUrlSave} className="btn btn-primary">
              Save Server URL
            </button>
          </div>

          {/* Active Remote Users */}
          <div className="settings-section card">
            <h3 className="section-title">Active Remote Users</h3>
            <p className="section-description">
              Users currently logged in from remote locations
            </p>

            {loading ? (
              <div className="loading-state">
                <span className="spinner"></span>
                <p>Loading sessions...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="empty-state">
                <p>No active sessions found</p>
              </div>
            ) : (
              <div className="sessions-list">
                {sessions.map((session) => (
                  <div key={session.id} className="session-item">
                    <div className="session-user">
                      <div className="session-username">
                        {session.display_name || session.username}
                      </div>
                      {session.user_location && (
                        <div className="session-location">{session.user_location}</div>
                      )}
                    </div>
                    <div className="session-details">
                      <div className="session-info">
                        <span className="session-label">IP:</span>
                        <span className="session-value">{session.ip_address || 'Unknown'}</span>
                      </div>
                      <div className="session-info">
                        <span className="session-label">Hostname:</span>
                        <span className="session-value">{session.hostname || 'Unknown'}</span>
                      </div>
                      <div className="session-info">
                        <span className="session-label">Login:</span>
                        <span className="session-value">{formatDateTime(session.login_time)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
