import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { FontAwesome5 } from '@expo/vector-icons';
import AppText from '../AppText';

interface CameraModeProps {
  exercise: any;
  duration: number;
  onDone: () => void;
  onBack: () => void;
  onPause: () => void;
  onSkip: () => void;
  colors: any;
  recordingState: 'idle' | 'countdown' | 'recording' | 'paused';
  setRecordingState: (state: 'idle' | 'countdown' | 'recording' | 'paused') => void;
  countdown: number;
  timer: number | null;
  showDone: boolean;
  blinkAnim: Animated.Value;
  getReadyTimer?: number | null;
}

const CameraMode: React.FC<CameraModeProps> = ({
  exercise,
  duration,
  onDone,
  onBack,
  onPause,
  onSkip,
  colors,
  recordingState,
  setRecordingState,
  countdown,
  timer,
  showDone,
  blinkAnim,
  getReadyTimer,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef(null);

  // Request camera permission
  React.useEffect(() => {
    if (hasPermission === null) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, [hasPermission]);

  if (hasPermission === null) {
    return (
      <View style={styles.cameraContainer}>
        <AppText style={[styles.desc, { color: colors.text }]}>Requesting camera permission...</AppText>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.cameraContainer}>
        <AppText style={[styles.desc, { color: colors.text }]}>No access to camera</AppText>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView style={styles.camera} ref={cameraRef} facing={"front"}>
        <View style={styles.cameraOverlay}>
          {/* Recording UI */}
          {recordingState === 'idle' && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.danger }]}
              onPress={() => setRecordingState('countdown')}
            >
              <AppText style={styles.buttonText}>Record</AppText>
            </TouchableOpacity>
          )}
          {recordingState === 'countdown' && (
            <>
              <AppText style={[styles.getReadyText, { color: colors.text }]}>Get Ready!</AppText>
              {getReadyTimer && getReadyTimer > 3 ? (
                <AppText style={[styles.timerText, { color: colors.danger }]}>{getReadyTimer}s</AppText>
              ) : (
                <View style={styles.countdownContainer}>
                  <Animated.Text style={[styles.countdownDigit, { opacity: countdown === 3 ? 1 : 0.3, color: colors.danger }]}>3</Animated.Text>
                  <Animated.Text style={[styles.countdownDigit, { opacity: countdown === 2 ? 1 : 0.3, color: colors.danger }]}>2</Animated.Text>
                  <Animated.Text style={[styles.countdownDigit, { opacity: countdown === 1 ? 1 : 0.3, color: colors.danger }]}>1</Animated.Text>
                </View>
              )}
            </>
          )}
          {(recordingState === 'recording' || recordingState === 'paused') && (
            <View style={styles.recordingRow}>
              <Animated.View style={[styles.blinkDot, { opacity: blinkAnim, backgroundColor: colors.danger }]} />
              <AppText style={[styles.recordingText, { color: colors.danger }]}>
                {recordingState === 'paused' ? 'Paused' : 'Recording'}
              </AppText>
              <AppText style={[styles.timerText, { color: colors.danger }]}>{timer}s</AppText>
            </View>
          )}
          {showDone && (recordingState === 'recording' || recordingState === 'paused') && (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={onPause}>
                <AppText style={styles.buttonText}>
                  {recordingState === 'paused' ? 'Resume' : 'Pause'}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.skipButton, { backgroundColor: colors.textSecondary + '20' }]} onPress={onSkip}>
                <AppText style={[styles.skipButtonText, { color: colors.textSecondary }]}>Skip</AppText>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.link} onPress={onBack}>
            <AppText style={[styles.linkText, { color: '#fff' }]}>Back</AppText>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  countdownContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  countdownDigit: {
    fontSize: 48,
    fontFamily: 'Nunito-Bold',
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  blinkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  recordingText: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginRight: 16,
  },
  timerText: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
  },
  button: {
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
  },
  link: {
    marginTop: 8,
  },
  linkText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  desc: {
    fontSize: 18,
    textAlign: 'center',
  },
  getReadyText: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },
});

export default CameraMode; 