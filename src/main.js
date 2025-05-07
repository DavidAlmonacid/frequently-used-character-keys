const { app, BrowserWindow, clipboard, ipcMain } = require("electron/main");
const path = require("node:path");

function createWindow() {
  const win = new BrowserWindow({
    width: 550,
    height: 550,
    center: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile("index.html");
}

// Handle clipboard operations

ipcMain.handle("clipboard-copy", (_, text) => {
  clipboard.writeText(text);
});

ipcMain.handle("clipboard-read", () => {
  return clipboard.readText();
});

// Handle window events

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
