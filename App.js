import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import BottomNav from './components/BottomNav';
import ScanQRScreen from './screens/ScanQRScreen';
import SettingsScreen from './screens/SettingsScreen';
import SetPinScreen from './screens/SetPinScreen';
import RemovePinScreen from './screens/RemovePinScreen';
import NotesScreen from './screens/NotesScreen';
import NoteViewScreen from './screens/NoteViewScreen';
import NoteEditorScreen from './screens/NoteEditorScreen';
import { AppProvider } from './contexts/AppContext';
import AppContext from './contexts/AppContext';
import './i18n';
import * as SplashScreen from 'expo-splash-screen';
import { useTranslation } from 'react-i18next';
import { LightTheme, DarkTheme } from './styles/theme';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { settings } = React.useContext(AppContext);
  const scheme = useColorScheme();
  const isDark = settings.themeMode === 'dark' || (settings.themeMode === 'system' && scheme === 'dark');
  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <MainNavigator />
      </NavigationContainer>
    </PaperProvider>
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
      <Stack.Screen name="NotesList" component={NotesScreen} options={{ title: t('notes') }} />
      <Stack.Screen name="NoteView" component={NoteViewScreen} options={{ title: t('view') }} />
      <Stack.Screen name="NoteCreate" component={NoteEditorScreen} options={{ title: t('new_note') }} />
      <Stack.Screen name="NoteEditor" component={NoteEditorScreen} options={{ title: t('edit') }} />
      <Stack.Screen name="SetPin" component={SetPinScreen} options={{ title: t('set_pin') }} />
      <Stack.Screen name="RemovePin" component={RemovePinScreen} options={{ title: t('remove_pin') }} />
    </Stack.Navigator>
  );
}
