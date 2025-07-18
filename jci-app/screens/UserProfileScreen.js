import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const UserProfileScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    }, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        try {
          const formData = new FormData();
          formData.append('profilePicture', {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          });

          const updatedUser = await axios.put(
            API_ENDPOINTS.USER_PROFILE_PICTURE(user._id),
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          setProfilePicture(updatedUser.data.user.profilePicture);
          Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
          Alert.alert('Error', 'Failed to update profile picture');
        }
      }
    });
  };

  const handleRequestUpdate = async () => {
    try {
      const response = await axios.post(API_ENDPOINTS.USER_REQUEST_UPDATE, {
        userId: user._id,
        field: 'profile',
        newValue: 'Requested update'
      });
      Alert.alert('Success', 'Update request submitted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit update request');
    }
  };

  const handleBack = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: `${API_ENDPOINTS.API_BASE_URL}/${profilePicture}` }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleImagePick}>
          <Text style={styles.updateButtonText}>Update Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{user.fullName}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Occupation</Text>
          <Text style={styles.value}>{user.occupation}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Mobile Number</Text>
          <Text style={styles.value}>{user.mobileNumber}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{user.location}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>{user.dateOfBirth}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.requestButton} onPress={handleRequestUpdate}>
        <Text style={styles.requestButtonText}>Request Admin to Change</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#1a73e8',
  },
  updateButton: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  requestButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  requestButtonText: {
    color: '#1a73e8',
    fontSize: 15,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 15,
  },
  backButtonText: {
    color: '#1a73e8',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default UserProfileScreen; 