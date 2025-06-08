import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as LocalAuthentication from 'expo-local-authentication';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppContext from '../contexts/AppContext';
import { useIsFocused } from '@react-navigation/native';

const styles = StyleSheet.create({
    centered: { flex: 1 },
});

export default function ProtectedScreenWrapper({ tabName, component: Component, tabLocks }) {
    const [accessGranted, setAccessGranted] = useState(false);
    const [checkingAccess, setCheckingAccess] = useState(true);
    const [pinInput, setPinInput] = useState('');
    const { t } = useTranslation();
    const { settings, verifyPin } = useContext(AppContext);
    const isFocused = useIsFocused();
    const lastAccessTimeRef = useRef(Date.now());

    useEffect(() => {
        if (isFocused) {
            const now = Date.now();
            const diff = (now - lastAccessTimeRef.current) / 1000;

            if (diff > settings.tabTimeout) {
                setAccessGranted(false);
                checkAccess();
            } else if (!accessGranted) {
                checkAccess();
            }
            lastAccessTimeRef.current = now;
        }
    }, [isFocused, settings.tabLocks?.[tabName], settings.tabTimeout]);

    const checkAccess = async () => {
        if (tabLocks?.[tabName] && settings.hasPin) {
            const isAvailable = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (settings.biometricEnabled && isAvailable && isEnrolled) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: t('auth_prompt'),
                });
                setAccessGranted(result.success);
                setCheckingAccess(false);
            } else {
                setCheckingAccess(false);
            }
        } else {
            setAccessGranted(true);
            setCheckingAccess(false);
        }
    };

    const handlePinSubmit = async () => {
        const success = await verifyPin(pinInput);
        if (success) {
            setAccessGranted(true);
        } else {
            Alert.alert(t('wrong_pin'), t('try_again'));
            setPinInput('');
        }
    };

    if (checkingAccess) {
        return (
            <View style={[styles.centered, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!accessGranted) {
        return (
            <View style={[styles.centered, { justifyContent: 'center', alignItems: 'center' }]}>
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
                    <Button mode="contained" onPress={checkAccess}>
                        {t('unlock')}
                    </Button>
                )}
            </View>
        );
    }

    return <Component />;
}
