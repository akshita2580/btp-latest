import { View, Text, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions, Platform, ScrollView, Alert } from 'react-native';
import { ChevronLeft, MessageSquare, Send, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';
import { useContacts } from '../../context/ContactsContext';
import { useState, useEffect } from 'react';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';

export default function EmergencySMSScreen() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const { contacts, emergencyMessage, updateEmergencyMessage } = useContacts();
  const [message, setMessage] = useState(emergencyMessage);
  const [isSending, setIsSending] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (err) {
        setLocationError('Error getting location');
      }
    })();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleUpdateMessage = () => {
    updateEmergencyMessage(message);
  };

  const handleSendSOS = async () => {
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
      let fullMessage = message;
      
      if (location) {
        const mapsUrl = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
        fullMessage = `${message}\n\nMy current location: ${mapsUrl}`;
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
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency SMS</Text>
      </View>

      <ScrollView style={[styles.content, !isSmallScreen && styles.contentWide]}>
        <View style={styles.messageSection}>
          <View style={styles.messageHeader}>
            <MessageSquare size={24} color="#FF1493" />
            <Text style={styles.messageTitle}>Emergency Message</Text>
          </View>
          
          <TextInput
            style={styles.messageInput}
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
            placeholder="Enter your emergency message"
            placeholderTextColor="#666"
          />

          <TouchableOpacity 
            style={styles.updateButton}
            onPress={handleUpdateMessage}
          >
            <Text style={styles.updateButtonText}>Update Message</Text>
          </TouchableOpacity>

          <View style={styles.locationStatus}>
            <MapPin size={20} color={location ? "#4CAF50" : "#FF4444"} />
            <Text style={[styles.locationText, location ? styles.locationSuccess : styles.locationError]}>
              {location ? 'Location attached' : locationError || 'Getting location...'}
            </Text>
          </View>
        </View>

        <View style={styles.contactsSection}>
          <Text style={styles.contactsTitle}>Message will be sent to:</Text>
          
          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelation}>{contact.relation}</Text>
              </View>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
          ))}

          {contacts.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No contacts added yet</Text>
              <TouchableOpacity 
                style={styles.addContactButton}
                onPress={() => router.push('/(tabs)/contacts')}
              >
                <Text style={styles.addContactButtonText}>Add Contacts</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {contacts.length > 0 && (
        <View style={[styles.footer, !isSmallScreen && styles.footerWide]}>
          <TouchableOpacity 
            style={[styles.sosButton, isSending && styles.sosButtonSending]}
            onPress={handleSendSOS}
            disabled={isSending}
          >
            <Send size={24} color="#fff" />
            <Text style={styles.sosButtonText}>
              {isSending ? 'Sending SOS...' : 'Send SOS Message'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 24 : 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FF1493',
  },
  headerWide: {
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  contentWide: {
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  messageSection: {
    marginBottom: 32,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  messageTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#333',
    backgroundColor: '#F8FAFC',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  updateButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    marginTop: 12,
  },
  updateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#FF1493',
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  locationSuccess: {
    color: '#4CAF50',
  },
  locationError: {
    color: '#FF4444',
  },
  contactsSection: {
    gap: 16,
  },
  contactsTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  contactName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  contactRelation: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginTop: 4,
  },
  contactPhone: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  emptyState: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  addContactButton: {
    backgroundColor: '#FF1493',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addContactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerWide: {
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  sosButton: {
    backgroundColor: '#FF4444',
    height: Platform.OS === 'web' ? 56 : 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  sosButtonSending: {
    backgroundColor: '#666',
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});


