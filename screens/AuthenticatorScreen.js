import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { FAB, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthenticatorScreenStyles as styles } from '../styles/AuthenticatorScreenStyles';
import { fetchAccounts, deleteAccount, saveEditedLabel } from '../utils/accounts';
import AuthenticatorCard from '../components/AuthenticatorCard';
import { useTranslation } from 'react-i18next';
import { theme } from '../styles/theme';

export default function AuthenticatorScreen() {
    const [accounts, setAccounts] = useState([]);
    const [editVisible, setEditVisible] = useState(false);
    const [selectedAccountIndex, setSelectedAccountIndex] = useState(null);
    const [newLabel, setNewLabel] = useState('');
    const [currentTime, setCurrentTime] = useState(Date.now());

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { t } = useTranslation();

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
                    t('delete_account'),
                    t('are_you_sure'),
                    [
                        { text: t('cancel'), style: 'cancel' },
                        { text: t('delete_account'), style: 'destructive', onPress: () => handleDeleteAccount(idx) }
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
                <Text style={styles.emptyText}>{t('no_accounts')}</Text>
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
                icon="plus"
                color={theme.colors.onPrimary}
                onPress={() => navigation.navigate('ScanQR')}
            />

            <Portal>
                <Dialog visible={editVisible} onDismiss={() => setEditVisible(false)}>
                    <Dialog.Title>{t('edit')}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label={t('account_label')}
                            value={newLabel}
                            onChangeText={setNewLabel}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEditVisible(false)}>{t('cancel')}</Button>
                        <Button onPress={handleSaveEditedLabel}>{t('save')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}
