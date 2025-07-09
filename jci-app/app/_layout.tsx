import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#000" style='dark' />
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="user-login" />
          <Stack.Screen name="user-registration" />
          <Stack.Screen name="admin-login" />
          <Stack.Screen name="admin-app" />
          <Stack.Screen name="user-app" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="ChangePasswordScreen"
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaView>
  );
}
