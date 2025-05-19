import path from 'path';
import { fileURLToPath } from 'url';
import { app, BrowserWindow } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 500,
    minHeight: 500,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setMenu(null);
  win.loadFile(path.join(__dirname, 'dist', 'index.html'), {
    baseURLForDataURL: `file://${path.join(__dirname, 'dist')}/`,
  });

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
