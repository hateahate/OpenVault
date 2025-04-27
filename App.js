// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import BottomNav from './components/BottomNav';
import ScanQRScreen from './screens/ScanQRScreen';
import SettingsScreen from './screens/SettingsScreen';
import { AppProvider } from './contexts/AppContext';
import AppContext from './contexts/AppContext';
import './i18n';
import * as SplashScreen from 'expo-splash-screen';
import { useTranslation } from 'react-i18next';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <PaperProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AppProvider>
  );
}

function MainNavigator() {
  const { isAuthenticated, isLoading, authenticate } = React.useContext(AppContext);
  const { t } = useTranslation();

  React.useEffect(() => {
    authenticate();
  }, []);

  React.useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={BottomNav}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScanQR"
        component={ScanQRScreen}
        options={{ title: t('scan_qr') }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('settings') }}
      />
    </Stack.Navigator>
  );
}
