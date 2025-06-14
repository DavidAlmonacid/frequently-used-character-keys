import Database, { type QueryResult } from "@tauri-apps/plugin-sql";

let dbPromise: Promise<Database> | null = null;

function getDb(): Promise<Database> {
  if (dbPromise === null) {
    dbPromise = Database.load("sqlite:characters.db");
  }

  return dbPromise;
}

export async function getAllCharacters(): Promise<Array<Character>> {
  const db = await getDb();
  return await db.select("SELECT id, character FROM characters;");
}

export async function addCharacter(character: string): Promise<QueryResult> {
  const db = await getDb();
  return await db.execute("INSERT INTO characters (character) VALUES ($1);", [
    character
  ]);
}

export async function deleteCharacter(id: number) {
  const db = await getDb();
  return await db.execute("DELETE FROM characters WHERE id = $1;", [id]);
}
