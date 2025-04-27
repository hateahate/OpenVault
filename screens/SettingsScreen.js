import React, { useState, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, List, Switch, TextInput, Button, Divider, RadioButton } from 'react-native-paper';
import AppContext from '../contexts/AppContext';
import { tabs } from '../navigation/tabs';
import i18n from '../i18n'; // ✅ Добавляем импорт

export default function SettingsScreen() {
    const { settings, updatePinCode, toggleBiometric, updateTabLocks, updateLanguage } = useContext(AppContext);
    const [pin, setPin] = useState(settings.pinCode || '');
    const [newPin, setNewPin] = useState('');
    const [biometricEnabled, setBiometricEnabled] = useState(settings.biometricEnabled);
    const [tabLocks, setTabLocks] = useState(settings.tabLocks || {});
    const [language, setLanguage] = useState(settings.language);

    const handleSavePin = async () => {
        if (newPin.length >= 4) {
            await updatePinCode(newPin);
            setPin(newPin);
            setNewPin('');
        }
    };

    const handleToggleBiometric = async (value) => {
        setBiometricEnabled(value);
        await toggleBiometric(value);
    };

    const handleToggleTabLock = async (tabName) => {
        const updatedLocks = { ...tabLocks, [tabName]: !tabLocks[tabName] };
        setTabLocks(updatedLocks);
        await updateTabLocks(updatedLocks);
    };

    const handleChangeLanguage = async (value) => {
        setLanguage(value);
        await updateLanguage(value);
    };

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>
            <List.Section title={i18n.t('current_pin')}>
                <Text>{i18n.t('current_pin')}: {pin ? i18n.t('save') : i18n.t('cancel')}</Text>
                <TextInput
                    label={i18n.t('new_pin')}
                    value={newPin}
                    onChangeText={setNewPin}
                    secureTextEntry
                    keyboardType="numeric"
                    style={{ marginVertical: 8 }}
                />
                <Button mode="contained" onPress={handleSavePin} disabled={newPin.length < 4}>
                    {i18n.t('save_pin')}
                </Button>
            </List.Section>

            <Divider style={{ marginVertical: 16 }} />

            <List.Section title={i18n.t('biometric_usage')}>
                <List.Item
                    title={i18n.t('biometric_usage')}
                    right={() => (
                        <Switch
                            value={biometricEnabled}
                            onValueChange={handleToggleBiometric}
                            disabled={!pin}
                        />
                    )}
                    description={!pin ? i18n.t('current_pin') : ''}
                />
            </List.Section>

            <Divider style={{ marginVertical: 16 }} />

            <List.Section title={i18n.t('auth_on_start')}>
                <List.Item
                    title={i18n.t('auth_on_start')}
                    right={() => (
                        <Switch
                            value={settings.requestAuthOnLaunch}
                            onValueChange={(value) => toggleRequestAuthOnLaunch(value)}
                        />
                    )}
                />
            </List.Section>


            <Divider style={{ marginVertical: 16 }} />

            <List.Section title={i18n.t('tab_locking')}>
                {tabs.map((tab) => (
                    <List.Item
                        key={tab.key}
                        title={i18n.t(tab.title)}
                        right={() => (
                            <Switch
                                value={tabLocks?.[tab.key] || false}
                                onValueChange={() => handleToggleTabLock(tab.key)}
                                disabled={!pin}
                            />
                        )}
                    />
                ))}
            </List.Section>

            <Divider style={{ marginVertical: 16 }} />

            <List.Section title={i18n.t('language_setting')}>
                <RadioButton.Group onValueChange={handleChangeLanguage} value={language}>
                    <RadioButton.Item label={i18n.t('russian')} value="ru" />
                    <RadioButton.Item label={i18n.t('english')} value="en" />
                </RadioButton.Group>
            </List.Section>

        </ScrollView>
    );
}
