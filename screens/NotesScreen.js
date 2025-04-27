// screens/NotesScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { FAB, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { loadNotes } from '../storage/secureStorage';
import { NotesScreenStyles as styles } from '../styles/NotesScreenStyles';
import { useTranslation } from 'react-i18next'; // ✅

export default function NotesScreen() {
    const [notes, setNotes] = useState([]);
    const navigation = useNavigation();
    const { t } = useTranslation();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const data = await loadNotes();
        setNotes(data);
    };

    const renderItem = ({ item }) => (
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
                <Text style={styles.emptyText}>{t('no_notes')}</Text>
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
