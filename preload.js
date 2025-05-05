// const { clipboard } = require("electron");
const { clipboard } = require("electron");
const { contextBridge } = require("electron/renderer");

contextBridge.exposeInMainWorld("copy", {
  toClipboard: (text) => clipboard.writeText(text, "selection"),
});
