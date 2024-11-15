//const { app, BrowserWindow, autoUpdater, dialog } = require('electron');



import { app, BrowserWindow, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
const path = require('node:path');
import logger from 'electron-log';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (process.platform == 'win32') {
  if (require('electron-squirrel-startup')) {
    app.quit();
  }

}
logger.transports.console.level = false;

const testDialog = () => {
  dialog.showMessageBox({
    message: 'test dialog'
  })
};

const checkUpdates = () => {
  /*
  const server = 'https://github.com/Kalafatlar/kalafatlarTest'
  const url = `${server}/update/${process.platform}/${app.getVersion()}`

  autoUpdater.setFeedURL({ url })
  */
  
  logger.info('check updated çalıştı');
  autoUpdater.channel = 'latest'
  autoUpdater.allowDowngrade = false
  testDialog();
  autoUpdater.logger = logger
  autoUpdater.logger.transports.file.level = 'debug'
  //autoUpdater.logger.transports.file.appName = 'private repo'
  autoUpdater.autoDownload = true
  autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      message: 'update not available !!'
    })
  })

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      message: 'update Downloaded !!'
    })
  })

  autoUpdater.on('checking-for-update', () => {
    dialog.showMessageBox({
      message: 'CHECKING FOR UPDATES !!'
    })
  })

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      message: ' update-available !!'
    })
  })

  autoUpdater.on('error', (error) => {
    autoUpdater.logger.debug(error)
  })
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
 
  logger.info('log çalıştı');
  logger.warn('burası çalıştı')
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    logger.info('test')
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('ready', () => {
  if (process.env.NODE_ENV === 'development') testDialog();
  if (process.env.NODE_ENV === 'production') checkUpdates();
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
