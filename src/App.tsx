import { useEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import { Toaster, toast } from "sonner";

import { KeyCard } from "./components/KeyCard";
import { ToastMessage } from "./components/ToastMessage";
import { addCharacter, getAllCharacters } from "./lib/db";
import { isSingleCharacterOrEmoji } from "./lib/validateInput";

export default function App() {
  const [characters, setCharacters] = useState<Array<Character>>([]);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const fetchCharacters = async () => {
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
    fetchCharacters();
  }, []);

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    const userInput = inputValue.trim();

    if (userInput.length === 0) {
      toast.error(<ToastMessage message="Enter a character or emoji" />, {
        duration: 2500
      });
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
      toast.warning(<ToastMessage message="Character already exists" />, {
        duration: 2500
      });
    } else {
      await addCharacter(userInput);
      await fetchCharacters();
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

      <section className="grid grid-cols-(--grid-cols) justify-center gap-x-8 gap-y-5 py-5">
        {characters.length > 0 ? (
          characters.map((character) => (
            <KeyCard
              key={character.id}
              character={character}
              onRefresh={fetchCharacters}
            />
          ))
        ) : (
          <p className="col-span-full justify-self-center">
            No keys added yet.
          </p>
        )}
      </section>

      <Toaster position="top-right" visibleToasts={5} richColors />
    </main>
  );
}
