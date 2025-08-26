import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function AdminHomeScreen() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [updateRequests, setUpdateRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [groupedUsers, setGroupedUsers] = useState({});
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    pendingUpdates: 0
  });

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/all-users`);
      const users = response.data;

      const grouped = users.reduce((acc, user) => {
        const location = user.location || 'Unknown Location';
        if (!acc[location]) {
          acc[location] = [];
        }
        acc[location].push(user);
        return acc;
      }, {});

      setAllUsers(users);
      setGroupedUsers(grouped);
    } catch (error) {
      console.error('Error fetching all users:', error);
      Alert.alert('Error', 'Failed to fetch all users');
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/total-users`);
      setStats(prev => ({ ...prev, totalUsers: response.data.count }));
    } catch (error) {
      console.error('Error fetching total users:', error);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/pending-users`);
      setPendingUsers(response.data);
      setStats(prev => ({ ...prev, pendingUsers: response.data.length }));
    } catch (error) {
      console.error('Error fetching pending users:', error);
      Alert.alert('Error', 'Failed to fetch pending users');
    }
  };

  const fetchUpdateRequests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/update-requests`);
      setUpdateRequests(response.data);
      setStats(prev => ({ ...prev, pendingUpdates: response.data.length }));
    } catch (error) {
      console.error('Error fetching update requests:', error);
      Alert.alert('Error', 'Failed to fetch update requests');
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/approve-user/${userId}`);
      Alert.alert('Success', 'User approved successfully');
      fetchPendingUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      Alert.alert('Error', 'Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/reject-user/${userId}`);
      Alert.alert('Success', 'User rejected successfully');
      fetchPendingUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
      Alert.alert('Error', 'Failed to reject user');
    }
  };

  const handleApproveUpdate = async (requestId) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/approve-update/${requestId}`);
      Alert.alert('Success', 'Update request approved successfully');
      fetchUpdateRequests();
    } catch (error) {
      console.error('Error approving update:', error);
      Alert.alert('Error', 'Failed to approve update request');
    }
  };

  const handleRejectUpdate = async (requestId) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/reject-update/${requestId}`);
      Alert.alert('Success', 'Update request rejected successfully');
      fetchUpdateRequests();
    } catch (error) {
      console.error('Error rejecting update:', error);
      Alert.alert('Error', 'Failed to reject update request');
    }
  };

  const handleLogout = () => {
    router.replace('/');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchTotalUsers(),
      fetchPendingUsers(),
      fetchUpdateRequests(),
      fetchAllUsers()
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTotalUsers();
    fetchPendingUsers();
    fetchUpdateRequests();
    fetchAllUsers();
  }, []);

  const handleTotalUsersPress = () => {
    setShowAllUsers(!showAllUsers);
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <Image
        source={{ uri: item.profilePicture }}
        style={styles.userImage}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.fullName}</Text>
        <Text style={styles.userPhone}>Phone: {item.mobileNumber}</Text>
        <Text style={styles.userOccupation}>Occupation: {item.occupation || 'N/A'}</Text>
        <Text style={styles.userLocation}>Location: {item.location || 'N/A'}</Text>
        <Text style={styles.userDOB}>Date of Birth: {item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString() : 'N/A'}</Text>
        <Text style={styles.userStatus}>Status: {item.status}</Text>
      </View>
      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(item._id)}
          >
            <Ionicons name="checkmark" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleReject(item._id)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderUpdateRequestItem = ({ item }) => (
    <View style={styles.updateCard}>
      <View style={styles.updateHeader}>
        <Image
          source={{ uri: item.userId.profilePicture }}
          style={styles.updateUserImage}
        />
        <View style={styles.updateUserInfo}>
          <Text style={styles.updateUserName}>{item.userId.fullName}</Text>
          <Text style={styles.updateUserPhone}>{item.userId.mobileNumber}</Text>
          <Text style={styles.updateField}>Field: {item.field}</Text>
        </View>
      </View>
      <View style={styles.updateContent}>
        <Text style={styles.updateValue}>
          New Value: {item.type === 'image' ? 'Profile Picture' : item.newValue}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.approveButton]}
          onPress={() => handleApproveUpdate(item._id)}
        >
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleRejectUpdate(item._id)}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome, Admin!</Text>
          <Text style={styles.welcomeText}>
            You have successfully logged in to the admin portal.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statCard} 
            onPress={handleTotalUsersPress}
          >
            <Ionicons name="people-outline" size={32} color="#1a73e8" />
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </TouchableOpacity>

          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={32} color="#1a73e8" />
            <Text style={styles.statNumber}>{stats.pendingUsers}</Text>
            <Text style={styles.statLabel}>Pending Users</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="create-outline" size={32} color="#1a73e8" />
            <Text style={styles.statNumber}>{stats.pendingUpdates}</Text>
            <Text style={styles.statLabel}>Update Requests</Text>
          </View>
        </View>

        {showAllUsers && (
          <ScrollView style={styles.pendingSection}>
            <Text style={styles.sectionTitle}>All Users by Club</Text>
            {Object.keys(groupedUsers).map((location) => (
              <View key={location}>
                <Text style={styles.locationHeader}>{location}</Text>
                <FlatList
                  data={groupedUsers[location]}
                  renderItem={renderUserItem}
                  keyExtractor={(item) => item._id}
                  contentContainerStyle={styles.listContainer}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>No users in this club</Text>
                  }
                  scrollEnabled={false}
                />
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.pendingSection}>
          <Text style={styles.sectionTitle}>Pending Users</Text>
          <FlatList
            data={pendingUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No pending users</Text>
            }
          />
        </View>

        <View style={styles.pendingSection}>
          <Text style={styles.sectionTitle}>Update Requests</Text>
          <FlatList
            data={updateRequests}
            renderItem={renderUpdateRequestItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No pending update requests</Text>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a73e8',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeText: {
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginVertical: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
  },
  pendingSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userPhone: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  userOccupation: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  userLocation: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  userDOB: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  userEmail: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  userStatus: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  updateCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  updateUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  updateUserInfo: {
    marginLeft: 12,
    flex: 1,
  },
  updateUserName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateField: {
    color: '#666',
    fontSize: 14,
  },
  updateContent: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  updateValue: {
    color: '#333',
  },
  updateUserPhone: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  locationHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 16,
    color: '#333',
  },
}); 