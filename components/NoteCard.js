// components/NoteCard.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Paragraph, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function NoteCard({ note, onPress, onToggleLock }) {
    const { t } = useTranslation();

    return (
        <Card style={styles.card} onPress={() => onPress(note)}>
            <Card.Title
                title={note.title}
                right={(props) => (
                    <IconButton
                        {...props}
                        icon={note.encrypted ? 'lock' : 'lock-open-variant'}
                        onPress={() => onToggleLock(note)}
                        accessibilityLabel={
                            note.encrypted ? t('unlock') : t('lock_note')
                        }
                    />
                )}
            />
            <Card.Content>
                <Paragraph numberOfLines={2}>
                    {note.encrypted ? t('encrypted_note') : note.content}
                </Paragraph>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 6,
        marginHorizontal: 12,
        borderRadius: 16,
        elevation: 2,
    },
});
