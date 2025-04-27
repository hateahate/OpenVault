import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { FAB, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthenticatorScreenStyles as styles } from '../styles/AuthenticatorScreenStyles';
import { fetchAccounts, deleteAccount, saveEditedLabel } from '../utils/accounts';
import AuthenticatorCard from '../components/AuthenticatorCard';
import i18n from '../i18n'; // ✅ Добавляем импорт

export default function AuthenticatorScreen() {
    const [accounts, setAccounts] = useState([]);
    const [editVisible, setEditVisible] = useState(false);
    const [selectedAccountIndex, setSelectedAccountIndex] = useState(null);
    const [newLabel, setNewLabel] = useState('');
    const [currentTime, setCurrentTime] = useState(Date.now());

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isFocused) {
            loadAccountsData();
        }
    }, [isFocused]);

    const loadAccountsData = async () => {
        const data = await fetchAccounts();
        setAccounts(data);
    };

    const handleDeleteAccount = async (index) => {
        const newAccounts = await deleteAccount(index, accounts);
        setAccounts(newAccounts);
    };

    const handleSaveEditedLabel = async () => {
        const newAccounts = await saveEditedLabel(selectedAccountIndex, newLabel, accounts);
        setAccounts(newAccounts);
        setEditVisible(false);
    };

    const handlePress = (index) => {
        setSelectedAccountIndex(index);
        setNewLabel(accounts[index].label);
        setEditVisible(true);
    };

    const renderItem = ({ item, index }) => (
        <AuthenticatorCard
            item={item}
            index={index}
            onLongPress={(idx) =>
                Alert.alert(
                    i18n.t('delete_account'),
                    i18n.t('are_you_sure'),
                    [
                        { text: i18n.t('cancel'), style: 'cancel' },
                        { text: i18n.t('delete_account'), style: 'destructive', onPress: () => handleDeleteAccount(idx) }
                    ]
                )
            }
            onPress={handlePress}
            currentTime={currentTime}
        />
    );

    return (
        <View style={styles.container}>
            {accounts.length === 0 ? (
                <Text style={styles.emptyText}>{i18n.t('no_accounts')}</Text>
            ) : (
                <FlatList
                    data={accounts}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
            <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={() => navigation.navigate('ScanQR')}
            />

            <Portal>
                <Dialog visible={editVisible} onDismiss={() => setEditVisible(false)}>
                    <Dialog.Title>{i18n.t('edit')}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label={i18n.t('new_pin')}
                            value={newLabel}
                            onChangeText={setNewLabel}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEditVisible(false)}>{i18n.t('cancel')}</Button>
                        <Button onPress={handleSaveEditedLabel}>{i18n.t('save')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}
