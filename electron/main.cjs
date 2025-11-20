const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;

// Determine if we're in development or production
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function startBackendServer() {
  return new Promise((resolve, reject) => {
    const serverPath = isDev
      ? path.join(__dirname, '..', 'backend', 'server.js')
      : path.join(process.resourcesPath, 'app.asar', 'backend', 'server.js');

    console.log('Starting backend server from:', serverPath);

    // Set environment variables
    const env = Object.assign({}, process.env, {
      PORT: '3000',
      JWT_SECRET: process.env.JWT_SECRET || 'mood-tracker-secret-key-change-in-production-12345',
      NODE_ENV: isDev ? 'development' : 'production'
    });

    // Start the Node.js backend server
    serverProcess = spawn('node', [serverPath], {
      env: env,
      stdio: 'inherit'
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start backend server:', error);
      reject(error);
    });

    // Wait a bit for the server to start
    setTimeout(() => {
      console.log('Backend server started on port 3000');
      resolve();
    }, 2000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    title: 'Mood Tracker',
    show: false,
    backgroundColor: '#F2F2F7'
  });

  // Remove default menu
  Menu.setApplicationMenu(null);

  // Load the app
  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
    console.log('Loading frontend from:', indexPath);
    mainWindow.loadFile(indexPath);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    // Start the backend server first
    await startBackendServer();

    // Then create the window
    createWindow();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Kill the backend server
  if (serverProcess) {
    serverProcess.kill();
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Kill the backend server
  if (serverProcess) {
    serverProcess.kill();
  }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
