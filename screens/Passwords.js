// screens/Passwords.js
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next'; // ✅

export default function Passwords() {
    const { t } = useTranslation();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{t('passwords_tab')}</Text>
        </View>
    );
}
