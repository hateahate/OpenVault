import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import AppContext from '../contexts/AppContext';
import { useNavigation } from '@react-navigation/native';
import { RemovePinScreenStyles as styles } from '../styles/RemovePinScreenStyles';

export default function RemovePinScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { verifyPin, removePinCode } = useContext(AppContext);

    const [currentPin, setCurrentPin] = useState('');

    const handleRemovePin = async () => {
        const valid = await verifyPin(currentPin);
        if (valid) {
            await removePinCode();
            navigation.goBack();
        } else {
            alert(t('wrong_pin'));
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label={t('enter_current_pin')}
                value={currentPin}
                onChangeText={setCurrentPin}
                secureTextEntry
                keyboardType="numeric"
                style={styles.input}
            />

            <Button mode="contained" onPress={handleRemovePin} style={styles.button}>
                {t('remove_pin')}
            </Button>
        </View>
    );
}
