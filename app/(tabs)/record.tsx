import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { Play, Pause } from 'lucide-react-native';

export default function RecordScreen() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  return (
    <View style={styles.container}>
      <View style={[styles.content, !isSmallScreen && styles.contentWide]}>
        <Text style={[styles.title, !isSmallScreen && styles.titleWide]}>
          Record{'\n'}Emergency Audio
        </Text>
        
        <Text style={[styles.description, !isSmallScreen && styles.descriptionWide]}>
          Guardian gives you the ability to record your Voice Recording
          and send it seamlessly to your loved one's in case of Emergency.
        </Text>

        <View style={[styles.recordingContainer, !isSmallScreen && styles.recordingContainerWide]}>
          <View style={[styles.waveform, !isSmallScreen && styles.waveformWide]}>
            {/* Placeholder for waveform visualization */}
            <View style={styles.waveformLine} />
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton}>
              <Play size={24} color="#FF1493" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlButton, styles.recordButton]}>
              <View style={styles.recordIndicator} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Pause size={24} color="#FF1493" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.finishButton, !isSmallScreen && styles.finishButtonWide]}>
          <Text style={styles.finishButtonText}>Finish</Text>
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
  content: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.OS === 'web' ? 24 : 60,
  },
  contentWide: {
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#333',
    marginBottom: 16,
  },
  titleWide: {
    fontSize: 40,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    lineHeight: 24,
    marginBottom: 48,
  },
  descriptionWide: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 28,
    maxWidth: 560,
    alignSelf: 'center',
  },
  recordingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingContainerWide: {
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },
  waveform: {
    width: '100%',
    height: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  waveformWide: {
    height: 160,
  },
  waveformLine: {
    width: '80%',
    height: 2,
    backgroundColor: '#E2E8F0',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF1493',
  },
  recordIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF1493',
  },
  finishButton: {
    height: Platform.OS === 'web' ? 52 : 44,
    backgroundColor: '#000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
  finishButtonWide: {
    maxWidth: 320,
    alignSelf: 'center',
    width: '100%',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});