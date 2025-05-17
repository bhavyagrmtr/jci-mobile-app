import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../config';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserLoginScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting login...');

      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        mobileNumber,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      console.log('Login response:', response.data);
      console.log('Login status:', response.data);

      if (response.data.success && response.data.status === 'approved') {
        // Store user data in AsyncStorage
        console.log(response.data.user);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        // Navigate to user app
        console.log('Login successful, navigating to user app...');
        // router.push('/user-app')
      } else if (response.data.status === 'pending') {
        Alert.alert('Pending Approval', 'Your account is pending approval. Please wait for admin approval.');
      } else if (response.data.status === 'rejected') {
        Alert.alert('Account Rejected', 'Your account has been rejected. Please contact support.');
      } else {
        Alert.alert('Error', response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        if (error.response.status === 404) {
          Alert.alert('Error', 'User not found. Please register first.');
        } else if (error.response.status === 401) {
          Alert.alert('Error', error.response.data.message || 'Invalid credentials');
        } else {
          Alert.alert('Error', error.response.data.message || 'Login failed');
        }
      } else if (error.request) {
        Alert.alert('Error', 'No response from server. Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a73e8" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.formContainer}>
              <Text style={styles.title}>User Login</Text>
              <Text style={styles.subtitle}>Please enter your credentials to login</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#666"
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerLink}
                onPress={() => router.push('/user-registration')}
              >
                <Text style={styles.registerLinkText}>
                  Don't have an account? <Text style={styles.registerLinkTextBold}>Register</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    padding: 10,
  },
  registerLinkText: {
    color: '#666',
    fontSize: 14,
  },
  registerLinkTextBold: {
    color: '#1a73e8',
    fontWeight: 'bold',
  },
}); 