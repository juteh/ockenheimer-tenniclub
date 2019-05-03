import {app, BrowserWindow, ipcMain} from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow;

app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function createWindow() {
  win = new BrowserWindow(
      {width: 1280, height: 800, webPreferences: {nodeIntegration: true}});

  win.loadURL(url.format({
    pathname: path.join(__dirname, `/../../dist/angular-electron/index.html`),
    protocol: 'file:',
    slashes: true
  }));

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

ipcMain.on('getFiles', (event, arg) => {
  const files = fs.readdirSync(__dirname);
  win.webContents.send('getFilesResponse', files);
});

ipcMain.on('getFile', (event, path: string) => {
  console.log(__dirname + path);
  fs.readFile(__dirname + path, 'utf8', function(err, data) {
    if (err) {
      win.webContents.send('getFileResponse', err);
    }
    win.webContents.send('getFileResponse', data.toString());
  });
});

ipcMain.on('updateFile', (event, path: string, fileText: string) => {
  try {
    fs.writeFileSync(__dirname + path, fileText, 'utf-8');
    win.webContents.send('updateFileResponse', 'Save successfull');
  } catch (e) {
    win.webContents.send('updateFileResponse', 'Failed to save the file !');
  }
});


