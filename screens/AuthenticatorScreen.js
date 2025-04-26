import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Animated, Pressable } from 'react-native';
import { FAB, Card, Title, Dialog, Portal, Button, TextInput } from 'react-native-paper';
import { loadAccounts, saveAccounts } from '../storage/secureStorage';
import CryptoJS from 'crypto-js';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { generateTOTP } from '../utils/crypto/totpGenerator';

const STEP = 30; // 30 секунд



export default function AuthenticatorScreen() {
    const [accounts, setAccounts] = useState([]);
    const [timeLeft, setTimeLeft] = useState(STEP);
    const [editVisible, setEditVisible] = useState(false);
    const [selectedAccountIndex, setSelectedAccountIndex] = useState(null);
    const [newLabel, setNewLabel] = useState('');

    const progress = useRef(new Animated.Value(1)).current;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isFocused) {
            fetchAccounts();
            startTimer();
        }
        return () => {
            stopTimer();
        };
    }, [isFocused]);

    const fetchAccounts = async () => {
        const data = await loadAccounts();
        if (data.length === 0) {
            const testAccounts = [
                { label: 'GitHub', secret: 'JBSWY3DPEHPK3PXP' },
                { label: 'Google', secret: 'KRSXG5DSMFZWIIDM' },
                { label: 'Twitter', secret: 'MFZWIZLON5UW4ZLZ' },
            ];
            await saveAccounts(testAccounts);
            setAccounts(testAccounts);
        } else {
            setAccounts(data);
        }
    };

    const startTimer = () => {
        progress.setValue(1);
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    fetchAccounts();
                    progress.setValue(1);
                    return STEP;
                }
                return prev - 1;
            });
        }, 1000);

        Animated.timing(progress, {
            toValue: 0,
            duration: STEP * 1000,
            useNativeDriver: false,
        }).start();
    };

    const stopTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        progress.stopAnimation();
    };

    const handleLongPress = (index) => {
        Alert.alert(
            'Удалить аккаунт',
            'Вы уверены, что хотите удалить этот аккаунт?',
            [
                { text: 'Отмена', style: 'cancel' },
                { text: 'Удалить', style: 'destructive', onPress: () => deleteAccount(index) },
            ]
        );
    };

    const deleteAccount = async (index) => {
        const newAccounts = [...accounts];
        newAccounts.splice(index, 1);
        await saveAccounts(newAccounts);
        setAccounts(newAccounts);
    };

    const handlePress = (index) => {
        setSelectedAccountIndex(index);
        setNewLabel(accounts[index].label);
        setEditVisible(true);
    };

    const saveEditedLabel = async () => {
        const newAccounts = [...accounts];
        newAccounts[selectedAccountIndex].label = newLabel;
        await saveAccounts(newAccounts);
        setAccounts(newAccounts);
        setEditVisible(false);
    };

    const renderItem = ({ item, index }) => {
        const code = generateTOTP(item.secret);
        const codeFormatted = code.match(/.{1,3}/g)?.join(' ') || code;

        return (
            <Pressable
                onLongPress={() => handleLongPress(index)}
                onPress={() => handlePress(index)}
            >
                <Card style={styles.card}>
                    <Animated.View style={[styles.progressBar, {
                        width: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        })
                    }]} />
                    <Card.Content style={styles.cardContent}>
                        <Title style={styles.serviceName}>{item.label}</Title>
                        <Text style={styles.code}>{codeFormatted}</Text>
                    </Card.Content>
                </Card>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            {accounts.length === 0 ? (
                <Text style={styles.emptyText}>Пока нет добавленных аккаунтов</Text>
            ) : (
                <FlatList
                    data={accounts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
            <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={() => console.log('Тут будет добавление вручную')}
            />

            <Portal>
                <Dialog visible={editVisible} onDismiss={() => setEditVisible(false)}>
                    <Dialog.Title>Редактировать аккаунт</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Новое название"
                            value={newLabel}
                            onChangeText={setNewLabel}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEditVisible(false)}>Отмена</Button>
                        <Button onPress={saveEditedLabel}>Сохранить</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
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
        overflow: 'hidden',
    },
    cardContent: {
        alignItems: 'center',
        paddingTop: 16,
    },
    serviceName: {
        fontSize: 18,
        marginBottom: 8,
        textAlign: 'center',
    },
    code: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#03DAC5',
    },
    progressBar: {
        height: 4,
        backgroundColor: '#6200ee',
    },
});
