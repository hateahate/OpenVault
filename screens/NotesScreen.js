import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { FAB, Snackbar, useTheme } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { initNotesDb, getNotes, encryptNote, deleteNote } from '../storage/notesDb';
import NoteCard from '../components/NoteCard';
import PasswordPrompt from '../components/PasswordPrompt';
import { getNotesScreenStyles } from '../styles/NotesScreenStyles';
import { useTranslation } from 'react-i18next';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [passDialog, setPassDialog] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [snack, setSnack] = useState({ visible: false, message: '' });
  const nav = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = React.useMemo(() => getNotesScreenStyles(theme), [theme]);

  const load = async () => {
    const list = await getNotes();
    setNotes(list);
  };

  useEffect(() => {
    initNotesDb().then(load);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        await load();
      };
      fetch();
    }, [])
  );

  const onToggleLock = note => {
    setActiveNote(note);
    setPassDialog(true);
  };

  const onPassSubmit = async pwd => {
    setPassDialog(false);
    const ok = await encryptNote(activeNote.id, pwd);
    setSnack({ visible: true, message: ok ? `🔒 ${t('encrypted')}` : `❌ ${t('error')}` });
    load();
  };

  const onDelete = async id => {
    await deleteNote(id);
    setSnack({ visible: true, message: `🗑️ ${t('note_deleted')}` });
    load();
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={notes}
        keyExtractor={i => i.id.toString()}
        renderItem={({ item }) => (
          <NoteCard note={item} onToggleLock={onToggleLock} onDelete={onDelete} />
        )}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        color={theme.colors.onPrimary}
        onPress={() => nav.navigate('NoteEditor')}
      />

      <PasswordPrompt
        visible={passDialog}
        title={t('set_password')}
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
