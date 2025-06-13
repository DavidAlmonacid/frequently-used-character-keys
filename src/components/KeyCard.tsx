import trashIcon from "../assets/trash.svg";

type KeyCardProps = {
  character: string;
  onDeleteClick: () => void;
};

export function KeyCard({ character, onDeleteClick }: KeyCardProps) {
  const handleCopy = (character: string) => {
    throw new Error("Function not implemented.");
  };

  return (
    <article className="flex flex-col items-center gap-y-2.5">
      <button
        className="shadow-key aspect-square size-(--key-size) rounded-2xl border border-black bg-yellow-50 text-2xl/tight font-bold text-black active:translate-[1px] active:scale-[0.99]"
        onClick={() => handleCopy(character)}
      >
        {character}
      </button>

      <button
        className="flex translate-x-[2.5px] rounded-sm border border-black bg-pink-400 px-1 py-0.5 active:scale-95 active:transition-transform"
        onClick={onDeleteClick}
      >
        <img width="20" height="20" src={trashIcon} alt="Delete" />
      </button>
    </article>
  );
}
