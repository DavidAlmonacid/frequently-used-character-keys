// Lista de caracteres dañados (puedes modificarla según tus necesidades)
const brokenKeys = ["a", "e", "i", "o", "u", "@", "#", "$", "%", "&"];
const container = document.getElementById("keys-container");

brokenKeys.forEach((char) => {
  const btn = document.createElement("button");
  btn.textContent = char;
  btn.style.margin = "8px";

  btn.onclick = async () => {
    try {
      await window.electronAPI.copyToClipboard(char);
      btn.textContent = `✔ ${char}`;

      setTimeout(() => {
        btn.textContent = char;
      }, 800);
    } catch (error) {
      console.error("Clipboard operation failed:", error);
    }
  };

  container.appendChild(btn);
});
