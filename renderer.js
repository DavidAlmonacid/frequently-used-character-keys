const $container = document.getElementById("keys-container");

// Function to show a toast
function showToast({ message, type, duration = 5000 }) {
  const toastId = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const $container = document.createElement("div");
  $container.id = toastId;
  $container.className = "toast_container";
  $container.setAttribute("type", type);
  $container.style.background = "darkslategrey";

  const $text = document.createElement("p");
  $text.textContent = message;

  $container.appendChild($text);
  document.body.appendChild($container);

  setTimeout(() => {
    const toast = document.getElementById(toastId);
    toast.remove();
  }, duration);
}

// Function to render all buttons
function renderButtons() {
  // Get stored characters from local storage
  const characters = window.electronAPI.getStoredCharacters() ?? [];

  // Clear existing buttons
  $container.innerHTML = "";

  // Check if there are no keys
  if (characters.length === 0) {
    const $noKeysMessage = document.createElement("p");
    $noKeysMessage.textContent = "No keys added yet.";

    $container.appendChild($noKeysMessage);
    return;
  }

  // Render character buttons
  characters.forEach((char) => {
    const $btn = document.createElement("button");
    $btn.textContent = char;
    $btn.style.margin = "8px";

    $btn.onclick = async () => {
      try {
        if ((await window.electronAPI.getFromClipboard()) === char) {
          showToast({
            message: "Character already in clipboard!",
            type: "warning",
            duration: 2500
          });

          return;
        }

        await window.electronAPI.copyToClipboard(char);
        showToast({
          message: `Character ${char} copied successfully!`,
          type: "success"
        });

        // Disable the button temporarily
        $btn.disabled = true;

        setTimeout(() => {
          $btn.disabled = false;
        }, 5000);
      } catch (error) {
        console.error("Clipboard operation failed:", error);
      }
    };

    $container.appendChild($btn);
  });
}

// Add input and save button
function addInputForm() {
  const $formContainer = document.createElement("form");
  $formContainer.style.marginTop = "20px";

  const $input = document.createElement("input");
  $input.type = "text";
  $input.placeholder = "Enter new character";
  $input.maxLength = 1;
  $input.autofocus = true;

  const $addBtn = document.createElement("button");
  $addBtn.type = "submit";
  $addBtn.textContent = "Add";
  $addBtn.style.marginLeft = "8px";

  $formContainer.onsubmit = (event) => {
    event.preventDefault();
    const newChar = $input.value.trim();

    if (newChar.length > 1) {
      alert("Please enter only one character.");
      return;
    }

    const characters = window.electronAPI.getStoredCharacters() ?? [];

    if (newChar !== "" && !characters.includes(newChar)) {
      window.electronAPI.addCharacter(newChar);
      $input.value = "";
      renderButtons();
    }
  };

  $formContainer.appendChild($input);
  $formContainer.appendChild($addBtn);
  document.body.appendChild($formContainer);
}

// Initialize the UI
renderButtons();
addInputForm();
