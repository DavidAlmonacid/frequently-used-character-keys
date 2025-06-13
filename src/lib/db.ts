import Database, { type QueryResult } from "@tauri-apps/plugin-sql";

const db = await Database.load("sqlite:characters.db");

// export async function getAllCharacters() {
//   return await db.select("SELECT id, character FROM characters;");
// }

export async function addCharacter(): Promise<QueryResult> {
  // character:string
  return await db.execute("INSERT INTO characters (character) VALUES ($1)", [
    "Aaahhh"
  ]);
}
