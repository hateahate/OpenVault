import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

const translations = {
    en: {
        settings: 'Settings',
        save: 'Save',
        pin: 'Enable PIN',
        biometric: 'Enable Biometric',
        tabLocks: 'Tab Locks',
    },
    ru: {
        settings: 'Настройки',
        save: 'Сохранить',
        pin: 'Включить PIN',
        biometric: 'Включить биометрию',
        tabLocks: 'Блокировка вкладок',
    },
};

i18n.translations = translations;
i18n.locale = Localization.locale;
i18n.fallbacks = true;

export default i18n;