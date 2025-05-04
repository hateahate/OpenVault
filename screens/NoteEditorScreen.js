import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { useNavigation } from '@react-navigation/native';
import { addNote } from '../storage/notesDb';
import { useTranslation } from 'react-i18next';

export default function NoteEditorScreen() {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const editorRef = useRef();
    const navigation = useNavigation();

    const handleSave = async () => {
        const content = await editorRef.current?.getContentHtml();
        if (!title.trim() || !content.trim()) return;

        await addNote({ title, content });
        navigation.goBack(); // Возврат на список заметок
    };

    return (
        <View style={styles.container}>
            <TextInput
                label={t('note_title')}
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
                mode="outlined"
            />
            <RichEditor
                ref={editorRef}
                style={styles.editor}
                placeholder={t('note_placeholder')}
                initialHeight={200}
            />
            <RichToolbar
                editor={editorRef}
                actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                ]}
                style={styles.toolbar}
            />
            <Button
                mode="contained"
                style={styles.saveButton}
                onPress={handleSave}
            >
                {t('save')}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    titleInput: { marginBottom: 12 },
    editor: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
    },
    toolbar: {
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    saveButton: {
        marginTop: 16,
    },
});
