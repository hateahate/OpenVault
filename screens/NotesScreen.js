// screens/NotesScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { FAB, Card, Title, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { NotesScreenStyles as styles } from '../styles/NotesScreenStyles';
import {
  initNotesDb,
  getNotes,
  addNote,
  deleteNote,
  updateNote
} from '../storage/notesDb';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const editorRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    initNotesDb();
    loadNotes();
  }, []);

  const loadNotes = () => {
    getNotes(setNotes);
  };

  const handleSave = async () => {
    const content = await editorRef.current?.getContentHtml();
    if (!title || !content) return;

    if (editingNote) {
      updateNote(editingNote.id, { title, content }, loadNotes);
    } else {
      addNote({ title, content }, loadNotes);
    }

    setShowEditor(false);
    setTitle('');
    setEditingNote(null);
    editorRef.current?.setContentHTML('');
  };

  const handleEdit = (note) => {
    setShowEditor(true);
    setTitle(note.title);
    setEditingNote(note);
    setTimeout(() => {
      editorRef.current?.setContentHTML(note.content);
    }, 100);
  };

  const handleDelete = (note) => {
    Alert.alert(
      t('delete_note'),
      t('are_you_sure'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: () => {
            deleteNote(note.id, loadNotes);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => handleEdit(item)} onLongPress={() => handleDelete(item)}>
      <Card.Content>
        <Title>{item.title}</Title>
      </Card.Content>
    </Card>
  );

  if (showEditor) {
    return (
      <View style={styles.container}>
        <RichEditor
          ref={editorRef}
          placeholder={t('no_notes')}
          initialHeight={250}
          style={{ borderColor: '#ccc', borderWidth: 1, marginBottom: 8 }}
        />
        <RichToolbar editor={editorRef} actions={[actions.setBold, actions.setItalic, actions.insertBulletsList, actions.insertOrderedList, actions.insertLink]} />
        <Button mode="contained" onPress={handleSave} style={{ marginTop: 16 }}>
          {editingNote ? t('save') : t('save_note')}
        </Button>
        <Button onPress={() => setShowEditor(false)} style={{ marginTop: 8 }}>
          {t('cancel')}
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => {
          setShowEditor(true);
          setTitle('');
          setEditingNote(null);
          setTimeout(() => editorRef.current?.setContentHTML(''), 100);
        }}
      />
    </View>
  );
}