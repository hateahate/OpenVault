import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

const AppContext = createContext();

const defaultSettings = {
    pinCode: null,
    hasPin: false,
    biometricEnabled: false,
    tabLocks: {},
    language: 'ru',
    requestAuthOnLaunch: true,
    tabTimeout: 120,
};

export function AppProvider({ children }) {
    const [settings, setSettings] = useState(defaultSettings);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const savedSettings = await AsyncStorage.getItem('appSettings');
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                setSettings({ ...defaultSettings, ...parsedSettings });
                await i18n.changeLanguage(parsedSettings.language);
            }
            setIsLoading(false);
        })();
    }, []);

    const saveSettings = async (newSettings) => {
        setSettings(newSettings);
        await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    };

    const authenticate = async () => {
        if (settings.requestAuthOnLaunch && (settings.hasPin || settings.biometricEnabled)) {
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
        }
    };

    const verifyPin = async (inputPin) => {
        if (settings.pinCode && inputPin === settings.pinCode) {
            setIsAuthenticated(true);
            return true;
        } else {
            return false;
        }
    };

    const updatePinCode = async (newPin) => {
        const updated = {
            ...settings,
            pinCode: newPin,
            hasPin: !!newPin,
            biometricEnabled: newPin ? settings.biometricEnabled : false,
        };
        await saveSettings(updated);
    };

    const removePinCode = async () => {
        const updated = {
            ...settings,
            pinCode: null,
            hasPin: false,
            biometricEnabled: false,
            tabLocks: {},
        };
        await saveSettings(updated);
    };

    const toggleBiometric = async (enabled) => {
        if (!settings.hasPin) return;
        const updated = { ...settings, biometricEnabled: enabled };
        await saveSettings(updated);
    };

    const updateTabLocks = async (newTabLocks) => {
        if (!settings.hasPin) return;
        const updated = { ...settings, tabLocks: newTabLocks };
        await saveSettings(updated);
    };

    const updateLanguage = async (lang) => {
        await i18n.changeLanguage(lang);
        const updated = { ...settings, language: lang };
        await saveSettings(updated);
    };

    const toggleRequestAuthOnLaunch = async (enabled) => {
        const updated = { ...settings, requestAuthOnLaunch: enabled };
        await saveSettings(updated);
    };

    const updateTabTimeout = async (timeout) => {
        const updated = { ...settings, tabTimeout: timeout };
        await saveSettings(updated);
    };

    return (
        <AppContext.Provider
            value={{
                settings,
                isAuthenticated,
                isLoading,
                authenticate,
                verifyPin,
                updatePinCode,
                removePinCode,
                toggleBiometric,
                updateTabLocks,
                updateLanguage,
                toggleRequestAuthOnLaunch,
                updateTabTimeout,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export default AppContext;
