import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as LocalAuthentication from 'expo-local-authentication';
import { BottomNavStyles as styles } from '../styles/BottomNavStyles';
import i18n from '../i18n';

export default function ProtectedScreenWrapper({ tabName, component: Component, tabLocks }) {
    const [accessGranted, setAccessGranted] = useState(false);
    const [checkingAccess, setCheckingAccess] = useState(true);

    useEffect(() => {
        checkAccess();
    }, []);

    const checkAccess = async () => {
        if (tabLocks && tabLocks[tabName]) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: i18n.t('auth_prompt'),
            });
            setAccessGranted(result.success);
        } else {
            setAccessGranted(true);
        }
        setCheckingAccess(false);
    };

    if (checkingAccess) {
        return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    if (!accessGranted) {
        return (
            <View style={styles.centered}>
                <MaterialCommunityIcons name="lock" size={80} color="gray" />
                <Text style={{ fontSize: 18, marginTop: 16 }}>{i18n.t('locked_tab')}</Text>
                <Button mode="contained" onPress={checkAccess} style={{ marginTop: 24 }}>
                    {i18n.t('unlock')}
                </Button>
            </View>
        );
    }

    return <Component />;
}