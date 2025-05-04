// storage/notesDb.js
import { openDatabaseSync } from 'expo-sqlite';
import CryptoJS from 'crypto-js';

const db = openDatabaseSync('notes.db');

// Простой ключ (в будущем можно привязать к пользователю или защищать SecureStore)
const ENCRYPTION_KEY = 'lockhive_super_secret_key';

// Шифрование текста (AES)
function encrypt(text) {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

// Расшифровка текста (AES)
function decrypt(cipher) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return '';
  }
}

// Создание таблицы
export function initNotesDb() {
  db.exec([
    {
      sql: `CREATE TABLE IF NOT EXISTS notes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT,
              content TEXT,
              created_at TEXT
            );`,
      args: []
    }
  ]);
}

// Добавление заметки
export function addNote({ title, content }, callback) {
  const encrypted = encrypt(content);
  db.exec(
    [{
      sql: `INSERT INTO notes (title, content, created_at) VALUES (?, ?, datetime('now'))`,
      args: [title, encrypted]
    }],
    false,
    (err, result) => {
      if (err) console.error('Add note error:', err);
      callback?.(result);
    }
  );
}

// Получение всех заметок
export function getNotes(callback) {
  db.exec(
    [{ sql: 'SELECT * FROM notes ORDER BY created_at DESC', args: [] }],
    true,
    (err, resultSet) => {
      if (err) {
        console.error('Get notes error:', err);
        return;
      }
      const rows = resultSet[0]?.rows || [];
      const notes = rows.map(note => ({
        ...note,
        content: decrypt(note.content)
      }));
      callback(notes);
    }
  );
}

// Удаление заметки
export function deleteNote(id, callback) {
  db.exec(
    [{ sql: 'DELETE FROM notes WHERE id = ?', args: [id] }],
    false,
    (err, result) => {
      if (err) console.error('Delete note error:', err);
      callback?.(result);
    }
  );
}

// Обновление заметки
export function updateNote(id, { title, content }, callback) {
  const encrypted = encrypt(content);
  db.exec(
    [{
      sql: `UPDATE notes SET title = ?, content = ? WHERE id = ?`,
      args: [title, encrypted, id]
    }],
    false,
    (err, result) => {
      if (err) console.error('Update note error:', err);
      callback?.(result);
    }
  );
}
