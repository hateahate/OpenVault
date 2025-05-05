import { openDatabaseSync } from 'expo-sqlite';
import { encrypt as aesEncrypt, decrypt as aesDecrypt } from '../utils/crypto/aesUtils';

const db = openDatabaseSync('notes.db');

export async function initNotesDb() {
  try {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        title       TEXT,
        content     TEXT,
        encrypted   INTEGER DEFAULT 0,
        created_at  TEXT
      );
    `);
  } catch (error) {
    console.error('Error creating notes table:', error);
  }
}

export async function addNote({ title, content }) {
  try {
    await db.runAsync(
      `INSERT INTO notes (title, content, encrypted, created_at)
         VALUES (?, ?, 0, datetime('now'))`,
      [title, content]
    );
  } catch (error) {
    console.error('Add note error:', error);
  }
}

export async function getNotes() {
  try {
    const rows = await db.getAllAsync(
      `SELECT id, title, content, encrypted, created_at
         FROM notes
        ORDER BY created_at DESC`
    );
    return rows.map(n => ({
      ...n,
      encrypted: !!n.encrypted,
      content: n.encrypted ? null : n.content
    }));
  } catch (error) {
    console.error('Get notes error:', error);
    return [];
  }
}

export async function getNoteById(id) {
  try {
    const row = await db.getFirstAsync(
      `SELECT * FROM notes WHERE id = ?`,
      [id]
    );
    return row || null;
  } catch (error) {
    console.error('Get note by ID error:', error);
    return null;
  }
}

export async function updateNote(id, { title, content, resetEncryption = false }) {
  try {
    if (resetEncryption) {
      await db.runAsync(
        `UPDATE notes SET title = ?, content = ?, encrypted = 0 WHERE id = ?`,
        [title, content, id]
      );
    } else {
      await db.runAsync(
        `UPDATE notes SET title = ?, content = ? WHERE id = ?`,
        [title, content, id]
      );
    }
  } catch (error) {
    console.error('Update note error:', error);
  }
}

export async function deleteNote(id) {
  try {
    await db.runAsync(
      `DELETE FROM notes WHERE id = ?`,
      [id]
    );
  } catch (error) {
    console.error('Delete note error:', error);
  }
}

export async function encryptNote(id, password) {
  try {
    const note = await db.getFirstAsync('SELECT content, encrypted FROM notes WHERE id = ?', [id]);
    if (!note) return false;

    if (note.encrypted) {
      const plain = aesDecrypt(note.content, password);
      if (plain === null) return false;
      await db.runAsync(
        'UPDATE notes SET content = ?, encrypted = 0 WHERE id = ?',
        [plain, id]
      );
    } else {
      const cipher = aesEncrypt(note.content, password);
      await db.runAsync(
        'UPDATE notes SET content = ?, encrypted = 1 WHERE id = ?',
        [cipher, id]
      );
    }

    return true;
  } catch (error) {
    console.error('encryptNote error:', error);
    return false;
  }
}

export async function decryptNoteContent(id, password) {
  try {
    const row = await db.getFirstAsync(
      `SELECT content, encrypted FROM notes WHERE id = ?`,
      [id]
    );
    if (!row) return null;
    if (!row.encrypted) return row.content;
    const plain = aesDecrypt(row.content, password);
    return plain === '' ? null : plain;
  } catch (error) {
    console.error('decryptNoteContent error:', error);
    return null;
  }
}