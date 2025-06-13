import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../config';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ADMIN_USERNAME = '0069';
const ADMIN_PASSWORD = 'Nigga';

export default function UserLoginScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (mobileNumber === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/admin-app');
          }
        }
      ]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(API_ENDPOINTS.USER_LOGIN, {
        mobileNumber,
        password,
      });

      if (response.data.success) {
        console.log(response.data.user);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => router.replace('/user-app')
          }
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        Alert.alert('Error', 'User not found. Please register first.');
      } else if (error.response?.status === 401) {
        if (error.response.data.status === 'pending') {
          Alert.alert('Pending Approval', 'Your account is pending approval. Please wait for admin approval.');
        } else if (error.response.data.status === 'rejected') {
          Alert.alert('Account Rejected', 'Your account has been rejected. Please contact support.');
        } else {
          Alert.alert('Error', error.response.data.message || 'Invalid credentials');
        }
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Please login to continue</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
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
                style={styles.registerButton}
                onPress={() => {
                  console.log('Navigating to registration...');
                  router.push('/user-registration');
                }}
              >
                <Text style={styles.registerText}>
                  New User? <Text style={styles.registerTextBold}>Register Here</Text>
                </Text>
              </TouchableOpacity>

              {/*<View style={styles.divider}>*/}
              {/*  <View style={styles.dividerLine} />*/}
              {/*  <Text style={styles.dividerText}>or</Text>*/}
              {/*  <View style={styles.dividerLine} />*/}
              {/*</View>*/}

              {/*<TouchableOpacity*/}
              {/*  style={styles.adminButton}*/}
              {/*  onPress={() => router.push('/admin-login')}*/}
              {/*>*/}
              {/*  <Ionicons name="shield-outline" size={20} color="#fff" style={styles.adminButtonIcon} />*/}
              {/*  <Text style={styles.adminButtonText}>Admin Login</Text>*/}
              {/*</TouchableOpacity>*/}
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
  registerButton: {
    marginTop: 10,
    padding: 10,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerTextBold: {
    color: '#1a73e8',
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#2c3e50',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  adminButtonIcon: {
    marginRight: 10,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
