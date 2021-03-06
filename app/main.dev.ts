/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const appDataFolder = path.join(app.getPath('userData'), '/Luach');
const GLOBALS = Object.freeze({
  IS_MAC: process.platform === 'darwin',
  VALID_PIN: /^\d{4,}$/,
  APPDATA_FOLDER: appDataFolder,
  INITIAL_DB_PATH: path.join(app.getAppPath(), '/luachData.sqlite'),
  DEFAULT_DB_PATH: path.join(appDataFolder, '/luachData.sqlite')
});

const firstRunFileName = path.join(GLOBALS.APPDATA_FOLDER, 'firstTimeRan');
const isFirstTimeRun = () => !fs.existsSync(firstRunFileName);
const afterFirstRun = () => {
  if (!fs.existsSync(GLOBALS.APPDATA_FOLDER)) {
    fs.mkdir(GLOBALS.APPDATA_FOLDER, { recursive: true }, err => {
      if (err) throw err;
    });
  }
  fs.writeFileSync(firstRunFileName, '');
};
const isFirstRun = isFirstTimeRun();

console.log(GLOBALS);
console.log(`main.dev.ts: firstRunFileName=${firstRunFileName}`);
console.log(`main.dev.ts: isFirstRun=${isFirstRun}`);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: path.join(__dirname, '/scroll.png'),
    webPreferences:
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js')
          }
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */
ipcMain.on('openFile', async (event, options) => {
  const { dialog } = require('electron');
  const results = await dialog.showOpenDialog(mainWindow, options);
  console.log(`An openFile call ocurred`);
  if (results.filePaths) {
    console.log(`File chosen: ${results.filePaths[0]}`);
    const fs = require('fs');
    fs.readFile(results.filePaths[0], 'utf-8', (err, data) => {
      if (err) {
        console.error(`An error ocurred reading the file :${err.message}`);
        return;
      }
      event.reply('openFileReply', { data });
    });
  }
});

ipcMain.on('messageBox', async (event, options) => {
  const { dialog } = require('electron');
  const results = await dialog.showMessageBox(mainWindow, options);
  console.log(`An openFile call ocurred`);
  event.returnValue = results.response === 0;
});

ipcMain.on('getPath', (event, arg) => {
  event.returnValue = app.getPath(arg);
});

ipcMain.on('getGlobals', event => {
  event.returnValue = GLOBALS;
});

ipcMain.on('getIsFirstRun', event => {
  event.returnValue = isFirstRun;
});

ipcMain.on('setAfterFirstRun', () => {
  afterFirstRun();
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
