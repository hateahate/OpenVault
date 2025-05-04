import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import MarkdownNoteEditor from '../components/MarkdownEditorScreen';
import {
    addNote,
    updateNote,
    decryptNoteContent,
    getNotes
} from '../storage/notesDb';
import PasswordPrompt from '../components/PasswordPrompt';

export default function NoteEditorScreen({ route, navigation }) {
    const isEdit = !!route.params?.id;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [askPass, setAskPass] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const id = route.params.id;
            (async () => {
                const all = await getNotes();
                const note = all.find(n => n.id === id);
                if (!note) return navigation.goBack();
                if (note.encrypted) {
                    setAskPass(true);
                } else {
                    setTitle(note.title);
                    setContent(note.content);
                }
            })();
        }
    }, []);

    const handlePass = async (pwd) => {
        const text = await decryptNoteContent(route.params.id, pwd);
        if (text === null) {
            Alert.alert('Ошибка', 'Неверный пароль');
        } else {
            const note = (await getNotes()).find(n => n.id === route.params.id);
            setTitle(note.title);
            setContent(text);
            setAskPass(false);
        }
    };

    const handleSave = async (newContent) => {
        if (!title.trim() || !newContent.trim()) {
            return Alert.alert('Ошибка', 'Пустая заметка');
        }
        if (isEdit) {
            await updateNote(route.params.id, { title, content: newContent });
        } else {
            await addNote({ title, content: newContent });
        }
        navigation.goBack();
    };

    if (askPass) {
        return <PasswordPrompt visible onSubmit={handlePass} onDismiss={() => navigation.goBack()} />;
    }

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                label="Заголовок"
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                style={{ margin: 16 }}
            />
            <MarkdownNoteEditor
                initialContent={content}
                initialTitle={title}
                title={title}
                onTitleChange={setTitle}
                onSave={handleSave}
            />
        </View>
    );
}
