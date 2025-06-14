import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";
import { toast } from "sonner";

import { deleteCharacter } from "../lib/db";
import { ToastMessage } from "./ToastMessage";

import trashIcon from "../assets/trash.svg";

type KeyCardProps = {
  character: Character;
  onRefresh: () => Promise<void>;
};

export function KeyCard({ character, onRefresh }: KeyCardProps) {
  const { id, character: char } = character;

  const handleCopy = async (character: string) => {
    try {
      if ((await invoke<string>("read_from_clipboard")) === character) {
        toast.warning(
          <ToastMessage
            message="You've already copied the character"
            character={character}
          />
        );
        return;
      }

      await invoke("copy_to_clipboard", { character });

      toast.success(
        <ToastMessage
          message="You've successfully copied the character"
          character={character}
        />
      );
    } catch (error) {
      throw new Error(`Error copying to clipboard. Cause: ${error}`);
    }
  };

  const handleDelete = async () => {
    const confirmation = await confirm(
      `You are about to delete the '${char}' key. Are you sure?`,
      { title: "Confirm Delete", kind: "warning" }
    );

    if (!confirmation) {
      return;
    }

    try {
      await deleteCharacter(id);
      await onRefresh();

      toast.info(
        <ToastMessage message="You've deleted the character" character={char} />
      );
    } catch (error) {
      throw new Error(`Something went wrong. Cause: ${error}`);
    }
  };

  return (
    <article className="flex flex-col items-center gap-y-2.5">
      <button
        className="shadow-key aspect-square size-(--key-size) rounded-2xl border border-black bg-yellow-50 text-2xl/tight font-bold text-black active:translate-[1px] active:scale-[0.99]"
        onClick={() => handleCopy(char)}
      >
        {char}
      </button>

      <button
        className="flex translate-x-[2.5px] rounded-sm border border-black bg-pink-400 px-1 py-0.5 active:scale-95 active:transition-transform"
        onClick={handleDelete}
      >
        <img width="20" height="20" src={trashIcon} alt="Delete icon" />
      </button>
    </article>
  );
}
