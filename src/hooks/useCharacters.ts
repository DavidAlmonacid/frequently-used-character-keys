import { useEffect, useState } from "preact/hooks";
import { getAllCharacters } from "../lib/db";

export function useCharacters() {
  const [characters, setCharacters] = useState<Array<Character>>([]);

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

  return { characters, fetchCharacters };
}
