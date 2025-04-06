import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Phone, Heart, CreditCard as Edit2, Save } from 'lucide-react-native';
import { useState } from 'react';
import { useContacts } from '../context/ContactsContext';

export default function UpdateContactsScreen() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const { contacts, updateContact } = useContacts();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleSave = () => {
    if (editingContact) {
      updateContact(editingContact);
      setEditingContact(null);
    }
  };

  const handleCancel = () => {
    setEditingContact(null);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, !isSmallScreen && styles.headerWide]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Contacts</Text>
      </View>

      <ScrollView style={[styles.content, !isSmallScreen && styles.contentWide]}>
        <Text style={styles.subtitle}>Your saved emergency contacts</Text>

        <View style={styles.contactList}>
          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              {editingContact?.id === contact.id ? (
                <View style={styles.editForm}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                      style={styles.input}
                      value={editingContact.name}
                      onChangeText={(text) => setEditingContact({ ...editingContact, name: text })}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone:</Text>
                    <TextInput
                      style={styles.input}
                      value={editingContact.phone}
                      onChangeText={(text) => setEditingContact({ ...editingContact, phone: text })}
                      keyboardType="phone-pad"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Relation:</Text>
                    <TextInput
                      style={styles.input}
                      value={editingContact.relation}
                      onChangeText={(text) => setEditingContact({ ...editingContact, relation: text })}
                    />
                  </View>
                  <View style={styles.editActions}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                      <Save size={20} color="#fff" />
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.contactInfo}>
                  <View style={styles.contactHeader}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => handleEdit(contact)}
                    >
                      <Edit2 size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.contactDetails}>
                    <View style={styles.detailRow}>
                      <Phone size={16} color="#666" />
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Heart size={16} color="#666" />
                      <Text style={styles.contactRelation}>{contact.relation}</Text>
                    </View>
                  </View>
                </View>
              )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A0072',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 24 : 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
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
    padding: 16,
  },
  contentWide: {
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    marginBottom: 24,
  },
  contactList: {
    gap: 16,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactName: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  contactDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactPhone: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  contactRelation: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  editForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  input: {
    height: Platform.OS === 'web' ? 52 : 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    backgroundColor: '#F8FAFC',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    height: Platform.OS === 'web' ? 52 : 44,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  saveButton: {
    flex: 1,
    height: Platform.OS === 'web' ? 52 : 44,
    backgroundColor: '#FF1493',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyState: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  emptyStateText: {
    color: '#fff',
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
});