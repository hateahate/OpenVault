// screens/NotesScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { FAB, Snackbar } from 'react-native-paper';
import { getNotes, addNote, deleteNote, updateNote, toggleEncryption, initNotesDb } from '../storage/notesDb';
import NoteCard from '../components/NoteCard';
import PasswordPrompt from '../components/PasswordPrompt';
import { useNavigation } from '@react-navigation/native';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [passwordCallback, setPasswordCallback] = useState(() => () => { });
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const navigation = useNavigation();

  const loadNotes = async () => {
    const list = await getNotes();
    setNotes(list);
  };

  useEffect(() => {
    (async () => {
      await initNotesDb();
      await loadNotes();
    })();
  }, []);

  const handleNotePress = (note) => {
    if (note.encrypted) {
      setPasswordDialogVisible(true);
      setSelectedNote(note);
      setPasswordCallback(() => async (password) => {
        const ok = await toggleEncryption(note.id, password);
        if (ok) {
          setSnackbar({ visible: true, message: 'Заметка расшифрована' });
          loadNotes();
        } else {
          setSnackbar({ visible: true, message: 'Неверный пароль' });
        }
      });
    } else {
      Alert.alert('Заметка', note.content);
    }
  };

  const handleToggleLock = (note) => {
    setPasswordDialogVisible(true);
    setSelectedNote(note);
    setPasswordCallback(() => async (password) => {
      const ok = await toggleEncryption(note.id, password);
      if (ok) {
        setSnackbar({ visible: true, message: note.encrypted ? 'Заметка расшифрована' : 'Заметка зашифрована' });
        loadNotes();
      } else {
        setSnackbar({ visible: true, message: 'Ошибка при обработке' });
      }
    });
  };

  const handlePasswordSubmit = (password) => {
    passwordCallback(password);
    setPasswordDialogVisible(false);
  };

  const handleAddNote = async () => {
    await addNote({ title: 'Новая заметка', content: '...' });
    loadNotes();
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={handleNotePress}
            onToggleLock={handleToggleLock}
          />
        )}
      />

      <FAB
        icon="plus"
        style={{ position: 'absolute', bottom: 24, right: 24 }}
        onPress={() => {
          console.log('FAB нажата');
          navigation.navigate('NoteEditor');
        }}
      />

      <PasswordPrompt
        visible={passwordDialogVisible}
        onSubmit={handlePasswordSubmit}
        onDismiss={() => setPasswordDialogVisible(false)}
      />

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}
