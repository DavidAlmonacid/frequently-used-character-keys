// Lista de caracteres dañados (puedes modificarla según tus necesidades)
const brokenKeys = ["a", "e", "i", "o", "u", "@", "#", "$", "%", "&"];

const container = document.getElementById("keys-container");

brokenKeys.forEach((char) => {
  const btn = document.createElement("button");
  btn.textContent = char;
  btn.style.margin = "8px";
  btn.onclick = () => {
    window.copy.toClipboard(char);
    btn.textContent = `✔ ${char}`;
    setTimeout(() => {
      btn.textContent = char;
    }, 800);

    const text = clipboard.readText();
    console.log(text);
  };
  container.appendChild(btn);
});
