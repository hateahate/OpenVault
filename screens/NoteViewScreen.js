import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import { getNotes, decryptNoteContent } from '../storage/notesDb';
import PasswordPrompt from '../components/PasswordPrompt';

export default function NoteViewScreen({ route, navigation }) {
    const { id } = route.params;
    const [note, setNote] = useState(null);
    const [needPass, setNeedPass] = useState(false);
    const [plain, setPlain] = useState('');

    useEffect(() => {
        (async () => {
            const list = await getNotes();
            const n = list.find(x => x.id === id);
            if (!n) return navigation.goBack();
            setNote(n);
            if (n.encrypted) setNeedPass(true);
            else setPlain(n.content || '');
        })();
    }, []);

    const onPasswordSubmit = async pwd => {
        const txt = await decryptNoteContent(id, pwd);
        if (!txt) {
            Alert.alert('Ошибка', 'Неверный пароль');
        } else {
            setPlain(txt);
            setNeedPass(false);
        }
    };

    if (!note) return null;

    if (needPass) {
        return (
            <PasswordPrompt
                visible
                title="Введите пароль для расшифровки"
                onSubmit={onPasswordSubmit}
                onDismiss={() => navigation.goBack()}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{note.title}</Text>
            <Markdown style={mdStyles}>{plain}</Markdown>
            <Button
                mode="contained"
                style={styles.editBtn}
                onPress={() => navigation.navigate('NoteEditor', { id })}
            >
                Редактировать
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: 'white' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    editBtn: { marginTop: 16 },
});

const mdStyles = {
    body: { color: '#222', fontSize: 16, lineHeight: 24 },
    heading1: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
    strong: { fontWeight: 'bold' },
    em: { fontStyle: 'italic' },
};