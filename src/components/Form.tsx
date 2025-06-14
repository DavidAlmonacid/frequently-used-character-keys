import { useRef, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import { toast } from "sonner";

import { addCharacter } from "../lib/db";
import { isSingleCharacterOrEmoji } from "../lib/validateInput";
import { ToastMessage } from "./ToastMessage";

type FormProps = {
  characters: Array<Character>;
  onRefresh: () => Promise<void>;
};

export function Form({ characters, onRefresh }: FormProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
      await onRefresh();
    }

    setInputValue("");
  };

  const handleInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    inputRef.current?.setCustomValidity("");
    inputRef.current?.reportValidity();

    setInputValue(event.currentTarget.value);
  };

  return (
    <form className="flex justify-center gap-x-2 py-4" onSubmit={handleSubmit}>
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
  );
}
