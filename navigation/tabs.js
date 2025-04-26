import HomeScreen from '../screens/HomeScreen';
import Passwords from '../screens/Passwords';
import Authenticator from '../screens/Authenticator';

export const tabs = [
    {
        name: 'Главная',
        component: HomeScreen,
        icon: 'home',
    },
    {
        name: 'Пароли',
        component: Passwords,
        icon: 'lock',
    },
    {
        name: 'Аутентификатор',
        component: Authenticator,
        icon: 'key',
    },
];
