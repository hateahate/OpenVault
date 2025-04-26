import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { FAB, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { loadNotes } from '../storage/secureStorage';

export default function NotesScreen() {
    const [notes, setNotes] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const data = await loadNotes();
        setNotes(data);
    };

    const renderItem = ({ item, index }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title numberOfLines={1}>{item.title}</Title>
                <Paragraph numberOfLines={2}>{item.preview}</Paragraph>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            {notes.length === 0 ? (
                <Text style={styles.emptyText}>Нет заметок. Нажмите "+" для создания!</Text>
            ) : (
                <FlatList
                    data={notes}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
            <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={() => navigation.navigate('NewNote')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#f5f5f5',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: 'gray',
    },
    card: {
        marginVertical: 8,
        borderRadius: 16,
        elevation: 4,
        backgroundColor: 'white',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#03DAC5',
    },
});
