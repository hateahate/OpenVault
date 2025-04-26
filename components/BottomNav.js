import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { tabs } from '../navigation/tabs';
import { BottomNavStyles } from '../styles/BottomNavStyles';

const Tab = createBottomTabNavigator();

export default function BottomNav() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const currentTab = tabs.find(tab => tab.name === route.name);
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
            {tabs.map(tab => (
                <Tab.Screen
                    key={tab.name}
                    name={tab.name}
                    component={tab.component}
                />
            ))}
        </Tab.Navigator>
    );
}
