import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import { getNotes, decryptNoteContent, encryptNote } from '../storage/notesDb';
import PasswordPrompt from '../components/PasswordPrompt';
import { mdStyles } from '../styles/MarkdownStyles';
import { useTranslation } from 'react-i18next';

export default function NoteViewScreen({ route, navigation }) {
    const { id } = route.params;
    const [note, setNote] = useState(null);
    const [needPass, setNeedPass] = useState(false);
    const [showDecryptPrompt, setShowDecryptPrompt] = useState(false);
    const [plain, setPlain] = useState('');
    const { t } = useTranslation();

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
            Alert.alert(t('error'), t('wrong_password'));
        } else {
            setPlain(txt);
            setNeedPass(false);
        }
    };

    const onDecryptDisable = async pwd => {
        const txt = await decryptNoteContent(id, pwd);
        if (!txt) {
            Alert.alert(t('error'), t('wrong_password'));
        } else {
            const success = await encryptNote(id, pwd); // повторный вызов снимет шифрование
            if (success) {
                const list = await getNotes();
                const n = list.find(x => x.id === id);
                setNote(n);
                setPlain(n.content || '');
                setShowDecryptPrompt(false);
            } else {
                Alert.alert(t('error'), t('wrong_encryption_disable'));
            }
        }
    };

    if (!note) return null;

    if (needPass) {
        return (
            <PasswordPrompt
                visible
                title={t('password_to_decrypt')}
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
                {t('edit')}
            </Button>

            {note.encrypted && (
                <Button
                    mode="outlined"
                    style={{ marginTop: 12 }}
                    onPress={() => setShowDecryptPrompt(true)}
                >
                    {t('disable_encryption_btn')}
                </Button>
            )}

            {showDecryptPrompt && (
                <PasswordPrompt
                    visible
                    title={t()}
                    onSubmit={onDecryptDisable}
                    onDismiss={() => setShowDecryptPrompt(false)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: 'white' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    editBtn: { marginTop: 16 },
});

