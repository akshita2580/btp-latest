import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { Link } from 'expo-router';

export default function Welcome() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  return (
    <View style={styles.container}>
      <View style={[styles.content, !isSmallScreen && styles.contentWide]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=1024' }}
          style={styles.image}
        />
        
        <Text style={[styles.title, !isSmallScreen && styles.titleWide]}>Welcome to our BTP</Text>
        <Text style={[styles.subtitle, !isSmallScreen && styles.subtitleWide]}>
          Your safety is our mission.{'\n'}Together, let's create a safer world for every woman.
        </Text>

        <View style={[styles.buttonContainer, !isSmallScreen && styles.buttonContainerWide]}>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(auth)/signin" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>I already have an account</Text>
            </TouchableOpacity>
          </Link>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWide: {
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  image: {
    width: 240,
    height: 240,
    marginBottom: 48,
    borderRadius: 120,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  titleWide: {
    fontSize: 40,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  subtitleWide: {
    fontSize: 18,
    lineHeight: 28,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  buttonContainerWide: {
    maxWidth: 360,
  },
  primaryButton: {
    height: Platform.OS === 'web' ? 52 : 44,
    backgroundColor: '#FF1493',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  secondaryButton: {
    height: Platform.OS === 'web' ? 52 : 44,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});