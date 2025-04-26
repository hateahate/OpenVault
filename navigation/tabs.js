import HomeScreen from '../screens/HomeScreen';
import Passwords from '../screens/Passwords';
import NotesScreen from '../screens/NotesScreen';
import AuthenticatorScreen from '../screens/AuthenticatorScreen';

export const tabs = [
    { name: 'Главная', component: HomeScreen, icon: 'home' },
    { name: 'Пароли', component: Passwords, icon: 'lock' },
    { name: 'Аутентификатор', component: AuthenticatorScreen, icon: 'key' },
    { name: 'Заметки', component: NotesScreen, icon: 'note-text' }, // <-- Новая вкладка
];
