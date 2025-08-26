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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../config';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function UserRegistrationScreen() {
  const [fullName, setFullName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const locations = [
    'JCI ALIGARH SHINE',
    'JCI BAREILY JHUMKA CITY',
    'JCI BAREILY MAGNET CITY',
    'JCI BRAHMAVARTA',
    'JCI HATHRAS',
    'JCI HATHRAS GREATER',
    'JCI HATHRAS RAINBOW',
    'JCI HATHRAS VICTORY',
    'JCI HATHRAS SPARKLE',
    'JCI JHANSI CLASSIC',
    'JCI JHANSI FEMINA',
    'JCI JHANSI GOONJ',
    'JCI JHANSI UDAAN',
    'JCI KAIMGANJ GREATER',
    'JCI KANHA',
    'JCI KANPUR',
    'JCI KANPUR INDUSTRIAL',
    'JCI KANPUR LAVANYA',
    'JCI KASGANJ JAGRATI',
    'JCI MATHURA',
    'JCI MATHURA AANYA',
    'JCI MATHURA CITY',
    'JCI MATHURA ELITE (2024)',
    'JCI MATHURA GREATER',
    'JCI MATHURA KALINDI',
    'JCI MATHURA PANKHURI',
    'JCI MATHURA ROYAL',
    'JCI NOIDA NCR (2024)',
    'JCI RAE BAREILY',
    'JCI RANI LAXMIBAI',
    'JCI RATH',
    'JCI RUDRAPUR',
    'JCI RUDRAPUR QUEEN (2023)'
  ];

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfilePicture(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDateOfBirth(formattedDate);
    }
  };

  const handleRegister = async () => {
    try {
      // Validate required fields
      if (!fullName || !occupation || !mobileNumber || !dateOfBirth || !location || !password || !confirmPassword) {
        Alert.alert('Error', 'All fields are required');
        return;
      }

      // Validate password match
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      // Validate password length
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long');
        return;
      }

      // Validate mobile number format
      if (!/^\d{10}$/.test(mobileNumber)) {
        Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
        return;
      }

      // Validate profile picture
      if (!profilePicture) {
        Alert.alert('Error', 'Please select a profile picture');
        return;
      }

      console.log('Starting registration process...');
      console.log('Form data:', {
        fullName,
        occupation,
        mobileNumber,
        dateOfBirth,
        location,
        hasProfilePicture: !!profilePicture
      });

      // Create FormData object
      const data = new FormData();
      data.append('fullName', fullName);
      data.append('occupation', occupation);
      data.append('mobileNumber', mobileNumber);
      data.append('dateOfBirth', dateOfBirth);
      data.append('location', location);
      data.append('password', password);

      // Handle profile picture
      const imageUri = profilePicture.uri;
      const imageName = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(imageName);
      const imageType = match ? `image/${match[1]}` : 'image/jpeg';

      data.append('profilePicture', {
        uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
        name: imageName,
        type: imageType
      });

      console.log('Sending registration request to:', `${API_BASE_URL}/api/users/register`);

      // Show loading indicator
      setUploading(true);

      // Make API request
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('Registration response:', response.data);

      // Hide loading indicator
      setUploading(false);

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Registration successful! Please wait for admin approval.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/user-login')
            }
          ]
        );
      } else {
        Alert.alert('Error', response.data.message || 'Registration failed');
      }
    } catch (error) {
      setUploading(false);
      console.error('Registration error:', error);
      
      if (error.response) {
        // Server responded with an error
        console.error('Error response:', error.response.data);
        Alert.alert('Error', error.response.data.message || 'Registration failed. Please try again.');
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        Alert.alert('Error', 'Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        // Something else went wrong
        console.error('Error message:', error.message);
        Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
      }
    }
  };

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => {
        setLocation(item);
        setShowLocationPicker(false);
      }}
    >
      <Text style={styles.locationItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a73e8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registration</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Please fill in your details</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholderTextColor="#666"
                />
              </View>

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
                <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text 
                    style={[
                      styles.dateText,
                      !dateOfBirth && styles.placeholderText,
                      dateOfBirth && styles.selectedDateText
                    ]}
                  >
                    {dateOfBirth || 'Select Date of Birth'}
                  </Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}

              <View style={styles.inputContainer}>
                <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Occupation"
                  value={occupation}
                  onChangeText={setOccupation}
                  placeholderTextColor="#666"
                />
              </View>

              <TouchableOpacity 
                style={styles.inputContainer}
                onPress={() => setShowLocationPicker(true)}
              >
                <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                <Text 
                  style={[
                    styles.locationText,
                    !location && styles.placeholderText,
                    location && styles.selectedLocationText
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {location || 'Select Your JCI Club'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
              </TouchableOpacity>

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

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholderTextColor="#666"
                />
              </View>

              <TouchableOpacity 
                style={styles.imageButton}
                onPress={handleImagePick}
              >
                <Ionicons name="camera-outline" size={20} color="#1a73e8" style={styles.imageButtonIcon} />
                <Text style={styles.imageButtonText}>
                  {profilePicture ? 'Change Profile Picture' : 'Select Profile Picture'}
                </Text>
              </TouchableOpacity>

              {profilePicture && (
                <Image
                  source={{ uri: profilePicture.uri }}
                  style={styles.previewImage}
                />
              )}

              <TouchableOpacity 
                style={[styles.button, uploading && styles.buttonDisabled]} 
                onPress={handleRegister}
                disabled={uploading}
              >
                <Text style={styles.buttonText}>
                  {uploading ? 'Registering...' : 'Register'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => router.push('/user-login')}
              >
                <Text style={styles.loginLinkText}>
                  Already have an account? <Text style={styles.loginLinkTextBold}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <Modal
              visible={showLocationPicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowLocationPicker(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Your JCI Club</Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowLocationPicker(false)}
                    >
                      <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={locations}
                    renderItem={renderLocationItem}
                    keyExtractor={(item) => item}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.locationList}
                  />
                </View>
              </View>
            </Modal>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logo: {
    width: 150,
    height: 75,
    marginBottom: 20,
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
  dropdownIcon: {
    marginLeft: 10,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    paddingRight: 10,
  },
  selectedLocationText: {
    color: '#1a73e8',
    fontWeight: '500',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#1a73e8',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  imageButtonIcon: {
    marginRight: 10,
  },
  imageButtonText: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: '500',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
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
  loginLink: {
    marginTop: 10,
    padding: 10,
  },
  loginLinkText: {
    color: '#666',
    fontSize: 14,
  },
  loginLinkTextBold: {
    color: '#1a73e8',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  closeButton: {
    padding: 8,
  },
  locationList: {
    padding: 16,
  },
  locationItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  placeholderText: {
    color: '#666',
  },
  datePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  selectedDateText: {
    color: '#1a73e8',
    fontWeight: '500',
  },
}); 