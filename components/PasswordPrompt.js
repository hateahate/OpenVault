import React, { useState, useEffect } from 'react';
import { Dialog, Portal, Button, TextInput, Paragraph } from 'react-native-paper';

export default function PasswordPrompt({ visible, title = 'Введите пароль', onSubmit, onDismiss }) {
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (visible) setPassword('');
    }, [visible]);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={{ marginBottom: 8, color: '#b00020' }}>
                        ⚠️ Запомните этот пароль! Если вы его забудете, расшифровать заметку будет невозможно.
                    </Paragraph>
                    <TextInput
                        label="Пароль"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoFocus
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Отмена</Button>
                    <Button onPress={() => onSubmit(password)} disabled={!password}>ОК</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}
