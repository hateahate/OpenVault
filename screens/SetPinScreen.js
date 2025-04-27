import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import AppContext from '../contexts/AppContext';
import { useNavigation } from '@react-navigation/native';
import { SetPinScreenStyles as styles } from '../styles/SetPinScreenStyles';

export default function SetPinScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { settings, verifyPin, updatePinCode } = useContext(AppContext);

    const [oldPin, setOldPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmNewPin, setConfirmNewPin] = useState('');
    const [step, setStep] = useState(settings.hasPin ? 'confirmOld' : 'setNew');

    const handleNext = async () => {
        if (step === 'confirmOld') {
            const valid = await verifyPin(oldPin);
            if (valid) {
                setStep('setNew');
                setOldPin('');
            } else {
                alert(t('wrong_pin'));
            }
        } else if (step === 'setNew') {
            if (newPin.length < 4) {
                alert(t('pin_must_be_4_digits'));
                return;
            }
            setStep('confirmNew');
        } else if (step === 'confirmNew') {
            if (newPin !== confirmNewPin) {
                alert(t('pins_do_not_match'));
                return;
            }
            await updatePinCode(newPin);
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            {step === 'confirmOld' && (
                <TextInput
                    label={t('enter_old_pin')}
                    value={oldPin}
                    onChangeText={setOldPin}
                    secureTextEntry
                    keyboardType="numeric"
                    style={styles.input}
                />
            )}

            {step === 'setNew' && (
                <TextInput
                    label={t('enter_new_pin')}
                    value={newPin}
                    onChangeText={setNewPin}
                    secureTextEntry
                    keyboardType="numeric"
                    style={styles.input}
                />
            )}

            {step === 'confirmNew' && (
                <TextInput
                    label={t('confirm_new_pin')}
                    value={confirmNewPin}
                    onChangeText={setConfirmNewPin}
                    secureTextEntry
                    keyboardType="numeric"
                    style={styles.input}
                />
            )}

            <Button mode="contained" onPress={handleNext} style={styles.button}>
                {t('next')}
            </Button>
        </View>
    );
}