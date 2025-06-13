import { useEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

import { addCharacter, getAllCharacters } from "./lib/db";
import { isSingleCharacterOrEmoji } from "./lib/validateInput";

function App() {
  const [characters, setCharacters] = useState<Array<Character>>([]);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const fetcCharacters = async () => {
    try {
      const response = await getAllCharacters();
      setCharacters(response);
    } catch (error) {
      throw new Error(
        `Error getting the characters from the database. Cause ${error}`
      );
    }
  };

  useEffect(() => {
    fetcCharacters();
  }, []);

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    const userInput = inputValue.trim();

    if (userInput.length === 0) {
      console.error("Enter a character or emoji.");
      setInputValue("");
      return;
    }

    if (!isSingleCharacterOrEmoji(userInput)) {
      inputRef.current?.setCustomValidity(
        "Please enter a single character or emoji."
      );
      inputRef.current?.reportValidity();
      return;
    }

    const characterExists = characters.some((character) => {
      return character.character === userInput;
    });

    if (characterExists) {
      console.error("Character already exists.");
    } else {
      await addCharacter(userInput);
      await fetcCharacters();
    }

    setInputValue("");
  };

  const handleInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    inputRef.current?.setCustomValidity("");
    inputRef.current?.reportValidity();

    setInputValue(event.currentTarget.value);
  };

  return (
    <main>
      <h1 className="py-7 text-center text-3xl font-bold">
        Frequently Used Character Keys
      </h1>

      <form
        className="flex justify-center gap-x-2 py-4"
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          className="w-40 rounded-2xl border border-indigo-300 bg-indigo-100 py-1.5 text-center text-base text-slate-800"
          type="text"
          placeholder="Enter character"
          maxLength={15}
          value={inputValue}
          onInput={handleInput}
          required
        />

        <button
          className="rounded-2xl border border-blue-200 bg-blue-400 px-5 text-sm text-yellow-50 active:scale-95 active:transition-transform disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
          type="submit"
          disabled={inputValue.length === 0}
        >
          Add
        </button>
      </form>
    </main>
  );
}

export default App;
