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
      image: require('../../assets/images/slider2.jpg'),
    },
    {
      id: '2',
      image: require('../../assets/images/slider3.jpg'),
    }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          // Format the date of birth
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
      } else {
        setCurrentIndex(0);
      }
    }, 2000);

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

  const renderPagination = () => {
    return (
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
  };

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
              <View style={[styles.profileImage, styles.placeholderImage]}>
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

  const renderZonePresidentCard = () => {
    return (
      <View style={styles.zonePresidentCard}>
        <View style={styles.zonePresidentHeader}>
          <Ionicons name="ribbon" size={24} color="#fff" />
          <Text style={styles.zonePresidentTitle}>Zone 2 President</Text>
        </View>
        
        <View style={styles.zonePresidentContent}>
          <View style={styles.zonePresidentInfo}>
            <Text style={styles.zonePresidentName}>JFP Kapil Agrawal</Text>
            <Text style={styles.zonePresidentDesignation}>Zone 2 President 2024</Text>
          </View>
          <View style={styles.zonePresidentImageContainer}>
            <Image
              source={require('../../assets/Zone2president.png')}
              style={styles.zonePresidentImage}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.zonePresidentFooter}>
          <Text style={styles.zonePresidentFooterText}>JCI India</Text>
          <Ionicons name="flag" size={20} color="#fff" />
        </View>
      </View>
    );
  };

  const renderNationalPresidentCard = () => {
    return (
      <View style={styles.nationalPresidentCard}>
        <View style={styles.nationalPresidentHeader}>
          <Ionicons name="star" size={24} color="#fff" />
          <Text style={styles.nationalPresidentTitle}>NATIONAL PRESIDENT MESSAGE</Text>
        </View>
        
        <View style={styles.nationalPresidentContent}>
          <Text style={styles.nationalPresidentName}>JFS ANKUR JHUNJHUNWALA</Text>
          <Text style={styles.nationalPresidentDesignation}>National President 2025</Text>
          
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              Dear Reader,{'\n\n'}
              I am delighted that you found this space, and are exploring the JCI India website! Greetings!{'\n\n'}
              JCI is a growing organisation of young people in India and across the world – young people who have committed to grow into leaders who will shape the world in the times to come.{'\n\n'}
              JCI provides opportunities that empower its members to develop into leaders who are proactive in the communities around them. Through actively working in the areas of individual development, organisational management, community development, business growth, and domestic and international networking, JCI members hone their own skills and become ever better versions of themselves, capable of providing leadership at different forums and platforms. JCI members constantly set standards of model citizenship and lead their peers by example.{'\n\n'}
              As JCI steps into the 76th year of its existence in India, it carries with it the legacy of impactful service to its members and to the society, and brings with it the experience of transformational leadership that has grown in the organisation over the years. Armed with these strengths, JCI India is ready to unveil a new era of character building that will propel its members to the forefront of progressive leadership that the world needs.{'\n\n'}
              The pragmatic views that members of JCI hold is the cornerstone on which world peace will one day be established. Dear reader, if you are not already a part of this movement, now is your opportunity to become the people who changed the world positively. 2025 can be your year too!{'\n\n'}
              I hope you find this website informative and useful. Please feel free to connect with us to RISE UP and change the world together.{'\n\n'}
              Jc Ankur Jhunjhunwala{'\n'}
              National President 2025{'\n'}
              JCI India.
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={styles.header}>
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
          renderItem={renderItem}
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
        />
        {renderPagination()}
      </View>

      {renderProfileCard()}
      {renderZonePresidentCard()}
      {renderNationalPresidentCard()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 5,
  },
  headerIcon: {
    width: 35,
    height: 35,
  },
  sliderContainer: {
    height: 300,
    width: width,
    backgroundColor: '#f0f0f0',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  imageContainer: {
    width: width - 20, // Accounting for reduced padding
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sliderImage: {
    width: width - 20, // Accounting for reduced padding
    height: 300,
    borderRadius: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  profileCard: {
    marginHorizontal: 15,
    marginVertical: 20,
    backgroundColor: '#1a73e8',
    borderRadius: 15,
    padding: 15,
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
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginRight: 12,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
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
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 12,
  },
  cardFooterText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  zonePresidentCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#2c3e50',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  zonePresidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  zonePresidentTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  zonePresidentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  zonePresidentInfo: {
    flex: 1,
    marginRight: 15,
  },
  zonePresidentName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  zonePresidentDesignation: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  zonePresidentImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  zonePresidentImage: {
    width: '100%',
    height: '100%',
  },
  zonePresidentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
  },
  zonePresidentFooterText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  nationalPresidentCard: {
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#1a237e',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nationalPresidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  nationalPresidentTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  nationalPresidentContent: {
    marginBottom: 15,
  },
  nationalPresidentName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nationalPresidentDesignation: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 15,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
  },
}); 