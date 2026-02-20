import { app, BrowserWindow } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    const devServerUrl = process.env.VITE_DEV_SERVER_URL || process.env.ELECTRON_RENDERER_URL;

    mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
        console.error('[Electron] Échec de chargement renderer:', { errorCode, errorDescription, validatedURL });
    });

    if (!app.isPackaged && devServerUrl) {
        mainWindow.loadURL(devServerUrl);
        return;
    }

    const distIndexPath = path.join(__dirname, 'dist', 'index.html');

    // Fallback explicite pour éviter un écran bloqué si le build n'a pas été généré.
    if (!fs.existsSync(distIndexPath)) {
        mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(
            '<h2>Build introuvable</h2><p>Exécutez <code>npm run build</code> avant de lancer Electron.</p>'
        ));
        return;
    }

    mainWindow.loadFile(distIndexPath);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
