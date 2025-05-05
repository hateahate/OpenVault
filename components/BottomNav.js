import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from 'react-native-paper';
import AppContext from '../contexts/AppContext';
import { tabs } from '../navigation/tabs';
import { BottomNavStyles } from '../styles/BottomNavStyles';
import ProtectedScreenWrapper from './ProtectedScreenWrapper';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

export default function BottomNav() {
    const { settings } = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const currentTab = tabs.find((tab) => tab.key === route.name);
                return {
                    headerTitle: t(currentTab?.title),
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
                    tabBarLabel: t(currentTab?.title),
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
