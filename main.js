const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
    return;
}

let mainWindow;
let tray = null;
let forceQuit = false;

// Ensure the data directory exists
const dataDir = path.join(app.getPath('userData'), 'QuickClip');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dataFile = path.join(dataDir, 'savedItems.json');

function createWindow() {
    if (mainWindow) {
        mainWindow.show();
        return;
    }

    mainWindow = new BrowserWindow({
        width: 300,
        height: 400,
        minWidth: 200,
        minHeight: 300,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        icon: path.join(__dirname, 'icons', 'icon256.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('popup.html');

    // Create tray icon if it doesn't exist
    if (!tray) {
        tray = new Tray(path.join(__dirname, 'icons', 'icon16.png'));
        const contextMenu = Menu.buildFromTemplate([
            { 
                label: 'Show/Hide',
                click: () => mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
            },
            { type: 'separator' },
            { 
                label: 'Quit',
                click: () => {
                    forceQuit = true;
                    app.quit();
                }
            }
        ]);
        tray.setToolTip('QuickClip Sticky Notes');
        tray.setContextMenu(contextMenu);

        // Handle tray click
        tray.on('click', () => {
            mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        });
    }

    // Handle window close button
    mainWindow.on('close', (event) => {
        if (!forceQuit) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    // Handle minimize
    ipcMain.on('minimize-window', () => {
        mainWindow.minimize();
    });

    // Handle close button
    ipcMain.on('close-window', () => {
        mainWindow.hide();
    });

    // Handle quit
    ipcMain.on('quit-app', () => {
        forceQuit = true;
        app.quit();
    });
}

// Handle IPC messages for saving and loading data
ipcMain.handle('save-data', async (event, data) => {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
});

ipcMain.handle('load-data', async () => {
    try {
        if (fs.existsSync(dataFile)) {
            const data = fs.readFileSync(dataFile, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
});

// Cleanup when app is quitting
app.on('before-quit', () => {
    forceQuit = true;
});

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

// Handle second instance
app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
    }
}); 