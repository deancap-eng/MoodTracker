# Mood Tracker

An employee mood tracking application with an iOS-inspired interface. Available as a standalone desktop application for Windows, Mac, and Linux.

## Features

- 7-stage mood selector ranging from "I think this is going to fall apart" to "We're going to change the world"
- User authentication with username/password
- Dashboard showing last 7 days of team mood data
- Custom date range filtering
- Employee-specific views
- Average mood visualization
- Clean iOS-style UI
- Standalone desktop application (no installation of Node.js required)
- **Remote user tracking** - Multiple employees can connect from different locations
- **Centralized database** - All mood data stored on a central server
- **Active session monitoring** - View which remote users are currently logged in
- **Location tracking** - Track where mood entries are submitted from (IP, hostname)

## Quick Start (Desktop App)

### Download Executable

Download the pre-built application for your platform:
- **Windows**: `Mood Tracker Setup.exe` (in `dist-electron/` after building)
- **Mac**: `Mood Tracker.dmg` (in `dist-electron/` after building)
- **Linux**: `Mood Tracker.AppImage` or `.deb` (in `dist-electron/` after building)

Double-click to install and run the application. No additional setup required!

## Building from Source

### For Development

1. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ..
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```
   Access the web version at `http://localhost:5173`

### Building Executable

1. Install all dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ..
   ```

2. Build the executable for your platform:

   **For all platforms:**
   ```bash
   npm run package
   ```

   **For Windows only:**
   ```bash
   npm run package:win
   ```

   **For Mac only:**
   ```bash
   npm run package:mac
   ```

   **For Linux only:**
   ```bash
   npm run package:linux
   ```

3. Find the built application in the `dist-electron/` directory

### Note on Cross-Platform Building

- To build for Windows, you must be on Windows (or use a Windows VM/Docker)
- To build for Mac, you must be on macOS
- Linux builds can be created from Linux or macOS

## Tech Stack

- **Desktop**: Electron
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (embedded, no installation needed)
- **Authentication**: JWT + bcrypt

## Application Structure

- `electron/` - Electron main process and configuration
- `backend/` - Express API server (runs embedded in Electron)
- `frontend/` - React application
- `dist-electron/` - Built executables (created after running package commands)

## Icon

The application icon is located at `electron/icon.svg`. To customize:
1. Replace with your own 512x512 PNG image named `icon.png`
2. Rebuild the application

## Remote Deployment

Mood Tracker supports remote users connecting to a central server. This allows all employees across your organization to track their moods in a shared database.

### Quick Setup

1. **Server Setup:**
   - Install Mood Tracker on one computer (acts as the server)
   - Note the IP address shown when the server starts
   - Ensure firewall allows port 3000

2. **Client Setup:**
   - Install Mood Tracker on each employee's computer
   - Open Settings in the Dashboard
   - Enter server URL: `http://[SERVER-IP]:3000`
   - Save and restart the app

3. **Monitor Remote Users:**
   - View active sessions in Settings
   - See which employees are logged in remotely
   - Track location information (IP, hostname)

📖 **Full Guide:** See [REMOTE_DEPLOYMENT.md](REMOTE_DEPLOYMENT.md) for complete instructions on:
- Network configuration
- Firewall setup
- Port forwarding
- Cloud deployment
- Troubleshooting
- Security best practices

## Security

- Passwords are hashed using bcrypt
- JWT tokens for session management
- Context isolation enabled in Electron
- Node integration disabled for security
