const { app, BrowserWindow } = require('electron');
const path = require('path');

console.log('Starting Electron...');

function createWindow() {
  console.log('Creating browser window...');
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  console.log('Browser window created');

  // Load your React app
  if (process.env.NODE_ENV === 'development') {
    console.log('Loading development URL: http://localhost:3000');
    win.loadURL('http://localhost:3000') // Ensure this matches your Vite dev server URL
      .then(() => {
        console.log('Development URL loaded successfully');
      })
      .catch((err) => {
        console.error('Failed to load development URL:', err);
      });
    win.webContents.openDevTools(); // Open DevTools for debugging
  } else {
    console.log('Loading production build from dist/index.html');
    win.loadFile(path.join(__dirname, 'dist', 'index.html'))
      .then(() => {
        console.log('Production build loaded successfully');
      })
      .catch((err) => {
        console.error('Failed to load production build:', err);
      });
  }

  win.on('closed', () => {
    console.log('Window closed');
  });
}

app.whenReady()
  .then(() => {
    console.log('App is ready');
    createWindow();
  })
  .catch((err) => {
    console.error('Error starting app:', err);
  });

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});