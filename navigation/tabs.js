import HomeScreen from '../screens/HomeScreen';
import Passwords from '../screens/Passwords';
import NotesScreen from '../screens/NotesScreen';
import AuthenticatorScreen from '../screens/AuthenticatorScreen';
import SettingsScreen from '../screens/SettingsScreen';

export const tabs = [
    { key: 'home', title: 'main_tabs', component: HomeScreen, icon: 'home' },
    { key: 'passwords', title: 'passwords_tab', component: Passwords, icon: 'lock' },
    { key: 'authenticator', title: 'authenticator_tab', component: AuthenticatorScreen, icon: 'key' },
    { key: 'notes', title: 'notes_tab', component: NotesScreen, icon: 'note-text' },
    { key: 'settings', title: 'settings_tab', component: SettingsScreen, icon: 'cog' }
];
