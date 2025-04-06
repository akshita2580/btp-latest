import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform, Alert } from 'react-native';
import { Bell, Phone, Mic, MapPin, Bot, UserPlus } from 'lucide-react-native';
import { router } from 'expo-router';
import { useContacts } from '../../context/ContactsContext';
import { useUser } from '../../context/UserContext';
import { useState, useEffect } from 'react';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const { contacts, emergencyMessage } = useContacts();
  const { user } = useUser();
  const [isSending, setIsSending] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Location permission is required for sending your location during emergencies.',
          [{ text: 'OK' }]
        );
        return;
      }
    })();
  }, []);

  const handleUpdateContacts = () => {
    router.push('/update-contacts');
  };

  const handleSOS = async () => {
    if (contacts.length === 0) {
      Alert.alert(
        'No Contacts',
        'Please add emergency contacts first.',
        [
          {
            text: 'Add Contacts',
            onPress: () => router.push('/(tabs)/contacts'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Send SOS',
      'Are you sure you want to send an emergency SOS message to your contacts?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send SOS',
          style: 'destructive',
          onPress: sendEmergencySMS,
        },
      ],
      { cancelable: false }
    );
  };

  const sendEmergencySMS = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'SMS functionality is not available on web platforms.');
      return;
    }

    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Not Available', 'SMS is not available on this device');
      return;
    }

    setIsSending(true);

    try {
      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      let fullMessage = emergencyMessage;
      
      if (currentLocation) {
        const mapsUrl = `https://www.google.com/maps?q=${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
        fullMessage = `${emergencyMessage}\n\nMy current location: ${mapsUrl}`;
      }

      const phoneNumbers = contacts.map(contact => contact.phone);
      const { result } = await SMS.sendSMSAsync(phoneNumbers, fullMessage);

      if (result === 'sent') {
        Alert.alert('Success', 'Emergency messages sent successfully');
      } else {
        Alert.alert('Error', 'Failed to send some messages');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send emergency messages');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, !isSmallScreen && styles.headerWide]}>
        <Text style={styles.welcomeText}>Welcome {user?.fullName}!</Text>
      </View>

      <View style={[styles.content, !isSmallScreen && styles.contentWide]}>
        <View style={[styles.grid, !isSmallScreen && styles.gridWide]}>
          <TouchableOpacity 
            style={[
              styles.gridItem, 
              !isSmallScreen && styles.gridItemWide,
              isSending && styles.gridItemDisabled,
              styles.sosItem
            ]}
            onPress={handleSOS}
            disabled={isSending}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FFE4E4' }]}>
              <Bell size={24} color="#FF4444" />
            </View>
            <Text style={styles.gridItemText}>
              {isSending ? 'Sending SOS...' : 'SOS'}
            </Text>
            {isSending && (
              <Text style={styles.sendingText}>Sending emergency alerts...</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridItem, !isSmallScreen && styles.gridItemWide]}
            onPress={() => router.push('/(tabs)/emergency-sms')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E4F1FF' }]}>
              <Phone size={24} color="#4477FF" />
            </View>
            <Text style={styles.gridItemText}>Emergency{'\n'}SMS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridItem, !isSmallScreen && styles.gridItemWide]}
            onPress={() => router.push('/(tabs)/record')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FFE4FF' }]}>
              <Mic size={24} color="#FF44FF" />
            </View>
            <Text style={styles.gridItemText}>Record{'\n'}Audio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.gridItem, !isSmallScreen && styles.gridItemWide]}>
            <View style={[styles.iconContainer, { backgroundColor: '#E4FFE4' }]}>
              <MapPin size={24} color="#44FF44" />
            </View>
            <Text style={styles.gridItemText}>Track Me</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.gridItem, !isSmallScreen && styles.gridItemWide]}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFF4E4' }]}>
              <Bot size={24} color="#FFAA44" />
            </View>
            <Text style={styles.gridItemText}>ShieldMate{'\n'}Bot</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridItem, !isSmallScreen && styles.gridItemWide]}
            onPress={handleUpdateContacts}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#F4E4FF' }]}>
              <UserPlus size={24} color="#AA44FF" />
            </View>
            <Text style={styles.gridItemText}>Update{'\n'}Contacts</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  contentWide: {
    maxWidth: 1024,
    alignSelf: 'center',
    width: '100%',
    padding: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'web' ? 24 : 60,
    paddingBottom: 24,
    backgroundColor: '#FF1493',
  },
  headerWide: {
    paddingTop: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  gridWide: {
    padding: 0,
    gap: 24,
  },
  gridItem: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridItemWide: {
    width: 'calc(33.333% - 16px)',
    aspectRatio: undefined,
    height: 200,
  },
  gridItemDisabled: {
    opacity: 0.6,
  },
  sosItem: {
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridItemText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    textAlign: 'center',
  },
  sendingText: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#FF4444',
    marginTop: 8,
    textAlign: 'center',
  },
});