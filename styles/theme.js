import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const LightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#3B82F6',
        onPrimary: 'white'
    },
};

export const DarkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#3B82F6',
        onPrimary: 'white'
    },
};

export const theme = LightTheme;
