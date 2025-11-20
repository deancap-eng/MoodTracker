import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import apiFetch from '../utils/api';
import Settings from './Settings';
import './Dashboard.css';

const MOOD_COLORS = {
  1: '#FF3B30',
  2: '#FF6B58',
  3: '#FF9500',
  4: '#FFCC00',
  5: '#8FC93A',
  6: '#34C759',
  7: '#00D084'
};

const MOOD_DESCRIPTIONS = {
  1: "I think this is going to fall apart",
  2: "Struggling to stay positive",
  3: "Getting through the day",
  4: "Feeling steady and focused",
  5: "Energized and optimistic",
  6: "Firing on all cylinders",
  7: "We're going to change the world"
};

function Dashboard({ user, token, onLogout }) {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Filters
  const [viewType, setViewType] = useState('all'); // 'all', 'average', 'user'
  const [selectedUser, setSelectedUser] = useState('');
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [viewType, selectedUser, startDate, endDate]);

  const fetchUsers = async () => {
    try {
      const response = await apiFetch('/api/mood/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        viewType
      });

      if (viewType === 'user' && selectedUser) {
        params.append('userId', selectedUser);
      }

      const response = await apiFetch(`/api/mood/dashboard?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (viewType === 'average') {
      return entries.map(entry => ({
        date: format(new Date(entry.date), 'MMM dd'),
        mood: entry.avgMood,
        count: entry.entryCount
      }));
    }

    // Group by date for all/user view
    const groupedByDate = entries.reduce((acc, entry) => {
      const dateKey = format(new Date(entry.date), 'MMM dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(entry.moodLevel);
      return acc;
    }, {});

    return Object.entries(groupedByDate).map(([date, moods]) => ({
      date,
      avgMood: moods.reduce((sum, m) => sum + m, 0) / moods.length,
      count: moods.length
    }));
  };

  const getMoodStats = () => {
    if (entries.length === 0) return null;

    let moods;
    if (viewType === 'average') {
      moods = entries.map(e => e.avgMood);
    } else {
      moods = entries.map(e => e.moodLevel);
    }

    const avg = moods.reduce((sum, m) => sum + m, 0) / moods.length;
    const max = Math.max(...moods);
    const min = Math.min(...moods);

    return { avg, max, min, count: entries.length };
  };

  const chartData = prepareChartData();
  const stats = getMoodStats();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Team Mood Dashboard</h1>
          <p className="dashboard-subtitle">Hello, {user.username}</p>
        </div>
        <div className="dashboard-header-actions">
          <button onClick={() => navigate('/mood-entry')} className="btn btn-primary">
            Record Mood
          </button>
          <button onClick={() => setShowSettings(true)} className="btn btn-secondary">
            Settings
          </button>
          <button onClick={onLogout} className="btn btn-ghost">
            Sign Out
          </button>
        </div>
      </div>

      {showSettings && (
        <Settings
          user={user}
          token={token}
          onLogout={onLogout}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Filters */}
      <div className="card filters-card">
        <div className="filters-grid">
          <div className="form-group">
            <label className="label">View Type</label>
            <select
              className="input"
              value={viewType}
              onChange={(e) => {
                setViewType(e.target.value);
                if (e.target.value !== 'user') {
                  setSelectedUser('');
                }
              }}
            >
              <option value="all">All Entries</option>
              <option value="average">Average View</option>
              <option value="user">Specific Employee</option>
            </select>
          </div>

          {viewType === 'user' && (
            <div className="form-group">
              <label className="label">Select Employee</label>
              <select
                className="input"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select an employee</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="label">Start Date</label>
            <input
              type="date"
              className="input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
            />
          </div>

          <div className="form-group">
            <label className="label">End Date</label>
            <input
              type="date"
              className="input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        </div>

        <div className="quick-filters">
          <button
            onClick={() => {
              setStartDate(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
              setEndDate(format(new Date(), 'yyyy-MM-dd'));
            }}
            className="btn btn-secondary btn-sm"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => {
              setStartDate(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
              setEndDate(format(new Date(), 'yyyy-MM-dd'));
            }}
            className="btn btn-secondary btn-sm"
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card loading-card">
          <span className="spinner"></span>
          <p>Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="card error-card">
          <p className="error">{error}</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="card empty-card">
          <p>No mood entries found for the selected period</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          {stats && (
            <div className="stats-grid">
              <div className="stat-card card">
                <div className="stat-label">Average Mood</div>
                <div className="stat-value" style={{ color: MOOD_COLORS[Math.round(stats.avg)] }}>
                  {stats.avg.toFixed(1)}
                </div>
                <div className="stat-description">
                  {MOOD_DESCRIPTIONS[Math.round(stats.avg)]}
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-label">Highest Mood</div>
                <div className="stat-value" style={{ color: MOOD_COLORS[Math.round(stats.max)] }}>
                  {stats.max.toFixed(1)}
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-label">Lowest Mood</div>
                <div className="stat-value" style={{ color: MOOD_COLORS[Math.round(stats.min)] }}>
                  {stats.min.toFixed(1)}
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-label">Total Entries</div>
                <div className="stat-value" style={{ color: 'var(--ios-blue)' }}>
                  {stats.count}
                </div>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="card chart-card">
            <h2 className="chart-title">Mood Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ios-gray-lighter)" />
                <XAxis
                  dataKey="date"
                  stroke="var(--ios-gray)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  domain={[0, 7]}
                  ticks={[1, 2, 3, 4, 5, 6, 7]}
                  stroke="var(--ios-gray)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--ios-white)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="var(--ios-blue)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--ios-blue)', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Entries List */}
          {viewType !== 'average' && (
            <div className="card entries-card">
              <h2 className="entries-title">Recent Entries</h2>
              <div className="entries-list">
                {entries.slice(0, 20).map((entry, index) => (
                  <div key={index} className="entry-item">
                    <div
                      className="entry-indicator"
                      style={{ background: MOOD_COLORS[entry.moodLevel] }}
                    ></div>
                    <div className="entry-info">
                      <div className="entry-username">{entry.username}</div>
                      <div className="entry-mood">{MOOD_DESCRIPTIONS[entry.moodLevel]}</div>
                    </div>
                    <div className="entry-date">
                      <div>{format(new Date(entry.date), 'MMM dd, yyyy')}</div>
                      <div className="entry-time">{entry.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
