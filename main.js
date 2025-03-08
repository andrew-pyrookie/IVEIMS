const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load your React + Vite app
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000'); // Vite dev server URL
    win.webContents.openDevTools(); // Open DevTools in development
  } else {
    win.loadFile(path.join(__dirname, 'frontend', 'ims', 'dist', 'index.html')); // Load the built React app
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});