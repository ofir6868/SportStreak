import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Animated, Easing, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Camera, CameraView } from 'expo-camera';
import { FontAwesome5 } from '@expo/vector-icons';
import { useProgress } from '../components/ProgressContext';

const steps = ['explanation', 'privacy', 'camera'] as const;
type Step = typeof steps[number];

const ExerciseScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { exercise, idx } = route.params;
  const [step, setStep] = useState<Step>('explanation');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);
  const { markExerciseComplete, streak, streakUpdatedToday } = useProgress();
  const flameAnim = useRef(new Animated.Value(0)).current;
  const [recordingState, setRecordingState] = useState<'idle' | 'countdown' | 'recording'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState<number | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [blinkAnim] = useState(new Animated.Value(1));
  const duration = exercise.duration || 30;

  // Request camera permission on camera step
  React.useEffect(() => {
    if (step === 'camera' && hasPermission === null) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, [step, hasPermission]);

  // Blinking dot animation
  React.useEffect(() => {
    if (recordingState === 'recording') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
          Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      blinkAnim.setValue(1);
    }
  }, [recordingState]);

  // Countdown logic
  React.useEffect(() => {
    let countdownInterval: any;
    if (recordingState === 'countdown') {
      setCountdown(3);
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            setRecordingState('recording');
            setTimer(duration);
            setShowDone(true);
            return 3;
          }
          return prev - 1;
        });
      }, 800);
    }
    return () => clearInterval(countdownInterval);
  }, [recordingState, duration]);

  // Timer logic
  React.useEffect(() => {
    let timerInterval: any;
    if (recordingState === 'recording' && timer !== null) {
      timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev && prev > 1) return prev - 1;
          clearInterval(timerInterval);
          // Optionally auto-stop or keep at 0
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [recordingState, timer]);

  const goNext = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };
  const goBack = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
    else navigation.goBack();
  };

  const handleDone = async () => {
    const { streaked, newStreak } = await markExerciseComplete(idx);
    if (streaked) {
      navigation.navigate('StreakCelebration', { streak: newStreak });
      return;
    }
    Alert.alert('Great job!', `You completed: ${exercise.title}`);
    navigation.goBack();
  };

  // UI rendering
  return (
    <SafeAreaView style={styles.container}>
      {step === 'explanation' && (
        <View style={styles.centered}>
          <Text style={styles.title}>{exercise.title}</Text>
          <View style={styles.iconBox}>{exercise.icon}</View>
          <Text style={styles.desc}>Instructions: Do as many {exercise.title.toLowerCase()} as you can in {duration} seconds. {exercise.subtitle}</Text>
          <TouchableOpacity style={styles.button} onPress={goNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 'privacy' && (
        <View style={styles.centered}>
          <FontAwesome5 name="user-shield" size={48} color="#1CB0F6" style={{ marginBottom: 24 }} />
          <Text style={styles.title}>Your privacy is protected</Text>
          <Text style={styles.desc}>Your exercise video is only stored on your device and never uploaded.</Text>
          <TouchableOpacity style={styles.button} onPress={goNext}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={goBack}>
            <Text style={styles.linkText}>Back</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 'camera' && (
        <View style={styles.cameraContainer}>
          {hasPermission === null ? (
            <Text style={styles.desc}>Requesting camera permission...</Text>
          ) : hasPermission === false ? (
            <Text style={styles.desc}>No access to camera</Text>
          ) : (
            <CameraView style={styles.camera} ref={cameraRef} facing={"front"}>
              <View style={styles.cameraOverlay}>
                {/* Recording UI */}
                {recordingState === 'idle' && (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#FF4B4B' }]}
                    onPress={() => setRecordingState('countdown')}
                  >
                    <Text style={styles.buttonText}>Record</Text>
                  </TouchableOpacity>
                )}
                {recordingState === 'countdown' && (
                  <View style={styles.countdownContainer}>
                    <Animated.Text style={[styles.countdownDigit, { opacity: countdown === 3 ? 1 : 0.3 }]}>3</Animated.Text>
                    <Animated.Text style={[styles.countdownDigit, { opacity: countdown === 2 ? 1 : 0.3 }]}>2</Animated.Text>
                    <Animated.Text style={[styles.countdownDigit, { opacity: countdown === 1 ? 1 : 0.3 }]}>1</Animated.Text>
                  </View>
                )}
                {recordingState === 'recording' && (
                  <View style={styles.recordingRow}>
                    <Animated.View style={[styles.blinkDot, { opacity: blinkAnim }]} />
                    <Text style={styles.recordingText}>Recording</Text>
                    <Text style={styles.timerText}>{timer}s</Text>
                  </View>
                )}
                {showDone && recordingState === 'recording' && (
                  <TouchableOpacity style={styles.button} onPress={handleDone}>
                    <Text style={styles.buttonText}>Done</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.link} onPress={goBack}>
                  <Text style={styles.linkText}>Back</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1CB0F6',
    textAlign: 'center',
  },
  desc: {
    fontSize: 18,
    color: '#444',
    marginBottom: 24,
    textAlign: 'center',
  },
  iconBox: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1CB0F6',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    marginTop: 8,
  },
  linkText: {
    color: '#1CB0F6',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
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
    fontWeight: 'bold',
    color: '#FF4B4B',
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
    backgroundColor: '#FF4B4B',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4B4B',
    marginRight: 16,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4B4B',
  },
});

export default ExerciseScreen; 