import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { tabs } from '../navigation/tabs';
import { BottomNavStyles } from '../styles/BottomNavStyles';

const Tab = createBottomTabNavigator();

export default function BottomNav() {
    const [lockedTabs, setLockedTabs] = useState({});

    useEffect(() => {
        const loadSettings = async () => {
            const storedSettings = await AsyncStorage.getItem('appSettings');
            if (storedSettings) {
                const { tabLocks } = JSON.parse(storedSettings);
                setLockedTabs(tabLocks);
            }
        };
        loadSettings();
    }, []);

    const authenticate = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Введите PIN или используйте биометрию',
        });
        return result.success;
    };

    const ProtectedScreen = ({ component: Component, tabName }) => {
        return async () => {
            if (lockedTabs[tabName]) {
                const success = await authenticate();
                if (!success) {
                    return null;
                }
            }
            return <Component />;
        };
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const currentTab = tabs.find((tab) => tab.name === route.name);
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
                };
            }}
        >
            {tabs.map((tab) => (
                <Tab.Screen
                    key={tab.name}
                    name={tab.name}
                    component={ProtectedScreen({ component: tab.component, tabName: tab.name })}
                />
            ))}
        </Tab.Navigator>
    );
}
