import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { ArrowLeft } from 'lucide-react-native';

export default function ForgotPassword() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setStatus('loading');
      setError('');
      await sendPasswordResetEmail(auth, email);
      setStatus('success');
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, !isSmallScreen && styles.contentWide]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {status === 'success' && (
            <Text style={styles.successText}>
              Password reset instructions have been sent to your email address.
            </Text>
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={status !== 'loading' && status !== 'success'}
          />

          <TouchableOpacity 
            style={[
              styles.button,
              status === 'loading' && styles.buttonLoading,
              status === 'success' && styles.buttonSuccess
            ]} 
            onPress={handleResetPassword}
            disabled={status === 'loading' || status === 'success'}
          >
            <Text style={styles.buttonText}>
              {status === 'loading' ? 'Sending...' : 
               status === 'success' ? 'Email Sent' : 
               'Reset Password'}
            </Text>
          </TouchableOpacity>

          {status === 'success' && (
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryButtonText}>Return to Sign In</Text>
            </TouchableOpacity>
          )}
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
    padding: 24,
  },
  contentWide: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    color: '#059669',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
  },
  input: {
    height: Platform.OS === 'web' ? 52 : 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    backgroundColor: '#F8FAFC',
  },
  button: {
    height: Platform.OS === 'web' ? 52 : 44,
    backgroundColor: '#FF1493',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLoading: {
    backgroundColor: '#666',
  },
  buttonSuccess: {
    backgroundColor: '#059669',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  secondaryButton: {
    height: Platform.OS === 'web' ? 52 : 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});