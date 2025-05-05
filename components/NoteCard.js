import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Card, Paragraph, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function NoteCard({ note, onToggleLock, onDelete }) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('NoteView', { id: note.id });
    };

    const confirmDelete = () => {
        Alert.alert(
            'Удалить заметку',
            'Вы уверены, что хотите удалить эту заметку?',
            [
                { text: 'Отмена', style: 'cancel' },
                { text: 'Удалить', style: 'destructive', onPress: () => onDelete(note.id) }
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
                <Text variant="bodyMedium" numberOfLines={3}>
                    {note.encrypted ? '🔒 Заметка зашифрована' : (note.content || '—')}
                </Text>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 16,
        elevation: 2,
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
