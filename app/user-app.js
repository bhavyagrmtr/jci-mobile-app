import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function UserApp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) {
          console.log('No user data found, redirecting to login');
          setShouldRedirect(true);
        }
      } catch (error) {
        console.error('Error checking user data:', error);
        setShouldRedirect(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (shouldRedirect) {
    return <Redirect href="/user-login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}

// import React from 'react';
// import { Tabs } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';

// export default function UserAppLayout() {
//   console.log('UserAppLayout component rendered');
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: '#1a73e8',
//         tabBarInactiveTintColor: '#666',
//         headerShown: false,
//       }}
//     >
//       <Tabs.Screen
//         name="home"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// } 