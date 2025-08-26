import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// PZP Members Data
const pzpMembers = [
  {
    id: 1,
    name: 'JCI Sen Rajesh Sharma',
    email: 'rajesh1531965@gmail.com',
    address: '7, Prasad market, union Bank building, Raebareli 229001',
    phone: '9838923113',
    year: '1996',
    image: require('../assets/images/PZP/IMG_20250207_184357 - Rajesh Sharma.jpg'),
  },
  {
    id: 2,
    name: 'Jc Vinay Kumar Agarwal',
    email: 'jcvinaypzp2@gmail.com',
    address: '147, Daru Bhondela, Near Gudari Jain Mandir',
    phone: '9415949015, 7007686326',
    year: '2004',
    image: require('../assets/images/PZP/IMG20241208222143 - Vinay Agarwal.jpg'),
  },
  {
    id: 3,
    name: 'Jc Rishi Agarwal',
    email: 'jcjfmrishi@gmail.com',
    address: '617, kachehry road, Near s.j.s public school Raebareli',
    phone: '9935150424',
    year: '2012',
    image: require('../assets/images/PZP/IMG_20250824_175620 - Vimla Agencies.jpg'),
  },
  {
    id: 4,
    name: 'Jc Anshul Agrawal',
    email: 'aamodevents@gmail.com',
    address: 'A-12 Shri Radhapuram, Mathura',
    phone: '9548452672',
    year: '2013',
    image: require('../assets/images/PZP/IMG_20250312_141851 - Anshul Agrawal.jpg'),
  },
  {
    id: 5,
    name: 'JFP Prabhat Srivastava',
    email: 'jcprabhatrbl@rediffmail.com',
    address: '265, Nand Bhawan, Khali Sahat Raebareli',
    phone: '93354161709415000000',
    year: '2009',
    image: require('../assets/images/PZP/Screenshot_2025-08-24-18-13-29-54_92460851df6f172a4592fca41cc2d2e6 - Prabhat Kumar Srivastava.jpg'),
  },
  {
    id: 6,
    name: 'Jc Rajneesh Kapoor',
    email: 'jchgfrajneesh@gmail.com',
    address: 'Handloom House Ghantaghar Chauraha Raebareli',
    phone: '9005626111, 9415117978',
    year: '2011',
    image: require('../assets/images/PZP/Screenshot_20250727-150717_WhatsApp - rajneesh kapoor.jpg'),
  },
  {
    id: 7,
    name: 'Jc Tarun Saxena',
    email: 'taruns.alg@gmail.com',
    address: 'Deep explo Equipments Pvt Ltd Opp Singhal dharam kanta Near by gagan public school Agra Road Aligarh',
    phone: '9760040225',
    year: '1999',
    image: require('../assets/images/PZP/FB_IMG_1756042337995 - Tarun Saxena.jpg'),
  },
  {
    id: 8,
    name: 'JFP GAUTAM GUPTA',
    email: 'gautamgupta_ka@rediffmail.com',
    address: '66/04, Kachiyana Mohal, Hoolaganj, Kanpur',
    phone: '9918101412',
    year: '2010',
    image: require('../assets/images/PZP/c4924515-630c-4a79-a274-b0378c075394 - MANIKA GUPTA.jpeg'),
  },
  {
    id: 9,
    name: 'Jc Kishan Gupta',
    email: 'zpkishanzone2@gmail.com',
    address: 'Sai fertilizers Thandi Sadak Farrukhabad',
    phone: '9415146035, 8840732204',
    year: '2001',
    image: require('../assets/images/PZP/IMG_20220220_204641 - Kishan Gupta.jpg'),
  },
  {
    id: 10,
    name: 'JFM Sushant Tandon',
    email: 'task.sushant@gmail.com',
    address: '06, Chandapur House, Raebareli- 229001',
    phone: '9415034414, 6394783636',
    year: '2005 - 2006',
    image: require('../assets/images/PZP/20250318_114239 - Sushant Tandon.jpg'),
  },
  {
    id: 11,
    name: 'Jc Dinesh Chandra Shukla',
    email: 'dcshukla@hotmail.com',
    address: '601, Anand Palace, 10/499 Allen Ganj, Kanpur-208002',
    phone: '9839032619',
    year: '1997',
    image: require('../assets/images/PZP/IMG-20250721-WA0000 - DC Shukla.jpg'),
  },
  {
    id: 12,
    name: 'Jc Abhay Khare',
    email: 'abhaykharerath@gmail.com',
    address: '192, Atrouliya, Rath, (Hamirpur), Uttar Pradesh - 210431',
    phone: '9450268321',
    year: '2002',
    image: null,
  },
  {
    id: 13,
    name: 'JFP Girish Agarwal Modi',
    email: 'jcgirishagarwal@gmail.com',
    address: '05, Jawahar Chowk, Jhansi (UP) 284002',
    phone: '9415113650',
    year: '2016',
    image: require('../assets/images/PZP/Screenshot_2025-08-25-22-41-00-974_com.whatsapp - Jc Girish Agarwal.jpg'),
  },
  {
    id: 14,
    name: 'JCI PPP CA Rachit Agarwal',
    email: 'carachit313@gmail.com',
    address: '376, Pashupati Grand, Lower Ground Floor, Civil Lines, Jhansi',
    phone: '9616192939',
    year: '2018',
    image: require('../assets/images/PZP/20250719_161426~3(1) - CA Rachit Agarwal.jpg'),
  },
  {
    id: 15,
    name: 'Jc Ruchir Goyal',
    email: 'zpzone2@gmail.com',
    address: 'C-56/6, Anand Vihar, Maholi Road, Mathura',
    phone: '9997754077',
    year: '2021',
    image: require('../assets/images/PZP/IMG-20250825-WA0046 - ruchir goyal.jpg'),
  },
  {
    id: 16,
    name: 'JFP Namit Mittal',
    email: 'thenamitmittal@gmail.com',
    address: 'Vimal Press, Saraswati Kund, Mathura',
    phone: '9359995855',
    year: '2022',
    image: require('../assets/images/PZP/IMG-20220309-WA0075 - Namit Mittal.jpg'),
  },
];

