import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { saveAccounts, loadAccounts } from '../storage/secureStorage';

export default function ScanQRScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ data }) => {
        setScanned(true);

        try {
            // Пример otpauth-ссылки: otpauth://totp/Service:email@example.com?secret=SECRET&issuer=Service
            if (!data.startsWith('otpauth://')) {
                Alert.alert('Неверный QR-код', 'Отсканированный код не является otpauth-ссылкой.');
                navigation.goBack();
                return;
            }

            const url = new URL(data);
            const label = decodeURIComponent(url.pathname.slice(1));
            const params = new URLSearchParams(url.search);
            const secret = params.get('secret');
            const issuer = params.get('issuer');

            if (!secret || !label) {
                Alert.alert('Ошибка', 'Не удалось извлечь данные из QR-кода.');
                navigation.goBack();
                return;
            }

            const newAccount = {
                label: issuer ? `${issuer} (${label})` : label,
                secret,
            };

            const existingAccounts = await loadAccounts();
            const updatedAccounts = [...existingAccounts, newAccount];
            await saveAccounts(updatedAccounts);

            Alert.alert('Успешно', 'Аккаунт добавлен!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Ошибка', 'Произошла ошибка при обработке QR-кода.');
            navigation.goBack();
        }
    };

    if (hasPermission === null) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text>Запрос разрешения на использование камеры...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.centered}>
                <Text>Нет доступа к камере. Пожалуйста, предоставьте разрешение в настройках устройства.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.overlay}>
                <Text style={styles.instruction}>Наведите камеру на QR-код</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 8,
    },
    instruction: {
        color: 'white',
        fontSize: 16,
    },
});
