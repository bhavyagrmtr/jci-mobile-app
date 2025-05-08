import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const AdminHomeScreen = ({ navigation }) => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN_PENDING_USERS);
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.put(API_ENDPOINTS.ADMIN_APPROVE_USER(userId));
      Alert.alert('Success', 'User approved successfully');
      fetchPendingUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.put(API_ENDPOINTS.ADMIN_REJECT_USER(userId));
      Alert.alert('Success', 'User rejected successfully');
      fetchPendingUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to reject user');
    }
  };

  const handleImageUpload = () => {
    ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    }, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        try {
          const formData = new FormData();
          formData.append('image', {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          });

          await axios.post(API_ENDPOINTS.IMAGES_UPLOAD, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          Alert.alert('Success', 'Image uploaded successfully');
        } catch (error) {
          Alert.alert('Error', 'Failed to upload image');
        }
      }
    });
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <Image
        source={{ uri: `${API_ENDPOINTS.API_BASE_URL}/${item.profilePicture}` }}
        style={styles.profileImage}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.fullName}</Text>
        <Text style={styles.userDetails}>{item.occupation}</Text>
        <Text style={styles.userDetails}>{item.location}</Text>
        <Text style={styles.userDetails}>{item.mobileNumber}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => handleApprove(item._id)}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleReject(item._id)}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
          <Text style={styles.uploadButtonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Pending Approvals</Text>
      <FlatList
        data={pendingUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  uploadButton: {
    backgroundColor: '#1a73e8',
    padding: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    justifyContent: 'center',
  },
  button: {
    padding: 8,
    borderRadius: 4,
    marginLeft: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AdminHomeScreen; 