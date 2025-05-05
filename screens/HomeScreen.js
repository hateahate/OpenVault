import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
    const { t } = useTranslation();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{t('main_tabs')}</Text>
        </View>
    );
}
