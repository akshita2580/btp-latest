import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { LogOut, Settings, Shield, Bell } from 'lucide-react-native';
import React, { useState } from 'react';


export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      router.replace('/(auth)/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      icon: <Settings size={24} color="#64748B" />,
      title: 'Account Settings',
      subtitle: 'Manage your account preferences',
    },
    {
      icon: <Shield size={24} color="#64748B" />,
      title: 'Privacy & Security',
      subtitle: 'Control your privacy settings',
    },
    {
      icon: <Bell size={24} color="#64748B" />,
      title: 'Notifications',
      subtitle: 'Customize your alerts',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, !isSmallScreen && styles.headerWide]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={[styles.content, !isSmallScreen && styles.contentWide]}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {auth.currentUser?.email?.[0].toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.email}>{auth.currentUser?.email}</Text>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              {item.icon}
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.signOutButton, isLoading && styles.signOutButtonDisabled]}
          onPress={handleSignOut}
          disabled={isLoading}
        >
          <LogOut size={24} color="#fff" />
          <Text style={styles.signOutButtonText}>
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
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
  userInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  email: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  menuSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 8,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  menuItemText: {
    marginLeft: 16,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
  },
  signOutButton: {
    backgroundColor: '#FF4444',
    height: Platform.OS === 'web' ? 56 : 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  signOutButtonDisabled: {
    backgroundColor: '#666',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});