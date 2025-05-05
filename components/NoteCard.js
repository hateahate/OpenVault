import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import { mdStyles } from '../styles/MarkdownStyles';
import { NoteCardStyles as styles } from '../styles/NoteCardStyles';
import { useTranslation } from 'react-i18next';


export default function NoteCard({ note, onToggleLock, onDelete }) {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const handlePress = () => {
        navigation.navigate('NoteView', { id: note.id });
    };

    const confirmDelete = () => {
        Alert.alert(
            t('delete_note_dialog_title'),
            t('delete_note_dialog_body'),
            [
                { text: t('cancel'), style: 'cancel' },
                { text: t('delete'), style: 'destructive', onPress: () => onDelete(note.id) }
            ]
        );
    };

    return (
        <Card style={styles.card} onPress={handlePress}>
            <Card.Title
                title={note.title}
                right={props => (
                    <View style={styles.icons}>
                        <IconButton
                            {...props}
                            icon={note.encrypted ? 'lock' : 'lock-open-variant'}
                            onPress={() => onToggleLock(note)}
                        />
                        <IconButton
                            {...props}
                            icon="delete"
                            onPress={confirmDelete}
                        />
                    </View>
                )}
            />
            <Card.Content>
                <View style={styles.preview}>
                    <Markdown style={mdStyles}>
                        {note.encrypted ? `🔒 ${t('note_encrypted')}` : (note.content || '—')}
                    </Markdown>
                </View>
            </Card.Content>
        </Card>
    );
}
