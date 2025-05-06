const { contextBridge, ipcRenderer } = require("electron/renderer");
const LOCAL_STORAGE_KEY = "character-keys";

function getStoredCharacters() {
  const storedCharacters = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (storedCharacters === null || storedCharacters === undefined) {
    return null;
  }

  const parsedCharacters = JSON.parse(storedCharacters);
  return parsedCharacters.characters;
}

function saveCharacters(characters) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ characters }));
}

function addCharacter(character) {
  const characters = getStoredCharacters();

  if (characters === null) {
    saveCharacters([character]);
    return;
  }

  if (!characters.includes(character)) {
    characters.push(character);
    saveCharacters(characters);
  }
}

function removeCharacter(character) {
  const characters = getStoredCharacters();
  const index = characters.indexOf(character);

  if (index >= 0) {
    characters.splice(index, 1);
    saveCharacters(characters);
  }
}

contextBridge.exposeInMainWorld("electronAPI", {
  copyToClipboard: (text) => ipcRenderer.invoke("clipboard-copy", text),
  getStoredCharacters,
  addCharacter,
  removeCharacter
});
