// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization'; // ✅ Expo-way

import en from './locales/en.json';
import ru from './locales/ru.json';

const resources = {
    en: { translation: en },
    ru: { translation: ru },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: Localization.locale.startsWith('ru') ? 'ru' : 'en', // Автоопределение языка
        fallbackLng: 'en', // Английский по умолчанию
        compatibilityJSON: 'v3',
        interpolation: {
            escapeValue: false, // Для React экранировать не нужно
        },
    });

export default i18n;
