import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";
import { toast } from "sonner";

import { deleteCharacter } from "../lib/db";

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
          <p className="text-sm">
            Character{" "}
            <code className="rounded-sm bg-yellow-200/80 px-1 py-[3px] text-base/tight">
              {character}
            </code>{" "}
            already in clipboard!
          </p>
        );
        return;
      }

      await invoke("copy_to_clipboard", { character });

      toast.success(
        <p className="text-sm">
          Character{" "}
          <code className="rounded-sm bg-yellow-200/80 px-1 py-[3px] text-base/tight">
            {character}
          </code>{" "}
          copied successfully!
        </p>
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

    await deleteCharacter(id);
    await onRefresh();

    toast.info(
      <p className="text-sm">
        Character{" "}
        <code className="rounded-sm bg-yellow-200/80 px-1 py-[3px] text-base/tight">
          {char}
        </code>{" "}
        deleted.
      </p>
    );
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
