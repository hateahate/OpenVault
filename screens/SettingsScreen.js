// screens/SettingsScreen.js
import React, { useState, useContext } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Text, List, Switch, TextInput, Button, Divider, RadioButton } from 'react-native-paper';
import AppContext from '../contexts/AppContext';
import { tabs } from '../navigation/tabs';
import { useTranslation } from 'react-i18next';
import { SettingsScreenStyles as styles } from '../styles/SettingsScreenStyles';

export default function SettingsScreen() {
    const {
        settings,
        updatePinCode,
        removePinCode,
        verifyPin,
        toggleBiometric,
        updateTabLocks,
        updateLanguage,
        toggleRequestAuthOnLaunch,
        updateTabTimeout,
    } = useContext(AppContext);

    const { t } = useTranslation();

    const [oldPinInput, setOldPinInput] = useState('');
    const [newPinInput, setNewPinInput] = useState('');
    const [step, setStep] = useState(settings.hasPin ? 'confirmOldPin' : 'setNewPin');

    const handlePinProcess = async () => {
        if (step === 'confirmOldPin') {
            const isValid = await verifyPin(oldPinInput);
            if (isValid) {
                setStep('setNewPin');
                setOldPinInput('');
            } else {
                Alert.alert(t('wrong_pin'), t('try_again'));
                setOldPinInput('');
            }
        } else if (step === 'setNewPin') {
            if (newPinInput.length >= 4) {
                await updatePinCode(newPinInput);
                setNewPinInput('');
                setStep('confirmOldPin');
                Alert.alert(t('success'), t('pin_updated'));
            } else {
                Alert.alert(t('invalid_pin'), t('pin_must_be_4_digits'));
            }
        }
    };

    const handleRemovePin = () => {
        Alert.alert(
            t('attention'),
            t('remove_pin_warning'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('remove'),
                    style: 'destructive',
                    onPress: async () => {
                        await removePinCode();
                        setStep('setNewPin');
                        setOldPinInput('');
                        setNewPinInput('');
                    },
                },
            ]
        );
    };

    const handleToggleBiometric = async (value) => {
        await toggleBiometric(value);
    };

    const handleToggleTabLock = async (tabName) => {
        const updatedLocks = { ...settings.tabLocks, [tabName]: !settings.tabLocks[tabName] };
        await updateTabLocks(updatedLocks);
    };

    const handleChangeLanguage = async (value) => {
        await updateLanguage(value);
    };

    const handleChangeTimeout = async (value) => {
        await updateTabTimeout(Number(value));
    };

    const handleToggleRequestAuthOnLaunch = async (value) => {
        await toggleRequestAuthOnLaunch(value);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>
                {settings.hasPin ? t('change_pin') : t('set_pin')}
            </Text>

            {settings.hasPin && step === 'confirmOldPin' && (
                <TextInput
                    label={t('enter_old_pin')}
                    value={oldPinInput}
                    onChangeText={setOldPinInput}
                    secureTextEntry
                    keyboardType="numeric"
                    style={styles.input}
                />
            )}

            {step === 'setNewPin' && (
                <TextInput
                    label={t('enter_new_pin')}
                    value={newPinInput}
                    onChangeText={setNewPinInput}
                    secureTextEntry
                    keyboardType="numeric"
                    style={styles.input}
                />
            )}

            <Button
                mode="contained"
                onPress={handlePinProcess}
                disabled={(step === 'confirmOldPin' && oldPinInput.length < 4) || (step === 'setNewPin' && newPinInput.length < 4)}
                style={styles.button}
            >
                {step === 'confirmOldPin' ? t('confirm') : t('save')}
            </Button>

            {settings.hasPin && (
                <Button
                    mode="outlined"
                    onPress={handleRemovePin}
                    style={[styles.button, { marginTop: 8 }]}
                >
                    {t('remove_pin')}
                </Button>
            )}

            {settings.hasPin && (
                <>
                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>{t('biometric_usage')}</Text>
                    <List.Item
                        title={t('biometric_usage')}
                        titleStyle={styles.listItemTitle}
                        right={() => (
                            <Switch
                                value={settings.biometricEnabled}
                                onValueChange={handleToggleBiometric}
                            />
                        )}
                    />

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>{t('tab_locking')}</Text>
                    {tabs.map((tab) => (
                        <List.Item
                            key={tab.key}
                            title={t(tab.title)}
                            titleStyle={styles.listItemTitle}
                            right={() => (
                                <Switch
                                    value={settings.tabLocks?.[tab.key] || false}
                                    onValueChange={() => handleToggleTabLock(tab.key)}
                                />
                            )}
                        />
                    ))}
                </>
            )}

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>{t('tab_timeout')}</Text>
            <RadioButton.Group onValueChange={handleChangeTimeout} value={String(settings.tabTimeout)}>
                <RadioButton.Item label={t('30_sec')} value="30" labelStyle={styles.radioTitle} />
                <RadioButton.Item label={t('1_min')} value="60" labelStyle={styles.radioTitle} />
                <RadioButton.Item label={t('5_min')} value="300" labelStyle={styles.radioTitle} />
                <RadioButton.Item label={t('never')} value="0" labelStyle={styles.radioTitle} />
            </RadioButton.Group>

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>{t('language_setting')}</Text>
            <RadioButton.Group onValueChange={handleChangeLanguage} value={settings.language}>
                <RadioButton.Item label={t('russian')} value="ru" labelStyle={styles.radioTitle} />
                <RadioButton.Item label={t('english')} value="en" labelStyle={styles.radioTitle} />
            </RadioButton.Group>

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>{t('auth_on_start')}</Text>
            <List.Item
                title={t('auth_on_start')}
                titleStyle={styles.listItemTitle}
                right={() => (
                    <Switch
                        value={settings.requestAuthOnLaunch}
                        onValueChange={handleToggleRequestAuthOnLaunch}
                    />
                )}
            />
        </ScrollView>
    );
}
