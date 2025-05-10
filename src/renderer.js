// Function to show a toast
function showToast({ message, type, duration = 5_000 }) {
  const toastId = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const $toastContainer = document.getElementById("toast-container");

  const $toast = document.createElement("div");
  $toast.id = toastId;
  $toast.className = "toast";
  $toast.setAttribute("type", type);

  const $text = document.createElement("p");
  $text.innerHTML = message;

  $toast.appendChild($text);
  $toastContainer.appendChild($toast);

  setTimeout(() => {
    const $toastEl = document.getElementById(toastId);
    $toastEl.remove();
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
  $input.maxLength = 15;

  const $addBtn = document.createElement("button");
  $addBtn.type = "submit";
  $addBtn.textContent = "Add";
  $addBtn.disabled = true;

  /**
   * @param {string} userInput
   */
  function isSingleCharacterOrEmoji(userInput) {
    const segementer = new Intl.Segmenter();
    const iterator = segementer.segment(userInput)[Symbol.iterator]();

    let count = 0;
    let segmentDone = iterator.next().done;

    while (segmentDone !== true) {
      if (++count >= 2) {
        return false;
      }

      segmentDone = iterator.next().done;
    }

    return true;
  }

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
    const userInput = $input.value.trim();

    if (userInput.length === 0) {
      showToast({
        message: "Enter a character or emoji.",
        type: "error",
        duration: 2500
      });
      rollbackInput();
      return;
    }

    if (!isSingleCharacterOrEmoji(userInput)) {
      $input.setCustomValidity("Enter only one character or an emoji.");
      $input.reportValidity();
      return;
    }

    const characters = window.electronAPI.getStoredCharacters() ?? [];

    if (characters.includes(userInput)) {
      showToast({
        message: "Character already exists.",
        type: "warning",
        duration: 2500
      });

      rollbackInput();
    } else {
      window.electronAPI.addCharacter(userInput);

      rollbackInput();
      renderButtons();
    }
  };

  $form.appendChild($input);
  $form.appendChild($addBtn);
  $formContainer.appendChild($form);
}

// Initialize the UI
renderButtons();
addInputForm();
