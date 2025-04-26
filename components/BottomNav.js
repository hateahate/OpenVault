import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { tabs } from '../navigation/tabs';

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
                    tabBarStyle: {
                        backgroundColor: '#2c2c34',
                        height: 70,
                        paddingBottom: 4,
                        paddingTop: 4,
                    },
                    tabBarItemStyle: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        marginBottom: 0,
                    },
                    headerStyle: { backgroundColor: '#ffffff' },
                    headerTitleAlign: 'center',
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
