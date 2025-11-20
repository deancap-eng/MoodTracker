import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Mood level descriptions
const MOOD_LEVELS = {
  1: "I think this is going to fall apart",
  2: "Struggling to stay positive",
  3: "Getting through the day",
  4: "Feeling steady and focused",
  5: "Energized and optimistic",
  6: "Firing on all cylinders",
  7: "We're going to change the world"
};

// Get mood levels
router.get('/levels', (req, res) => {
  res.json(MOOD_LEVELS);
});

// Submit mood entry
router.post('/entry', authenticateToken, (req, res) => {
  const { moodLevel, date, time } = req.body;
  const userId = req.user.id;

  if (!moodLevel || moodLevel < 1 || moodLevel > 7) {
    return res.status(400).json({ error: 'Mood level must be between 1 and 7' });
  }

  if (!date || !time) {
    return res.status(400).json({ error: 'Date and time are required' });
  }

  try {
    // Capture client information
    const clientInfo = req.clientInfo || {};

    // Use INSERT OR REPLACE to update if entry already exists for this user and date
    const result = db.prepare(`
      INSERT INTO mood_entries (user_id, mood_level, entry_date, entry_time, hostname, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, entry_date) DO UPDATE SET
        mood_level = excluded.mood_level,
        entry_time = excluded.entry_time,
        hostname = excluded.hostname,
        ip_address = excluded.ip_address,
        created_at = CURRENT_TIMESTAMP
    `).run(userId, moodLevel, date, time, clientInfo.hostname, clientInfo.ip);

    res.json({
      message: 'Mood entry saved successfully',
      entry: { moodLevel, date, time }
    });
  } catch (error) {
    console.error('Error saving mood entry:', error);
    res.status(500).json({ error: 'Error saving mood entry' });
  }
});

// Get mood data for dashboard
router.get('/dashboard', authenticateToken, (req, res) => {
  const { startDate, endDate, userId, viewType } = req.query;

  try {
    let query;
    let params;

    if (viewType === 'average') {
      // Get average mood per day
      query = `
        SELECT
          entry_date as date,
          ROUND(AVG(mood_level), 1) as avgMood,
          COUNT(*) as entryCount
        FROM mood_entries
        WHERE entry_date >= ? AND entry_date <= ?
        GROUP BY entry_date
        ORDER BY entry_date DESC
      `;
      params = [startDate, endDate];
    } else if (userId) {
      // Get specific user's mood entries
      query = `
        SELECT
          m.entry_date as date,
          m.entry_time as time,
          m.mood_level as moodLevel,
          u.username
        FROM mood_entries m
        JOIN users u ON m.user_id = u.id
        WHERE m.user_id = ? AND m.entry_date >= ? AND m.entry_date <= ?
        ORDER BY m.entry_date DESC
      `;
      params = [userId, startDate, endDate];
    } else {
      // Get all mood entries with user info
      query = `
        SELECT
          m.entry_date as date,
          m.entry_time as time,
          m.mood_level as moodLevel,
          u.username,
          u.id as userId
        FROM mood_entries m
        JOIN users u ON m.user_id = u.id
        WHERE m.entry_date >= ? AND m.entry_date <= ?
        ORDER BY m.entry_date DESC, m.entry_time DESC
      `;
      params = [startDate, endDate];
    }

    const entries = db.prepare(query).all(...params);
    res.json({ entries, moodLevels: MOOD_LEVELS });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

// Get all users (for filter dropdown)
router.get('/users', authenticateToken, (req, res) => {
  try {
    const users = db.prepare('SELECT id, username, display_name, location FROM users ORDER BY username').all();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Get active user sessions (for remote user tracking)
router.get('/sessions', authenticateToken, (req, res) => {
  try {
    const sessions = db.prepare(`
      SELECT
        s.id,
        s.user_id,
        u.username,
        u.display_name,
        u.location as user_location,
        s.login_time,
        s.hostname,
        s.ip_address,
        s.user_agent
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.logout_time IS NULL
      ORDER BY s.login_time DESC
      LIMIT 50
    `).all();

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Error fetching sessions' });
  }
});

// Get recent mood entries with location info
router.get('/recent-with-location', authenticateToken, (req, res) => {
  const limit = parseInt(req.query.limit) || 20;

  try {
    const entries = db.prepare(`
      SELECT
        m.entry_date as date,
        m.entry_time as time,
        m.mood_level as moodLevel,
        m.hostname,
        m.ip_address,
        u.username,
        u.display_name,
        u.location as user_location
      FROM mood_entries m
      JOIN users u ON m.user_id = u.id
      ORDER BY m.entry_date DESC, m.entry_time DESC
      LIMIT ?
    `).all(limit);

    res.json(entries);
  } catch (error) {
    console.error('Error fetching recent entries:', error);
    res.status(500).json({ error: 'Error fetching recent entries' });
  }
});

export default router;
