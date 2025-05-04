import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';

export default function NoteCard({ note, onPress, onToggleLock }) {
    return (
        <Card style={styles.card} onPress={() => onPress(note)}>
            <Card.Title
                title={note.title}
                right={(props) =>
                    <IconButton
                        {...props}
                        icon={note.encrypted ? 'lock' : 'lock-open-variant'}
                        onPress={() => onToggleLock(note)}
                        accessibilityLabel={note.encrypted ? 'Unlock note' : 'Lock note'}
                    />
                }
            />
            <Card.Content>
                <Paragraph numberOfLines={2}>
                    {note.encrypted ? '[Заметка зашифрована]' : note.content}
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
