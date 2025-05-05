const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  copyToClipboard: (text) => ipcRenderer.invoke("clipboard-copy", text),
  pasteFromClipboard: () => ipcRenderer.invoke("clipboard-paste"),
});
