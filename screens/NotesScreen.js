import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { FAB, Snackbar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { initNotesDb, getNotes, encryptNote } from '../storage/notesDb';
import NoteCard from '../components/NoteCard';
import PasswordPrompt from '../components/PasswordPrompt';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [passDialog, setPassDialog] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [snack, setSnack] = useState({ visible: false, message: '' });
  const nav = useNavigation();

  const load = async () => setNotes(await getNotes());

  useEffect(() => {
    initNotesDb().then(load);
  }, []);

  useFocusEffect(useCallback(load, []));

  const onToggleLock = note => {
    setActiveNote(note);
    setPassDialog(true);
  };

  const onPassSubmit = async pwd => {
    setPassDialog(false);
    const ok = await encryptNote(activeNote.id, pwd);
    setSnack({ visible: true, message: ok ? '🔒 Зашифровано' : '❌ Ошибка' });
    load();
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={notes}
        keyExtractor={i => i.id.toString()}
        renderItem={({ item }) => <NoteCard note={item} onToggleLock={onToggleLock} />}
      />

      <FAB
        icon="plus"
        style={{ position: 'absolute', bottom: 16, right: 16, width: 56, height: 56, borderRadius: 28 }}
        onPress={() => nav.navigate('NoteEditor')}
      />

      <PasswordPrompt
        visible={passDialog}
        title="Установить пароль"
        onSubmit={onPassSubmit}
        onDismiss={() => setPassDialog(false)}
      />

      <Snackbar
        visible={snack.visible}
        onDismiss={() => setSnack({ visible: false, message: '' })}
        duration={2000}
      >
        {snack.message}
      </Snackbar>
    </View>
  );
}
