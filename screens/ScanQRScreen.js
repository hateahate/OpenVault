import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { loadAccounts, saveAccounts } from '../storage/secureStorage';
import { useNavigation } from '@react-navigation/native';
import { ScanQRScreenStyles as styles } from '../styles/ScanQRScreenStyles';
import { parseOtpAuthUri } from '../utils/crypto/parseOtpAuthUri';
import i18n from '../i18n'; // ✅ Добавляем импорт

export default function ScanQRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, []);

    const handleBarcodeScanned = async ({ data }) => {
        setScanned(true);

        try {
            if (data.startsWith('otpauth://')) {
                const account = parseOtpAuthUri(data);
                const accounts = await loadAccounts();
                await saveAccounts([...accounts, account]);
                Alert.alert(i18n.t('success'), `${i18n.t('success_add_account')} ${account.label}`, [
                    { text: 'Ок', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert(i18n.t('error'), i18n.t('invalid_qr'), [
                    { text: 'Ок', onPress: () => setScanned(false) }
                ]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert(i18n.t('error'), i18n.t('qr_processing_error'), [
                { text: 'Ок', onPress: () => setScanned(false) }
            ]);
        }
    };

    if (!permission || !permission.granted) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text>{i18n.t('requesting_camera')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            />

            {/* Маска затемнения */}
            <View style={styles.overlay}>
                <View style={styles.maskRow} />
                <View style={styles.maskCenter}>
                    <View style={styles.maskSide} />
                    <View style={styles.frame} />
                    <View style={styles.maskSide} />
                </View>
                <View style={styles.maskRow} />
            </View>
        </View>
    );
}
