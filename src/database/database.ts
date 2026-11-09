import * as SQLite from "expo-sqlite";

const dbPromise = SQLite.openDatabaseAsync("videos.db");

export type VideoRecord = {
	id: number;
	label: string;
	notes: string | null;
	file_uri: string;
	created_at: string;
};

export async function initDatabase() {
	const db = await dbPromise;

	await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      notes TEXT,
      file_uri TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

export async function addVideo(
	label: string,
	notes: string,
	fileUri: string,
) {
	const db = await dbPromise;

	const result = await db.runAsync(
		`INSERT INTO videos
     (label, notes, file_uri, created_at)
     VALUES (?, ?, ?, ?)`,
		label,
		notes,
		fileUri,
		new Date().toISOString(),
	);

	return result.lastInsertRowId;
}

export async function getVideos() {
	const db = await dbPromise;

	return await db.getAllAsync<VideoRecord>(
		`SELECT *
     FROM videos
     ORDER BY created_at DESC`,
	);
}
export async function updateVideo(id: number, label: string, notes: string) {
 const db = await dbPromise;
 await db.runAsync('UPDATE videos SET label = ?, notes = ? WHERE id = ?', label, notes, id);
}
export async function removeVideo(id: number) {
 const db = await dbPromise;
 await db.runAsync('DELETE FROM videos WHERE id = ?', id);
}
