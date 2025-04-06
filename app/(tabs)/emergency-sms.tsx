import { View, Text, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions, Platform, ScrollView, Alert } from 'react-native';
import { ChevronLeft, MessageSquare, Send, MapPin, TriangleAlert as AlertTriangle } from 'lucide-react-native';
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
  const [sendingProgress, setSendingProgress] = useState({ total: 0, sent: 0 });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 10000 // 10 second timeout
        });
        setLocation(location);
      } catch (err) {
        setLocationError('Error getting location');
      }
    })();
  }, []);

  const handleBack = () => {
    if (isSending) {
      Alert.alert(
        'Messages in Progress',
        'Are you sure you want to leave? Messages will continue sending in the background.',
        [
          { text: 'Stay', style: 'cancel' },
          { text: 'Leave', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const handleUpdateMessage = () => {
    if (message.trim() === '') {
      Alert.alert('Error', 'Message cannot be empty');
      return;
    }
    updateEmergencyMessage(message);
    Alert.alert('Success', 'Emergency message has been updated');
  };

  const handleSendSOS = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'SMS functionality is not available on web platforms.');
      return;
    }

    if (!contacts.length) {
      Alert.alert('No Contacts', 'Please add emergency contacts first.');
      return;
    }

    if (message.trim() === '') {
      Alert.alert('Error', 'Please enter an emergency message');
      return;
    }

    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Not Available', 'SMS is not available on this device');
      return;
    }

    Alert.alert(
      'Send Emergency Messages',
      `Are you sure you want to send emergency messages to ${contacts.length} contact${contacts.length > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', style: 'destructive', onPress: sendMessages }
      ]
    );
  };

  const sendMessages = async () => {
    setIsSending(true);
    setSendingProgress({ total: contacts.length, sent: 0 });

    try {
      // Get fresh location data
      let currentLocation = location;
      if (!currentLocation) {
        try {
          currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeout: 5000
          });
        } catch (locError) {
          console.error('Location error:', locError);
          Alert.alert(
            'Location Warning',
            'Could not get your current location. The message will be sent without location information.',
            [{ text: 'Continue' }]
          );
        }
      }

      let fullMessage = message.trim();
      if (currentLocation) {
        const mapsUrl = `https://www.google.com/maps?q=${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
        fullMessage = `${fullMessage}\n\nMy current location: ${mapsUrl}`;
      }

      let successCount = 0;
      let failureCount = 0;

      for (const [index, contact] of contacts.entries()) {
        try {
          // Add delay between messages to prevent carrier throttling
          if (index > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }

          const { result } = await SMS.sendSMSAsync(
            [contact.phone],
            fullMessage
          );

          if (result === 'sent') {
            successCount++;
          } else {
            failureCount++;
            console.warn(`SMS to ${contact.name} (${contact.phone}) failed with result:`, result);
          }

          setSendingProgress(prev => ({ ...prev, sent: index + 1 }));
        } catch (smsError) {
          failureCount++;
          console.error(`Error sending SMS to ${contact.name}:`, smsError);
        }
      }

      if (successCount === contacts.length) {
        Alert.alert(
          'Success',
          'Emergency messages have been sent to all contacts. They may take a few minutes to deliver.',
          [{ text: 'OK' }]
        );
      } else if (successCount > 0) {
        Alert.alert(
          'Partial Success',
          `Sent to ${successCount} out of ${contacts.length} contacts. Some messages may take time to deliver.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          'Failed to send messages. Please try again or send messages manually.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('SMS sending error:', error);
      Alert.alert(
        'Error',
        'There was a problem sending messages. Please try again or send messages manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSending(false);
      setSendingProgress({ total: 0, sent: 0 });
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
            editable={!isSending}
          />

          <TouchableOpacity 
            style={[styles.updateButton, isSending && styles.buttonDisabled]}
            onPress={handleUpdateMessage}
            disabled={isSending}
          >
            <Text style={[styles.updateButtonText, isSending && styles.buttonTextDisabled]}>
              Update Message
            </Text>
          </TouchableOpacity>

          <View style={styles.locationStatus}>
            <MapPin size={20} color={location ? "#4CAF50" : "#FF4444"} />
            <Text style={[styles.locationText, location ? styles.locationSuccess : styles.locationError]}>
              {location ? 'Location attached' : locationError || 'Getting location...'}
            </Text>
          </View>

          {Platform.OS === 'web' && (
            <View style={styles.webWarning}>
              <AlertTriangle size={20} color="#FF9800" />
              <Text style={styles.webWarningText}>
                SMS functionality is not available on web platforms
              </Text>
            </View>
          )}
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
          {isSending && (
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(sendingProgress.sent / sendingProgress.total) * 100}%` }
                ]} 
              />
            </View>
          )}
          <TouchableOpacity 
            style={[styles.sosButton, isSending && styles.sosButtonSending]}
            onPress={handleSendSOS}
            disabled={isSending || Platform.OS === 'web'}
          >
            <Send size={24} color="#fff" />
            <Text style={styles.sosButtonText}>
              {isSending 
                ? `Sending... (${sendingProgress.sent}/${sendingProgress.total})`
                : 'Send SOS Message'
              }
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
  buttonDisabled: {
    opacity: 0.5,
  },
  updateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#FF1493',
  },
  buttonTextDisabled: {
    color: '#666',
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
  webWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  webWarningText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#E65100',
    flex: 1,
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
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
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