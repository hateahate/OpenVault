import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { getNotes, decryptNoteContent } from '../storage/notesDb';
import PasswordPrompt from '../components/PasswordPrompt';

export default function NoteViewScreen({ route, navigation }) {
    const { id } = route.params;
    const [note, setNote] = useState(null);
    const [askPass, setAskPass] = useState(false);

    useEffect(() => {
        (async () => {
            const all = await getNotes();
            const entry = all.find(n => n.id === id);
            if (!entry) return navigation.goBack();
            if (entry.encrypted) {
                setAskPass(true);
            } else {
                setNote(entry);
            }
        })();
    }, []);

    const onSubmitPass = async (pwd) => {
        const content = await decryptNoteContent(id, pwd);
        if (content === null) {
            Alert.alert('Ошибка', 'Неверный пароль');
        } else {
            setNote({ ...note, content });
            setAskPass(false);
        }
    };

    if (askPass) {
        return <PasswordPrompt visible onSubmit={onSubmitPass} onDismiss={() => navigation.goBack()} />;
    }
    if (!note) return null;

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{note.title}</Text>
            <Text style={{ marginVertical: 12 }}>{note.content}</Text>
            <Button mode="contained" onPress={() => navigation.navigate('NoteEdit', { id })}>
                Редактировать
            </Button>
        </View>
    );
}
