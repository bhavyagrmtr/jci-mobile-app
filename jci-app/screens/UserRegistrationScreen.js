import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Picker,
  Keyboard,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

// Location dropdown values
const LOCATION_OPTIONS = [
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
  'ICI MATHURA AANYA',
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

const UserRegistrationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    occupation: '',
    mobileNumber: '',
    dateOfBirth: '',
    location: '',
    profilePicture: null,
  });

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setFormData({ ...formData, profilePicture: response.assets[0] });
      }
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      if (!formData.fullName || !formData.occupation || !formData.mobileNumber || !formData.dateOfBirth || !formData.location) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Validate mobile number format
      if (!/^\d{10}$/.test(formData.mobileNumber)) {
        Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
        return;
      }

      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth)) {
        Alert.alert('Error', 'Please enter date in YYYY-MM-DD format');
        return;
      }

      // Create user data object
      const userData = {
        fullName: formData.fullName.trim(),
        occupation: formData.occupation.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        dateOfBirth: formData.dateOfBirth.trim(),
        location: formData.location.trim(),
        status: 'pending' // Set initial status as pending for admin approval
      };

      // First, create the user
      console.log('Creating user with data:', userData);
      const userResponse = await axios.post(API_ENDPOINTS.USER_REGISTER, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      console.log('User creation response:', userResponse.data);

      if (!userResponse.data.success) {
        throw new Error(userResponse.data.message || 'Failed to create user');
      }

      const userId = userResponse.data.userId;

      // If there's a profile picture, upload it
      if (formData.profilePicture) {
        const imageUri = formData.profilePicture.uri;
        const imageType = imageUri.endsWith('.jpg') ? 'image/jpeg' : 
                         imageUri.endsWith('.png') ? 'image/png' : 
                         'image/jpeg';
        
        const imageFormData = new FormData();
        imageFormData.append('profilePicture', {
          uri: imageUri,
          type: imageType,
          name: `profile_${userId}.${imageType.split('/')[1]}`,
        });

        console.log('Uploading profile picture for user:', userId);
        const imageResponse = await axios.post(
          API_ENDPOINTS.USER_PROFILE_PICTURE(userId),
          imageFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            }
          }
        );

        console.log('Profile picture upload response:', imageResponse.data);
      }

      // Send notification to admin about new registration
      try {
        await axios.post(`${API_BASE_URL}/api/admin/notify-new-registration`, {
          userId: userId,
          userData: userData
        });
        console.log('Admin notification sent successfully');
      } catch (notifyError) {
        console.error('Failed to notify admin:', notifyError);
        // Don't throw error here, as user is already created
      }

      Alert.alert(
        'Success', 
        'Registration successful! Please wait for admin approval.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('UserLogin')
          }
        ]
      );

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Registration failed';
        console.error('Server error:', error.response.data);
        Alert.alert('Error', errorMessage);
      } else if (error.request) {
        console.error('No response from server');
        Alert.alert(
          'Connection Error',
          'Could not connect to server. Please check:\n1. Your internet connection\n2. Server is running\n3. Try again later'
        );
      } else {
        console.error('Error:', error.message);
        Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
      }
    }
  };

  const handleBack = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>User Registration</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Occupation"
          value={formData.occupation}
          onChangeText={(text) => setFormData({ ...formData, occupation: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          value={formData.mobileNumber}
          onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={formData.dateOfBirth}
          onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
        />

        <Picker
          selectedValue={formData.location}
          onValueChange={(itemValue) => setFormData({ ...formData, location: itemValue })}
          style={styles.input}
        >
          {LOCATION_OPTIONS.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>

        <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
          <Text style={styles.imageButtonText}>Select Profile Picture</Text>
        </TouchableOpacity>

        {formData.profilePicture && (
          <Image
            source={{ uri: formData.profilePicture.uri }}
            style={styles.previewImage}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 100,
    marginTop: 30,
    alignSelf: 'center',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 30,
    textAlign: 'center',
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
  picker: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
  },
  imageButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#1a73e8',
    fontSize: 16,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserRegistrationScreen; 