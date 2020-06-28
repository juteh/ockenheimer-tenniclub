"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
var url = require("url");
var win;
electron_1.app.on('ready', createWindow);
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
function createWindow() {
    win = new electron_1.BrowserWindow({ width: 1280, height: 800, webPreferences: { nodeIntegration: true } });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/../../dist/angular-electron/index.html"),
        protocol: 'file:',
        slashes: true
    }));
    win.webContents.openDevTools();
    win.on('closed', function () {
        win = null;
    });
}
electron_1.ipcMain.on('getFiles', function (event, arg) {
    var files = fs.readdirSync(__dirname);
    win.webContents.send('getFilesResponse', files);
});
electron_1.ipcMain.on('getFile', function (event, path) {
    fs.readFile(__dirname + path, 'utf8', function (err, data) {
        if (err) {
            win.webContents.send('getFileResponse', err);
        }
        win.webContents.send('getFileResponse', data.toString());
    });
});
electron_1.ipcMain.on('updateFile', function (event, path, fileText) {
    try {
        fs.writeFileSync(__dirname + path, fileText, 'utf-8');
        win.webContents.send('updateFileResponse', 'Save successfull');
    }
    catch (e) {
        win.webContents.send('updateFileResponse', 'Failed to save the file !');
    }
});
//# sourceMappingURL=main.js.map