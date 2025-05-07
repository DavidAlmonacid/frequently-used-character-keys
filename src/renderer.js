// Function to show a toast
function showToast({ message, type, duration = 5000 }) {
  const toastId = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const $container = document.createElement("div");
  $container.id = toastId;
  $container.className = "toast_container";
  $container.setAttribute("type", type);

  const $text = document.createElement("p");
  $text.innerHTML = message;

  $container.appendChild($text);
  document.body.appendChild($container);

  setTimeout(() => {
    const toast = document.getElementById(toastId);
    toast.remove();
  }, duration);
}

// Function to render all buttons
function renderButtons() {
  const characters = window.electronAPI.getStoredCharacters() ?? [];

  const $keysContainer = document.getElementById("keys-container");
  $keysContainer.innerHTML = "";

  // Check if there are no keys
  if (characters.length === 0) {
    const $noKeysMessage = document.createElement("p");
    $noKeysMessage.textContent = "No keys added yet.";

    $keysContainer.appendChild($noKeysMessage);
    return;
  }

  // Render character buttons
  characters.forEach((char) => {
    const $keyCard = document.createElement("article");
    $keyCard.className = "key_card";

    const $keyBtn = document.createElement("button");
    $keyBtn.className = "key_main";
    $keyBtn.textContent = char;

    const $deleteBtn = document.createElement("button");
    $deleteBtn.className = "key_delete";
    $deleteBtn.textContent = "Delete";

    $keyBtn.onclick = async () => {
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
          message: `Character <code>${char}</code> copied successfully!`,
          type: "success"
        });

        // Disable the button temporarily
        $keyBtn.disabled = true;

        setTimeout(() => {
          $keyBtn.disabled = false;
        }, 5000);
      } catch (error) {
        console.error("Clipboard operation failed:", error);
      }
    };

    $keyCard.appendChild($keyBtn);
    $keyCard.appendChild($deleteBtn);
    $keysContainer.appendChild($keyCard);
  });
}

// Add input and save button
function addInputForm() {
  const $formContainer = document.getElementById("form-container");
  const $form = document.createElement("form");

  const $input = document.createElement("input");
  $input.type = "text";
  $input.placeholder = "Enter character";
  $input.maxLength = 1;

  const $addBtn = document.createElement("button");
  $addBtn.type = "submit";
  $addBtn.textContent = "Add";
  $addBtn.disabled = true;

  function rollbackInput() {
    $input.value = "";
    $addBtn.disabled = true;
  }

  $input.oninput = () => {
    $input.setCustomValidity("");
    $input.reportValidity();

    $addBtn.disabled = $input.value.length === 0;
  };

  $form.onsubmit = (event) => {
    event.preventDefault();
    const newChar = $input.value.trim();

    if (newChar.length === 0) {
      rollbackInput();

      showToast({
        message: "Enter a character.",
        type: "error",
        duration: 2500
      });

      return;
    }

    if (newChar.length > 1) {
      $input.setCustomValidity("Enter only one character.");
      $input.reportValidity();
      $input.maxLength = 1;
      rollbackInput();

      return;
    }

    const characters = window.electronAPI.getStoredCharacters() ?? [];

    if (newChar !== "") {
      if (characters.includes(newChar)) {
        showToast({
          message: "Character already exists.",
          type: "warning",
          duration: 2500
        });

        rollbackInput();
      } else {
        window.electronAPI.addCharacter(newChar);

        rollbackInput();
        renderButtons();
      }
    }
  };

  $form.appendChild($input);
  $form.appendChild($addBtn);
  $formContainer.appendChild($form);
}

// Initialize the UI
renderButtons();
addInputForm();
