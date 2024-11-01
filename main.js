const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false
        }
    });

    mainWindow.loadFile('src/Whether.html');
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle weather data saved event
ipcMain.on('weather-data-saved', () => {
    // Refresh saved-weather window if it exists
    const savedWeatherWindow = BrowserWindow.getAllWindows()
        .find(win => win.getTitle().includes('Saved Weather Data'));
    
    if (savedWeatherWindow) {
        savedWeatherWindow.reload();
    }
}); 