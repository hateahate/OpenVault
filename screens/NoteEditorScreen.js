import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import MarkdownEditorScreen from '../components/MarkdownEditorScreen';
import { useTranslation } from 'react-i18next';
import {
    initNotesDb,
    getNotes,
    addNote,
    updateNote,
    decryptNoteContent
} from '../storage/notesDb';
import PasswordPrompt from '../components/PasswordPrompt';


export default function NoteEditorScreen() {
    const nav = useNavigation();
    const route = useRoute();
    const id = route.params?.id;
    const isEdit = !!id;
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [initialContent, setInitialContent] = useState('');
    const [ask, setAsk] = useState(false);

    useEffect(() => {
        (async () => {
            await initNotesDb();
            if (isEdit) {
                const all = await getNotes();
                const n = all.find(x => x.id === id);
                if (!n) return nav.goBack();
                if (n.encrypted) setAsk(true);
                else {
                    setTitle(n.title);
                    setInitialContent(n.content || '');
                }
            }
        })();
    }, []);

    const handlePassword = async password => {
        const txt = await decryptNoteContent(id, password);
        if (!txt) {
            Alert.alert(t('error'), t('wrong_password'));
        } else {
            const note = (await getNotes()).find(x => x.id === id);
            setTitle(note.title);
            setInitialContent(txt);
            setAsk(false);
        }
    };

    const handleSave = async content => {
        if (!title.trim() || !content.trim()) {
            Alert.alert(t('error'), t('blank_note'));
            return;
        }

        if (isEdit) {
            await updateNote(id, { title, content });
        } else {
            await addNote({ title, content });
        }

        nav.goBack();
    };

    if (ask) {
        return (
            <PasswordPrompt
                visible
                title={t('enter_password')}
                onSubmit={handlePassword}
                onDismiss={() => nav.goBack()}
            />
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                label={t('title_label')}
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                style={styles.title}
            />
            <MarkdownEditorScreen
                initialContent={initialContent}
                title={title}
                onTitleChange={setTitle}
                onSave={handleSave}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    title: { margin: 16 }
});
