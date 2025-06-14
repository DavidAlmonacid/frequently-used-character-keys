type ToastMessageProps = {
  message: string;
  character?: string;
};

export function ToastMessage({ message, character }: ToastMessageProps) {
  return (
    <p className="text-sm font-semibold">
      {message}
      {character && (
        <>
          {" "}
          <code className="rounded-sm bg-yellow-200/60 px-1 py-[3px] text-base/tight">
            {character}
          </code>
        </>
      )}
      .
    </p>
  );
}
