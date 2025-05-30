import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const loData = [
  { id: 1, loName: 'JCI ALIGARH SHINE', president: 'JC NAMRATA', phone: '9760909123' },
  { id: 2, loName: 'JCI BAREILY JHUMKA CITY', president: 'JC MAHAK AGARWAL', phone: '9690212135' },
  { id: 3, loName: 'JCI BAREILY MAGNET CITY', president: 'JC NIMIT AGARWAL', phone: '9837071585' },
  { id: 4, loName: 'JCI BRAHMAVARTA', president: 'JC TARUN SEGHAL', phone: '8756111777' },
  { id: 5, loName: 'JCI HATHRAS', president: 'JC MANISH MITTAL', phone: '8273464611' },
  { id: 6, loName: 'JCI HATHRAS GREATER', president: 'JC NARESH AGRAWAL', phone: '9412732557' },
  { id: 7, loName: 'JCI HATHRAS RAINBOW', president: 'JC DEEPTI BANSAL', phone: '8630845518' },
  { id: 8, loName: 'JCI HATHRAS VICTORY', president: 'JC MAMTA VARSHNEY', phone: '9027554611' },
  { id: 9, loName: 'JCI HATHRAS SPARKLE', president: 'JC SEEMA MITTAL', phone: '8923961944' },
  { id: 10, loName: 'JCI JHANSI CLASSIC', president: 'JC KUSHAGRA KILPAN', phone: '7007555262' },
  { id: 11, loName: 'JCI JHANSI FEMINA', president: 'JC SUMAN AGARWAL', phone: '9696236856' },
  { id: 12, loName: 'JCI JHANSI GOONJ', president: 'JC NEESHU JAIN', phone: '8299235044' },
  { id: 13, loName: 'JCI JHANSI UDAAN', president: 'JC PRAVEEN GUPTA', phone: '9889003089' },
  { id: 14, loName: 'JCI KAIMGANJ GREATER', president: 'JC AKSHAT RASTOGI', phone: '9936061068' },
  { id: 15, loName: 'JCI KANHA', president: 'JC PREETAM AGRAWAL', phone: '9045777149' },
  { id: 16, loName: 'JCI KANPUR', president: 'JC AMRISH SENGAR', phone: '9936578999' },
  { id: 17, loName: 'JCI KANPUR INDUSTRIAL', president: 'JC PRANIT AGARWAL', phone: '9621845000' },
  { id: 18, loName: 'JCI KANPUR LAVANYA', president: 'JC DEEPALI MISHRA', phone: '9670177358' },
  { id: 19, loName: 'JCI KASGANJ JAGRATI', president: 'JC MISTHI AGRAWAL', phone: '9927660001' },
  { id: 20, loName: 'JCI MATHURA', president: 'JC VISHAL GOYAL', phone: '9359991804' },
  { id: 21, loName: 'JCI MATHURA AANYA', president: 'JC SONAM AGRAWAL', phone: '8630195655' },
  { id: 22, loName: 'JCI MATHURA CITY', president: 'C GULSHAN KHANDELWAL', phone: '7351379725' },
  { id: 23, loName: 'JCI MATHURA ELITE (2024)', president: 'JC NITIN CHAUDHARY', phone: '9897640000' },
  { id: 24, loName: 'JCI MATHURA GREATER', president: 'JC KISHOR MITTAL', phone: '8630103044' },
  { id: 25, loName: 'JCI MATHURA KALINDI', president: 'JC RUMA AGRAWAL', phone: '9897011207' },
  { id: 26, loName: 'JCI MATHURA PANKHURI', president: 'JC RITIKA AGRAWAL', phone: '9359321693' },
  { id: 27, loName: 'JCI MATHURA ROYAL', president: 'JC AJAY AGRAWAL', phone: '9837072423' },
  { id: 28, loName: 'JCI NOIDA NCR (2024)', president: null, phone: null },
  { id: 29, loName: 'JCI RAE BAREILY', president: 'JC PRABHU AGRAWAL', phone: '9918201016' },
  { id: 30, loName: 'JCI RANI LAXMIBAI', president: null, phone: null },
  { id: 31, loName: 'JCI RATH', president: null, phone: null },
  { id: 32, loName: 'JCI RUDRAPUR', president: 'JC SUMIT KUMAR', phone: '9837021941' },
  { id: 33, loName: 'JCI RUDRAPUR QUEEN (2023)', president: 'JC AASTHA', phone: '9756214000' },
];

export default function MoreScreen() {
  const handleTermsOfService = async () => {
    const url = 'https://www.jciindia.in/content/terms-of-service/';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Cannot open URL: " + url);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  const handleAboutJCI = async () => {
    const url = 'https://www.jciindia.in/about-jci/';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Cannot open URL: " + url);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  const handleCall = async (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device.');
      }
    } catch (error) {
      console.error("Error opening phone dialer:", error);
      Alert.alert('Error', 'An error occurred while trying to make a call.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More Options</Text>
      </View>

      <View style={styles.menuContainer}>
        {loData.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.loName}>{item.loName}</Text>
            <Text style={styles.presidentName}>President 2025: {item.president || 'N/A'}</Text>
            <TouchableOpacity onPress={() => item.phone && handleCall(item.phone)} disabled={!item.phone}>
              <Text style={[styles.phoneNumber, !item.phone && styles.disabledText]}>Phone: {item.phone || 'N/A'}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.menuItem} onPress={handleAboutJCI}>
          <Ionicons name="information-circle-outline" size={24} color="#1a73e8" />
          <Text style={styles.menuText}>About JCI</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleTermsOfService}>
          <Ionicons name="document-text-outline" size={24} color="#1a73e8" />
          <Text style={styles.menuText}>Terms & Conditions</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#1a73e8" />
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  menuContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  loName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  presidentName: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#1a73e8',
    textDecorationLine: 'underline',
  },
  disabledText: {
    color: '#888',
    textDecorationLine: 'none',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
}); 