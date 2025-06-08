import React, { useState, useEffect } from 'react';
import { Dialog, Portal, Button, TextInput, Paragraph } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function PasswordPrompt({ visible, title, onSubmit, onDismiss }) {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const promptTitle = title || t('enter_password');

    useEffect(() => {
        if (visible) setPassword('');
    }, [visible]);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>{promptTitle}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={{ marginBottom: 30, color: '#b00020' }}>
                        ⚠️ {t('password_forget_warn')}.
                    </Paragraph>
                    <TextInput
                        label={t('password_label')}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoFocus
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>{t('cancel')}</Button>
                    <Button onPress={() => onSubmit(password)} disabled={!password}>{t('ok')}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}
