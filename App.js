import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

// Компоненты
import BottomNav from './components/BottomNav';
import ScanQRScreen from './screens/ScanQRScreen';

const Stack = createNativeStackNavigator();

export default function App() {
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
            options={{ title: 'Сканирование QR-кода' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}