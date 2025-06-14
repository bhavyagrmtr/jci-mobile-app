import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [user, setUser] = useState(null);
  const flatListRef = useRef(null);

  // Local image assets
  const images = [
    {
      id: '1',
      image: require('../../assets/images/s1.jpg'),
    },
    {
      id: '2',
      image: require('../../assets/images/s2.jpg'),
    },
    {
      id: '3',
      image: require('../../assets/images/s3.jpg'),
    },
    {
      id: '4',
      image: require('../../assets/images/s4.jpg'),
    }
  ];

  const zoneOfficers = [
    { id: '1', post: 'ZONE PRESIDENT', name: 'JC KAPIL AGRAWAL', image: require('../../assets/Zone2president.png') },
    { id: '2', post: 'IPZP', name: 'JC SUMIT AGRAWAL', image: null },
    { id: '3', post: 'ZONE VICE PRESIDENT A', name: 'JC AVDHESH GAUTAM', image: null },
    { id: '4', post: 'ZONE VICE PRESIDENT B', name: 'JC MANSI AGRAWAL', image: null },
    { id: '5', post: 'ZONE VICE PRESIDENT C', name: 'JC SACHIN AGRAWAL', image: null },
    { id: '6', post: 'ZONE SECRETARY', name: 'JC ROHIT AGRAWAL', image: null },
    { id: '7', post: 'ZD MANAGEMENT', name: 'JC MILAN AGRAWAL', image: null },
    { id: '8', post: 'ZD TRAINING', name: 'JC SANKET JAIN', image: null },
    { id: '9', post: 'ZD G&D', name: 'JC RADHARAMAN AGRAWAL', image: null },
    { id: '10', post: 'ZD BUSINESS', name: 'JC RAJAT GUPTA', image: null },
    { id: '11', post: 'ZD PR & MARKETING', name: 'JC RITU SINGHAL', image: null },
    { id: '12', post: 'ZD COMMUNITY DEVELOPMENT', name: 'JC BHUPENDRA AGRAWAL', image: null },
    { id: '13', post: 'ZONE DIRECTOR JUNIOR JC', name: 'JC RAKHI MITTAL', image: null },
    { id: '14', post: 'ZONE DIRECTOR LADY JC', name: 'JC ANURADHA JAIN', image: null },
    { id: '15', post: 'JCOM CHAIRMEN', name: 'JC PAWAN GUPTA', image: null },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.dateOfBirth) {
            const date = new Date(parsedUser.dateOfBirth);
            parsedUser.dateOfBirth = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true
        });
      } else {
        setCurrentIndex(0);
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true
        });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={item.image}
        style={styles.sliderImage}
        resizeMode="cover"
      />
    </View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  const renderProfileCard = () => {
    if (!user) return null;

    return (
      <View style={styles.profileCard}>
        <View style={styles.cardHeader}>
          <View style={styles.profileImageContainer}>
            {user.profilePicture ? (
              <Image
                source={{ uri: user.profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.userLocation}>{user.location}</Text>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>{user.occupation}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>{user.mobileNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>{user.dateOfBirth}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>JCI Member Card</Text>
          <Ionicons name="card" size={20} color="#fff" />
        </View>
      </View>
    );
  };

  const renderZoneOfficerCard = ({ item }) => (
    <View style={styles.nationalPresidentCard}>
      <View style={styles.nationalPresidentHeader}>
        <Ionicons name="person" size={24} color="#fff" />
        <Text style={styles.nationalPresidentTitle}>{item.post}</Text>
      </View>
      
      <View style={styles.nationalPresidentContent}>
        <View style={styles.nationalPresidentInfo}>
          <Text style={styles.nationalPresidentName}>{item.name}</Text>
          <Text style={styles.nationalPresidentDesignation}>Zone Officer</Text>
        </View>
        <View style={styles.nationalPresidentImageContainer}>
          {item.image ? (
            <Image
              source={item.image}
              style={styles.nationalPresidentImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={30} color="#fff" />
            </View>
          )}
        </View>
      </View>

      <View style={styles.nationalPresidentFooter}>
        <Text style={styles.nationalPresidentFooterText}>JCI India</Text>
        <Ionicons name="flag" size={20} color="#fff" />
      </View>
    </View>
  );

  const renderNationalPresidentCard = () => (
    <View style={styles.nationalPresidentCard}>
      <View style={styles.nationalPresidentHeader}>
        <Ionicons name="star" size={24} color="#fff" />
        <Text style={styles.nationalPresidentTitle}>National President</Text>
      </View>
      
      <View style={styles.nationalPresidentContent}>
        <View style={styles.nationalPresidentInfo}>
          <Text style={styles.nationalPresidentName}>JFS Ankur Jhunjhunwala</Text>
          <Text style={styles.nationalPresidentDesignation}>National President 2025</Text>
        </View>
        <View style={styles.nationalPresidentImageContainer}>
          <Image
            source={require('../../assets/images/JCIindiaPresident.jpeg')}
            style={styles.nationalPresidentImage}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.nationalPresidentFooter}>
        <Text style={styles.nationalPresidentFooterText}>JCI India</Text>
        <Ionicons name="flag" size={20} color="#fff" />
      </View>
    </View>
  );

  const renderNVP_Area_A_Card = () => (
    <View style={styles.nationalPresidentCard}>
      <View style={styles.nationalPresidentHeader}>
        <Ionicons name="ribbon" size={24} color="#fff" />
        <Text style={styles.nationalPresidentTitle}>National NVP (Area-A)</Text>
      </View>
      
      <View style={styles.nationalPresidentContent}>
        <View style={styles.nationalPresidentInfo}>
          <Text style={styles.nationalPresidentName}>JC Ashok Bhatt</Text>
          <Text style={styles.nationalPresidentDesignation}>National NVP 2025</Text>
        </View>
        <View style={styles.nationalPresidentImageContainer}>
          <Image
            source={require('../../assets/images/NVP.jpg')}
            style={styles.nationalPresidentImage}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.nationalPresidentFooter}>
        <Text style={styles.nationalPresidentFooterText}>JCI India</Text>
        <Ionicons name="flag" size={20} color="#fff" />
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome to JCI</Text>
          <Text style={styles.headerUserName}>{user?.fullName || 'Member'}</Text>
        </View>
        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.headerIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.sliderContainer}>
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={styles.sliderImage}
                resizeMode="cover"
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(newIndex);
          }}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          snapToInterval={width}
          decelerationRate="fast"
          snapToAlignment="center"
        />
        {renderPagination()}
      </View>

      {renderProfileCard()}

      <View style={styles.governingBoardContainer}>
        <Text style={styles.governingBoardText}>JCI India Governing Board</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.cardsScrollView}
        contentContainerStyle={styles.cardsScrollViewContent}
      >
        {renderNationalPresidentCard()}
        {renderNVP_Area_A_Card()}
      </ScrollView>

      <View style={styles.zoneGoverningBoardContainer}>
        <Text style={styles.zoneGoverningBoardText}>Zone Governing Board</Text>
      </View>

      <FlatList
        data={zoneOfficers}
        renderItem={renderZoneOfficerCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScrollViewContent}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    paddingVertical: 15,
    zIndex: 10,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  headerUserName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  headerIcon: {
    width: 40,
    height: 40,
  },
  sliderContainer: {
    height: 200,
    marginBottom: 10,
  },
  imageContainer: {
    width: width,
    height: 200,
    paddingHorizontal: 15,
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#1a73e8',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  profileCard: {
    backgroundColor: '#1a73e8',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: 15,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userLocation: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  cardBody: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  cardFooterText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  governingBoardContainer: {
    backgroundColor: '#2a9d8f',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  governingBoardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardsScrollView: {
    marginVertical: 10,
  },
  cardsScrollViewContent: {
    paddingHorizontal: 20,
  },
  nationalPresidentCard: {
    backgroundColor: '#2a9d8f',
    marginRight: 15,
    width: 300,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nationalPresidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  nationalPresidentTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  nationalPresidentContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  nationalPresidentInfo: {
    flex: 1,
  },
  nationalPresidentName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nationalPresidentDesignation: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  nationalPresidentImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginLeft: 15,
  },
  nationalPresidentImage: {
    width: '100%',
    height: '100%',
  },
  nationalPresidentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  nationalPresidentFooterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  zoneGoverningBoardContainer: {
    backgroundColor: '#2a9d8f',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  zoneGoverningBoardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholderImage: {
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
}); 