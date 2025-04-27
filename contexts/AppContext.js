import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const AppContext = createContext();

const defaultSettings = {
    pinCode: null,
    biometricEnabled: false,
    tabLocks: {},
    language: 'ru',
    requestAuthOnLaunch: true, // Новая настройка запроса при старте
};

export function AppProvider({ children }) {
    const [settings, setSettings] = useState(defaultSettings);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const savedSettings = await AsyncStorage.getItem('appSettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
            setIsLoading(false);
        })();
    }, []);

    const saveSettings = async (newSettings) => {
        setSettings(newSettings);
        await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    };

    const authenticate = async () => {
        if (settings.requestAuthOnLaunch && (settings.pinCode || settings.biometricEnabled)) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: settings.language === 'ru' ? 'Введите PIN или биометрию' : 'Enter PIN or use Biometrics',
            });
            setIsAuthenticated(result.success);
        } else {
            setIsAuthenticated(true);
        }
    };

    const updatePinCode = async (pin) => {
        if (!pin) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: settings.language === 'ru' ? 'Подтвердите для удаления PIN' : 'Authenticate to remove PIN',
            });
            if (!result.success) {
                return; // Отмена удаления PIN
            }
        }
        const updated = { ...settings, pinCode: pin, biometricEnabled: pin ? settings.biometricEnabled : false };
        await saveSettings(updated);
    };

    const toggleBiometric = async (enabled) => {
        const updated = { ...settings, biometricEnabled: enabled };
        await saveSettings(updated);
    };

    const updateTabLocks = async (newTabLocks) => {
        const updated = { ...settings, tabLocks: newTabLocks };
        await saveSettings(updated);
    };

    const updateLanguage = async (lang) => {
        const updated = { ...settings, language: lang };
        await saveSettings(updated);
    };

    const toggleRequestAuthOnLaunch = async (enabled) => {
        const updated = { ...settings, requestAuthOnLaunch: enabled };
        await saveSettings(updated);
    };

    return (
        <AppContext.Provider
            value={{
                settings,
                isAuthenticated,
                isLoading,
                authenticate,
                updatePinCode,
                toggleBiometric,
                updateTabLocks,
                updateLanguage,
                toggleRequestAuthOnLaunch,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export default AppContext;
