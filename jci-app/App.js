import { Stack } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <Stack>
        <Stack.Screen  
          options={{ 
            headerShown: false,
            title: 'User Login'
          }} 
        />
        <Stack.Screen 
          name="admin-login" 
          options={{ 
            headerShown: false,
            title: 'Admin Login'
          }} 
        />
        <Stack.Screen 
          name="user-registration" 
          options={{ 
            headerShown: false,
            title: 'User Registration'
          }} 
        />
        <Stack.Screen 
          name="user-app" 
          options={{ 
            headerShown: false,
            title: 'User App'
          }} 
        />
        <Stack.Screen 
          name="admin-app" 
          options={{ 
            headerShown: false,
            title: 'Admin App'
          }} 
        />
      </Stack>
    </NavigationContainer>
  );
} 