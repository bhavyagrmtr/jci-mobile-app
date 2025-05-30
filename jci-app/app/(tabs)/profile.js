import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../../config';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function UserProfileScreen() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editedFields, setEditedFields] = useState({
    fullName: '',
    occupation: '',
    mobileNumber: '',
    location: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('Fetched user data:', parsedUser); // Debug log
          setUser(parsedUser);
          setEditedFields({
            fullName: parsedUser.fullName,
            occupation: parsedUser.occupation,
            mobileNumber: parsedUser.mobileNumber,
            location: parsedUser.location,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow access to your photos to update your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setLoading(true);
        
        // Create form data for image upload
        const formData = new FormData();
        formData.append('profilePicture', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });

        console.log('Uploading profile picture for user:', user._id);

        // First upload the image
        const uploadResponse = await axios.post(
          `${API_BASE_URL}/api/users/${user._id}/profile-picture`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('Upload response:', uploadResponse.data);

        if (uploadResponse.data.success) {
          // Create update request with the uploaded image URL
          const response = await axios.post(
            API_ENDPOINTS.USER_REQUEST_UPDATE,
            {
              userId: user._id,
              field: 'profilePicture',
              newValue: uploadResponse.data.imageUrl,
              type: 'image'
            }
          );

          console.log('Update request response:', response.data);

          if (response.data.success) {
            Alert.alert(
              'Request Sent',
              'Your profile picture update request has been sent to admin for approval.'
            );
          } else {
            throw new Error(response.data.message || 'Failed to send update request');
          }
        } else {
          throw new Error('Failed to upload image');
        }
      }
    } catch (error) {
      console.error('Error in handleImagePick:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        Alert.alert('Error', error.response.data.message || 'Failed to update profile picture');
      } else if (error.request) {
        Alert.alert('Error', 'No response from server. Please check your internet connection.');
      } else {
        Alert.alert('Error', 'Failed to update profile picture. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const changes = {};
      
      // Check which fields have changed
      Object.keys(editedFields).forEach(key => {
        if (editedFields[key] !== user[key]) {
          changes[key] = editedFields[key];
        }
      });

      if (Object.keys(changes).length === 0) {
        Alert.alert('No Changes', 'No changes were made to save.');
        setIsEditing(false);
        return;
      }

      console.log('Current user data:', user); // Debug log
      console.log('Sending update requests for changes:', changes);

      // Send update requests for each changed field
      const requests = Object.entries(changes).map(async ([field, value]) => {
        try {
          console.log(`Sending update request for ${field}:`, value);
          const response = await axios.post(API_ENDPOINTS.USER_REQUEST_UPDATE, {
            userId: user._id,
            field,
            newValue: value,
            type: 'text'
          });
          console.log(`Update request response for ${field}:`, response.data);
          return response.data;
        } catch (error) {
          console.error(`Error sending update request for ${field}:`, error);
          throw error;
        }
      });

      await Promise.all(requests);

      Alert.alert(
        'Request Sent',
        'Your update requests have been sent to admin for approval.'
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Error in handleSave:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        Alert.alert('Error', error.response.data.message || 'Failed to send update requests');
      } else if (error.request) {
        console.error('No response received:', error.request);
        Alert.alert('Error', 'Could not connect to server. Please check your internet connection.');
      } else {
        console.error('Error message:', error.message);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedFields({
      fullName: user.fullName,
      occupation: user.occupation,
      mobileNumber: user.mobileNumber,
      location: user.location,
    });
    setIsEditing(false);
  };

  const renderField = (label, field, value) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={editedFields[field]}
          onChangeText={(text) => setEditedFields(prev => ({ ...prev, [field]: text }))}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <Text style={styles.value}>{value || 'Not set'}</Text>
      )}
    </View>
  );

  const renderProfilePicture = () => {
    return (
      <TouchableOpacity onPress={handleImagePick} disabled={loading}>
        <View style={styles.profileImageContainer}>
          <Image
            source={user?.profilePicture ? { uri: user.profilePicture } : null}
            style={styles.profileImage}
          />
          <View style={styles.editIconContainer}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        {renderProfilePicture()}
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.userPhone}>{user?.mobileNumber}</Text>
      </View>

      <View style={styles.infoContainer}>
        {renderField('Full Name', 'fullName', user?.fullName)}
        {renderField('Phone Number', 'mobileNumber', user?.mobileNumber)}
        {renderField('Occupation', 'occupation', user?.occupation)}
        {renderField('Location', 'location', user?.location)}
        {renderField('Date of Birth', 'dateOfBirth', user?.dateOfBirth)}
      </View>

      <View style={styles.buttonContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1a73e8',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  changePhotoText: {
    color: '#1a73e8',
    fontSize: 14,
  },
  infoContainer: {
    marginBottom: 30,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#1a73e8',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  userPhone: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
}); 