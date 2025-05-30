import React, { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import { useRouter } from 'expo-router';

const UserLogin = () => {
  const router = useRouter();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    // Replace with actual login API call
    const login = async () => {
      try {
        const response = await fetch('/api/login');
        const data = await response.json();
        setResponse(data);
        if (data.success && data.status === 'approved') {
          // Store user data in AsyncStorage
          console.log(data.user);
          await AsyncStorage.setItem('userData', JSON.stringify(data.user));
          // Navigate to user app
          console.log('Login successful, navigating to user app...');
          router.replace('/user-app');
        } else if (data.status === 'pending') {
          // Handle pending status
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    };

    login();
  }, [router]);

  return (
    <div>
      {/* Render your login form here */}
    </div>
  );
};

export default UserLogin; 