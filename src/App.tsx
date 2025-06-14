import { Toaster } from "sonner";

import { Form } from "./components/Form";
import { KeyCard } from "./components/KeyCard";
import { useCharacters } from "./hooks/useCharacters";

export default function App() {
  const { characters, fetchCharacters } = useCharacters();

  return (
    <main>
      <h1 className="py-7 text-center text-3xl font-bold">
        Frequently Used Character Keys
      </h1>

      <Form characters={characters} onRefresh={fetchCharacters} />

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
