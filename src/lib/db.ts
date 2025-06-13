import Database, { type QueryResult } from "@tauri-apps/plugin-sql";

const db = await Database.load("sqlite:characters.db");

export async function getAllCharacters(): Promise<Array<Character>> {
  return await db.select("SELECT id, character FROM characters;");
}

export async function addCharacter(character: string): Promise<QueryResult> {
  return await db.execute("INSERT INTO characters (character) VALUES ($1);", [
    character
  ]);
}

export async function deleteCharacter(id: number) {
  return await db.execute("DELETE FROM characters WHERE id = $1;", [id]);
}
