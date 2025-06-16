const {
  app,
  BrowserWindow,
  clipboard,
  ipcMain,
  nativeImage
} = require("electron");
const path = require("node:path");

function createWindow() {
  const isDev = !app.isPackaged;

  const iconPath = isDev
    ? path.join(__dirname, "..", "build", "icons", "app.png")
    : path.join(process.resourcesPath, "build", "icons", "app.png");

  const appIcon = nativeImage.createFromPath(iconPath);

  const win = new BrowserWindow({
    width: 575,
    height: 700,
    center: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: appIcon
  });

  win.loadFile(path.join(__dirname, "index.html"));
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
