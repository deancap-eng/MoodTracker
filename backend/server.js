import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';
import authRoutes from './routes/auth.js';
import moodRoutes from './routes/mood.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all interfaces for remote access

// Middleware
app.use(cors({
  origin: true, // Allow all origins for remote access
  credentials: true
}));
app.use(express.json());

// Middleware to capture client information
app.use((req, res, next) => {
  // Get client IP address (handles proxy headers)
  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp = forwardedFor
    ? forwardedFor.split(',')[0].trim()
    : req.socket.remoteAddress;

  // Store client information in request
  req.clientInfo = {
    ip: clientIp,
    userAgent: req.headers['user-agent'] || 'Unknown',
    hostname: req.hostname
  };

  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mood Tracker API is running' });
});

// Server info endpoint
app.get('/api/server-info', (req, res) => {
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }

  res.json({
    hostname: os.hostname(),
    addresses: addresses,
    port: PORT
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);

  // Display network addresses
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }

  if (addresses.length > 0) {
    console.log(`Network access: http://${addresses[0]}:${PORT}`);
    console.log(`Share this URL with remote users`);
  }
});
