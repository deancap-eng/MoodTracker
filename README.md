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

## Security

- Passwords are hashed using bcrypt
- JWT tokens for session management
- Context isolation enabled in Electron
- Node integration disabled for security
