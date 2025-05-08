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
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('occupation', formData.occupation);
      formDataToSend.append('mobileNumber', formData.mobileNumber);
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      formDataToSend.append('location', formData.location);
      
      if (formData.profilePicture) {
        formDataToSend.append('profilePicture', {
          uri: formData.profilePicture.uri,
          type: formData.profilePicture.type,
          name: formData.profilePicture.fileName,
        });
      }

      await axios.post(API_ENDPOINTS.USER_REGISTER, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Registration successful! Please wait for admin approval.');
      navigation.navigate('UserLogin');
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
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