const $container = document.getElementById("keys-container");

// Function to render all buttons
const renderButtons = () => {
  // Get stored characters from local storage
  const characters = window.electronAPI.getStoredCharacters() ?? [];

  // Clear existing buttons
  $container.innerHTML = "";

  // Check if there are no keys
  if (characters.length === 0) {
    const noKeysMessage = document.createElement("p");
    noKeysMessage.textContent = "No keys added yet.";

    $container.appendChild(noKeysMessage);
    return;
  }

  // Render character buttons
  characters.forEach((char) => {
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

    $container.appendChild(btn);
  });
};

// Add input and save button
const addInputForm = () => {
  const formContainer = document.createElement("div");
  formContainer.style.marginTop = "20px";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter new character";
  input.maxLength = 1;

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add";
  addBtn.style.marginLeft = "8px";

  addBtn.onclick = (event) => {
    event.preventDefault();
    const newChar = input.value.trim();

    if (newChar.length > 1) {
      alert("Please enter only one character.");
      return;
    }

    const characters = window.electronAPI.getStoredCharacters() ?? [];

    if (newChar !== "" && !characters.includes(newChar)) {
      window.electronAPI.addCharacter(newChar);
      input.value = "";
      renderButtons();
    }
  };

  formContainer.appendChild(input);
  formContainer.appendChild(addBtn);
  document.body.appendChild(formContainer);
};

// Initialize the UI
renderButtons();
addInputForm();
