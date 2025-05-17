import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../../config.js';
import { router } from 'expo-router';

export default function UserHomeScreen() {
  const [users, setUsers] = useState([]);
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // console.log(API_ENDPOINTS);
    // console.log(API_ENDPOINTS.ADMIN_APPROVE_USER);
    // console.log(API_ENDPOINTS.IMAGES);
    let data = await AsyncStorage.getItem('userData');
    let userData = JSON.parse(data);
    let url1 = API_ENDPOINTS.ADMIN_APPROVE_USER(userData.id);
    console.log('URL:', url1);
    try {
      const [usersResponse, imagesResponse] = await Promise.all([
        axios.get(url1),
        axios.get(API_ENDPOINTS.IMAGES_GET),
      ]);

      setUsers(usersResponse.data);
      setImages(imagesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderUserCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedUser(item);
        setModalVisible(true);
      }}
    >
      <Image
        source={{ uri: item.profilePicture }}
        style={styles.profileImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.occupation}>{item.occupation}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredUsers}
        renderItem={renderUserCard}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <Image
                  source={{ uri: selectedUser.profilePicture }}
                  style={styles.modalProfileImage}
                />
                <Text style={styles.modalName}>{selectedUser.fullName}</Text>
                <Text style={styles.modalOccupation}>{selectedUser.occupation}</Text>
                <Text style={styles.modalLocation}>{selectedUser.location}</Text>
                <Text style={styles.modalMobile}>{selectedUser.mobileNumber}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  occupation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOccupation: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  modalLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  modalMobile: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 