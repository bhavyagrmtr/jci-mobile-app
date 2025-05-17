import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import { router } from 'expo-router';

export default function UserProfileScreen() {
  const [profilePicture, setProfilePicture] = useState(null);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access media library is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      try {
        const uri = result.assets[0].uri;
        const fileName = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(fileName);
        const type = match ? `image/${match[1]}` : `image`;
  
        const formData = new FormData();
        formData.append('profilePicture', {
          uri,
          name: fileName,
          type,
        });
        // get user data from async storage
        const userData = await AsyncStorage.getItem('userData');
        const parsedUserData = JSON.parse(userData);

        await axios.post(API_ENDPOINTS.USER_UPDATE_PROFILE(parsedUserData.id), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        setProfilePicture(uri);
        Alert.alert('Success', 'Profile picture updated successfully');
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile picture');
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={profilePicture ? { uri: profilePicture } : require('../../assets/images/icon.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.changePhotoText}>Tap to change photo</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>John Doe</Text>

        <Text style={styles.label}>Occupation</Text>
        <Text style={styles.value}>Software Engineer</Text>

        <Text style={styles.label}>Mobile Number</Text>
        <Text style={styles.value}>+1234567890</Text>

        <Text style={styles.label}>Date of Birth</Text>
        <Text style={styles.value}>1990-01-01</Text>

        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>New York, USA</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changePhotoText: {
    color: '#1a73e8',
    fontSize: 14,
  },
  infoContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 