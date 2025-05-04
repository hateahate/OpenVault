// storage/notesDb.js
import { openDatabaseSync } from 'expo-sqlite';
import CryptoJS from 'crypto-js';

const db = openDatabaseSync('notes.db');

// Шифрование текста (AES) без использования случайных чисел
function encrypt(text, password) {
  const key = CryptoJS.enc.Utf8.parse(password.padEnd(32, ' '));
  const iv = CryptoJS.enc.Utf8.parse('0000000000000000');
  return CryptoJS.AES.encrypt(text, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString();
}

// Расшифровка текста (AES)
function decrypt(cipher, password) {
  try {
    const key = CryptoJS.enc.Utf8.parse(password.padEnd(32, ' '));
    const iv = CryptoJS.enc.Utf8.parse('0000000000000000');
    const bytes = CryptoJS.AES.decrypt(cipher, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return null;
  }
}

// Создание таблицы (с флагом encrypted)
export async function initNotesDb() {
  try {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        encrypted INTEGER DEFAULT 0,
        created_at TEXT
      );
    `);
  } catch (error) {
    console.error('Error creating notes table:', error);
  }
}

// Добавление заметки
export async function addNote({ title, content }) {
  try {
    await db.runAsync(
      `INSERT INTO notes (title, content, encrypted, created_at) VALUES (?, ?, 0, datetime('now'))`,
      [title, content]
    );
  } catch (error) {
    console.error('Add note error:', error);
  }
}

// Получение всех заметок
export async function getNotes() {
  try {
    const result = await db.getAllAsync(
      'SELECT * FROM notes ORDER BY created_at DESC'
    );
    return result.map(note => ({
      ...note,
      encrypted: !!note.encrypted,
      ciphertext: note.encrypted ? note.content : null,
      content: note.encrypted ? null : note.content
    }));
  } catch (error) {
    console.error('Get notes error:', error);
    return [];
  }
}

// Удаление заметки
export async function deleteNote(id) {
  try {
    await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
  } catch (error) {
    console.error('Delete note error:', error);
  }
}

// Обновление заметки
export async function updateNote(id, { title, content }) {
  try {
    await db.runAsync(
      `UPDATE notes SET title = ?, content = ?, encrypted = 0 WHERE id = ?`,
      [title, content, id]
    );
  } catch (error) {
    console.error('Update note error:', error);
  }
}

// Шифрование/дешифровка заметки
export async function toggleEncryption(id, password) {
  try {
    const result = await db.getFirstAsync('SELECT content, encrypted FROM notes WHERE id = ?', [id]);
    if (!result) return false;

    const { content, encrypted } = result;

    if (encrypted) {
      // Расшифровка
      const plain = decrypt(content, password);
      if (plain === null) return false;
      await db.runAsync('UPDATE notes SET content = ?, encrypted = 0 WHERE id = ?', [plain, id]);
    } else {
      // Шифрование
      const cipher = encrypt(content, password);
      await db.runAsync('UPDATE notes SET content = ?, encrypted = 1 WHERE id = ?', [cipher, id]);
    }
    return true;
  } catch (error) {
    console.error('Toggle encryption error:', error);
    return false;
  }
}
