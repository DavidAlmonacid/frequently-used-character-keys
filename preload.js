// const { clipboard } = require("electron");
const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  copyToClipboard: (text) => ipcRenderer.invoke("clipboard-copy", text),
  pasteFromClipboard: () => ipcRenderer.invoke("clipboard-paste"),
});

// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electronAPI', {
//   copyToClipboard: (text) => ipcRenderer.invoke('clipboard:copy', text),
//   pasteFromClipboard: () => ipcRenderer.invoke('clipboard:paste')
// });
