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
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const UserLoginScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!mobileNumber.trim()) {
        Alert.alert('Error', 'Please enter your mobile number');
        return;
      }

      setIsLoading(true);
      
      // Add timeout to the axios request
      const response = await axios.post(API_ENDPOINTS.USER_LOGIN, {
        mobileNumber,
      }, {
        timeout: 10000 // 10 second timeout
      });

      if (response.data.success && response.data.status === 'approved') {
        navigation.replace('UserApp', { user: response.data.user });
      } else {
        Alert.alert('Error', response.data.message || 'Your account is pending approval or has been rejected.');
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        Alert.alert('Error', 'Connection timeout. Please check your internet connection and try again.');
      } else if (error.response?.status === 404) {
        Alert.alert('Error', 'User not found. Please register first.');
      } else if (error.response?.status === 401) {
        Alert.alert('Error', error.response.data.message);
      } else if (!error.response) {
        Alert.alert('Error', 'Network error. Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.innerContainer}>
              <Image
                source={require('../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              
              <View style={styles.formContainer}>
                <Text style={styles.title}>User Login</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  editable={!isLoading}
                />

                <TouchableOpacity 
                  style={[styles.button, isLoading && styles.buttonDisabled]} 
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.registerButton, isLoading && styles.buttonDisabled]}
                  onPress={() => navigation.navigate('UserRegistration')}
                  disabled={isLoading}
                >
                  <Text style={styles.registerText}>New User? Register Here</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.adminButton, isLoading && styles.buttonDisabled]}
                  onPress={() => navigation.navigate('AdminLogin')}
                  disabled={isLoading}
                >
                  <Text style={styles.adminText}>Admin Login</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.backButton, isLoading && styles.buttonDisabled]} 
                  onPress={handleBack}
                  disabled={isLoading}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 10,
  },
  registerText: {
    color: '#1a73e8',
    fontSize: 14,
  },
  adminButton: {
    marginTop: 20,
  },
  adminText: {
    color: '#666',
    fontSize: 14,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserLoginScreen; 