export default function PZPMembersScreen() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Sort members by ZP year (oldest to newest)
  const sortedMembers = [...pzpMembers].sort((a, b) => {
    // Extract the first year from ranges like "2005 - 2006"
    const yearA = parseInt(a.year.split(' - ')[0]);
    const yearB = parseInt(b.year.split(' - ')[0]);
    return yearA - yearB;
  });

  const openMemberProfile = (member) => {
    setSelectedMember(member);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMember(null);
  };

  const renderMemberCard = (member) => (
    <TouchableOpacity
      key={member.id}
      style={styles.memberCard}
      onPress={() => openMemberProfile(member)}
      activeOpacity={0.7}
    >
      <View style={styles.cardRow}>
        {member.image ? (
          <Image source={member.image} style={styles.memberImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.memberName} numberOfLines={2}>
            {member.name}
          </Text>
          <Text style={styles.memberYear}>ZP Year: {member.year}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PZP Members</Text>
        <Text style={styles.headerSubtitle}>Zone Past Presidents</Text>
      </View>

      {/* Members Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.membersGrid}>
          {sortedMembers.map(renderMemberCard)}
        </View>
      </ScrollView>

      {/* Member Profile Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMember && (
              <>
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>

                {/* Profile Image */}
                <View style={styles.profileImageContainer}>
                  {selectedMember.image ? (
                    <Image
                      source={selectedMember.image}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.profilePlaceholderImage}>
                      <Ionicons name="person" size={50} color="#fff" />
                    </View>
                  )}
                </View>

                {/* Member Details */}
                <View style={styles.memberDetails}>
                  <Text style={styles.profileName}>{selectedMember.name}</Text>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="call" size={20} color="#1a73e8" />
                    <Text style={styles.detailText}>{selectedMember.phone}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={20} color="#1a73e8" />
                    <Text style={styles.detailText}>{selectedMember.address}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={20} color="#1a73e8" />
                    <Text style={styles.detailText}>ZP Year: {selectedMember.year}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="mail" size={20} color="#1a73e8" />
                    <Text style={styles.detailText}>{selectedMember.email}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#1a73e8',
    padding: 20,
    alignItems: 'center',
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  membersGrid: {
    padding: 15,
  },
  memberCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    padding: 15,
    paddingLeft: 20,
  },
  memberName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    lineHeight: 18,
  },
  memberYear: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberDetails: {
    width: '100%',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
    lineHeight: 22,
  },
}); 