import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as LocalAuthentication from 'expo-local-authentication';
import AppContext from '../contexts/AppContext';
import { useTranslation } from 'react-i18next';

export default function LaunchAuthScreen() {
    const { settings, verifyPin } = useContext(AppContext);
    const { t } = useTranslation();
    const [checking, setChecking] = useState(true);
    const [pinInput, setPinInput] = useState('');

    useEffect(() => {
        attemptBiometric();
    }, []);

    const attemptBiometric = async () => {
        if (settings.biometricEnabled) {
            const isAvailable = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (isAvailable && isEnrolled) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: t('auth_prompt'),
                });
                if (result.success) {
                    await verifyPin(settings.pinCode);
                    return;
                }
            }
        }
        setChecking(false);
    };

    const handlePinSubmit = async () => {
        const success = await verifyPin(pinInput);
        if (!success) {
            Alert.alert(t('wrong_pin'), t('try_again'));
            setPinInput('');
        }
    };

    if (checking) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons name="lock" size={80} color="gray" style={{ marginBottom: 24, marginTop: 70 }} />
            <Text style={{ fontSize: 18, marginBottom: 24 }}>{t('locked_tab')}</Text>

            {!settings.biometricEnabled && (
                <>
                    <TextInput
                        value={pinInput}
                        onChangeText={setPinInput}
                        placeholder={t('enter_pin')}
                        secureTextEntry
                        keyboardType="numeric"
                        style={{
                            width: 200,
                            height: 50,
                            borderColor: 'gray',
                            borderWidth: 1,
                            borderRadius: 10,
                            paddingHorizontal: 16,
                            marginBottom: 24,
                            backgroundColor: '#fff',
                        }}
                    />
                    <Button mode="contained" onPress={handlePinSubmit}>
                        {t('unlock')}
                    </Button>
                </>
            )}

            {settings.biometricEnabled && (
                <Button mode="contained" onPress={attemptBiometric}>
                    {t('unlock')}
                </Button>
            )}
        </View>
    );
}
