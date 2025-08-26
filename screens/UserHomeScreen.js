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
import { API_ENDPOINTS } from '../config';

const UserHomeScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    fetchData();
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    const isFirstTime = await AsyncStorage.getItem('isFirstTime');
    if (isFirstTime === null) {
      setShowWelcome(true);
      await AsyncStorage.setItem('isFirstTime', 'false');
    } else {
      setShowWelcome(false);
    }
  };

  const fetchData = async () => {
    try {
      const [usersResponse, imagesResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.USER_APPROVED),
        axios.get(API_ENDPOINTS.IMAGES),
      ]);

      setUsers(usersResponse.data);
      setImages(imagesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.occupation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('UserProfile', { user: item })}
    >
      <Image
        source={{ uri: `${API_ENDPOINTS.API_BASE_URL}/${item.profilePicture}` }}
        style={styles.profileImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.occupation}>{item.occupation}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Modal
        visible={showWelcome}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWelcome(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.welcomeText}>Welcome to JCI App!</Text>
            <Text style={styles.modalText}>
              Connect with other members and stay updated with the latest news and events.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowWelcome(false)}
            >
              <Text style={styles.modalButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.sliderContainer}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Image
              source={{ uri: `${API_ENDPOINTS.API_BASE_URL}/${item.imageUrl}` }}
              style={styles.sliderImage}
            />
          )}
        />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or occupation"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.governingBoardContainer}>
        <Text style={styles.governingBoardText}>JCI India Governing board</Text>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserCard}
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
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#1a73e8',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderContainer: {
    height: 200,
  },
  sliderImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
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
  cardContent: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  occupation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  governingBoardContainer: {
    backgroundColor: '#1a73e8',
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  governingBoardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserHomeScreen; 