import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

import BottomNav from './components/BottomNav';
import ScanQRScreen from './screens/ScanQRScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const authenticate = async () => {
      try {
        const settings = await AsyncStorage.getItem('appSettings');
        const { pinEnabled, biometricEnabled } = settings ? JSON.parse(settings) : {};

        if (pinEnabled || biometricEnabled) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Введите PIN или используйте биометрию',
          });
          setIsAuthenticated(result.success);
        } else {
          setIsAuthenticated(true); // Если блокировка отключена
        }
      } catch (error) {
        console.error('Ошибка аутентификации', error);
        setIsAuthenticated(true); // Разрешить доступ при ошибке
      }
    };

    authenticate();
  }, []);

  if (!isAuthenticated) {
    return null; // Показывать пустой экран, пока идет аутентификация
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={BottomNav}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ScanQR"
            component={ScanQRScreen}
            options={{ title: 'Сканировать QR-код' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Настройки' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
