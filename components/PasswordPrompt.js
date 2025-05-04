import React, { useState } from 'react';
import { View } from 'react-native';
import { Dialog, Portal, TextInput, Button } from 'react-native-paper';

export default function PasswordPrompt({ visible, onSubmit, onDismiss, title = 'Введите пароль' }) {
    const [password, setPassword] = useState('');

    const handleConfirm = () => {
        onSubmit(password);
        setPassword('');
    };

    const handleCancel = () => {
        onDismiss();
        setPassword('');
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={handleCancel}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Пароль"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={handleCancel}>Отмена</Button>
                    <Button onPress={handleConfirm}>ОК</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}
