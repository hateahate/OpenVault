// storage/notesDb.js

import { openDatabaseSync } from 'expo-sqlite';
import { encrypt as aesEncrypt, decrypt as aesDecrypt } from '../utils/crypto/aesUtils';

const db = openDatabaseSync('notes.db');

/**
 * Инициализация БД и создание таблицы notes, если её нет.
 */
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
    // Если вы обновляете старую версию без колонки encrypted, раскомментируйте:
    // try { await db.runAsync(`ALTER TABLE notes ADD COLUMN encrypted INTEGER DEFAULT 0;`); } catch {}
  } catch (error) {
    console.error('Error creating notes table:', error);
  }
}

/**
 * Добавление новой заметки (изначально незашифрованной).
 */
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

/**
 * Получение списка всех заметок.
 * Если заметка зашифрована — content возвращается как null,
 * и в объекте есть encrypted = true.
 */
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

/**
 * Обновление существующей заметки: изменяем title/content и сбрасываем флаг encrypted.
 */
export async function updateNote(id, { title, content }) {
  try {
    await db.runAsync(
      `UPDATE notes
          SET title     = ?,
              content   = ?,
              encrypted = 0
        WHERE id = ?`,
      [title, content, id]
    );
  } catch (error) {
    console.error('Update note error:', error);
  }
}

/**
 * Удаление заметки по id.
 */
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

/* ──────────────── ШИФРОВАНИЕ ──────────────── */

/**
 * Шифрует существующую незашифрованную заметку и выставляет encrypted=1.
 * @param {number} id — идентификатор заметки
 * @param {string} password — пароль для AES
 * @returns {boolean} — true, если успешно, false при ошибке
 */
export async function encryptNote(id, password) {
  try {
    const row = await db.getFirstAsync(
      `SELECT content, encrypted FROM notes WHERE id = ?`,
      [id]
    );
    if (!row || row.encrypted) {
      // либо нет такой записи, либо уже зашифровано
      return false;
    }
    const cipher = aesEncrypt(row.content, password);
    await db.runAsync(
      `UPDATE notes
          SET content   = ?,
              encrypted = 1
        WHERE id = ?`,
      [cipher, id]
    );
    return true;
  } catch (error) {
    console.error('encryptNote error:', error);
    return false;
  }
}

/**
 * Расшифровывает содержимое зашифрованной заметки и возвращает plain text.
 * Флаг encrypted в БД не сбрасывается.
 * @param {number} id — идентификатор заметки
 * @param {string} password — пароль для AES
 * @returns {string|null} — расшифрованный текст или null при неверном пароле/ошибке
 */
export async function decryptNoteContent(id, password) {
  try {
    const row = await db.getFirstAsync(
      `SELECT content, encrypted FROM notes WHERE id = ?`,
      [id]
    );
    if (!row || !row.encrypted) {
      // либо нет записи, либо она не зашифрована
      return row ? row.content : null;
    }
    const plain = aesDecrypt(row.content, password);
    return plain === '' ? null : plain;
  } catch (error) {
    console.error('decryptNoteContent error:', error);
    return null;
  }
}
