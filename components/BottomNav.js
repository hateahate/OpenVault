// components/BottomNav.js
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from 'react-native-paper';
import AppContext from '../contexts/AppContext';
import { tabs } from '../navigation/tabs';
import { BottomNavStyles } from '../styles/BottomNavStyles';
import * as LocalAuthentication from 'expo-local-authentication';
import i18n from '../i18n'; // Добавили!

const Tab = createBottomTabNavigator();

export default function BottomNav() {
    const { settings } = useContext(AppContext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const currentTab = tabs.find((tab) => tab.key === route.name);
                return {
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name={currentTab?.icon || 'circle'}
                            color={color}
                            size={size}
                        />
                    ),
                    tabBarActiveTintColor: 'white',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: BottomNavStyles.tabBarStyle,
                    tabBarItemStyle: BottomNavStyles.tabBarItemStyle,
                    tabBarLabelStyle: BottomNavStyles.tabBarLabelStyle,
                    headerStyle: BottomNavStyles.headerStyle,
                    tabBarLabel: i18n.t(currentTab?.title),
                };
            }}
        >
            {tabs.map((tab) => (
                <Tab.Screen
                    key={tab.key}
                    name={tab.key}
                    children={() => (
                        <ProtectedScreenWrapper
                            tabName={tab.key}
                            component={tab.component}
                            tabLocks={settings.tabLocks}
                        />
                    )}
                />
            ))}
        </Tab.Navigator>
    );
}

function ProtectedScreenWrapper({ tabName, component: Component, tabLocks }) {
    const [accessGranted, setAccessGranted] = React.useState(false);
    const [checkingAccess, setCheckingAccess] = React.useState(true);

    React.useEffect(() => {
        const checkAccess = async () => {
            if (tabLocks && tabLocks[tabName]) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: 'Введите PIN или биометрию',
                });
                setAccessGranted(result.success);
            } else {
                setAccessGranted(true);
            }
            setCheckingAccess(false);
        };

        checkAccess();
    }, []);

    if (checkingAccess) {
        return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    if (!accessGranted) {
        return null; // Можно сюда поставить экран \"Нет доступа\" если захочешь
    }

    return <Component />;
}
