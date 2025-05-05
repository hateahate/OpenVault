import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, List, Switch, Button, Divider, RadioButton } from 'react-native-paper';
import AppContext from '../contexts/AppContext';
import { tabs } from '../navigation/tabs';
import { useTranslation } from 'react-i18next';
import { SettingsScreenStyles as styles } from '../styles/SettingsScreenStyles';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

export default function SettingsScreen() {
    const {
        settings,
        toggleBiometric,
        updateTabLocks,
        updateLanguage,
        toggleRequestAuthOnLaunch,
        updateTabTimeout,
    } = useContext(AppContext);

    const { t } = useTranslation();
    const navigation = useNavigation();
    const appVersion = Constants.expoConfig.version;

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

    const navigateToSetPin = () => {
        navigation.navigate('SetPin');
    };

    const navigateToRemovePin = () => {
        navigation.navigate('RemovePin');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>{t('pin_code')}</Text>

            <Button
                mode="contained"
                onPress={navigateToSetPin}
                style={styles.button}
            >
                {settings.hasPin ? t('change_pin') : t('set_pin')}
            </Button>

            {settings.hasPin && (
                <Button
                    mode="contained"
                    onPress={navigateToRemovePin}
                    style={[styles.button, { marginTop: 8 }]}
                >
                    {t('remove_pin')}
                </Button>
            )}

            {settings.hasPin && (
                <>
                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>{t('biometric_usage_title')}</Text>
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

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>{t('tab_timeout')}</Text>
                    <RadioButton.Group onValueChange={handleChangeTimeout} value={String(settings.tabTimeout)}>
                        <RadioButton.Item label={t('30_sec')} value="30" labelStyle={styles.radioTitle} />
                        <RadioButton.Item label={t('1_min')} value="60" labelStyle={styles.radioTitle} />
                        <RadioButton.Item label={t('5_min')} value="300" labelStyle={styles.radioTitle} />
                        <RadioButton.Item label={t('never')} value="0" labelStyle={styles.radioTitle} />
                    </RadioButton.Group>
                </>
            )}

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
            <Text style={{ marginBottom: 40 }} />

            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                    LockHive v{appVersion}{"\n"}
                    Contact: stepan@pavlenko.lol{"\n"}
                </Text>
            </View>

        </ScrollView>
    );
}
