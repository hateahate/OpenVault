// i18n.js
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from './locales/en.json';
import ru from './locales/ru.json';

i18n.fallbacks = true;
i18n.translations = { en, ru };

// Язык будет переключаться через контекст
i18n.locale = Localization.locale.startsWith('ru') ? 'ru' : 'en';

export default i18n;
