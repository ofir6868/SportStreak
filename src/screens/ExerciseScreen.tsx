import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ExerciseIcon } from '../components/LearningPath';
import { useProgress } from '../components/ProgressContext';
import AppText from '../components/AppText';

const steps = ['explanation', 'privacy', 'camera'] as const;
type Step = typeof steps[number];

const ExerciseScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { exercise, idx, workoutId, exerciseIndex, setNumber, totalSets } = route.params;
  const [step, setStep] = useState<Step>('explanation');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef(null);
  const { markExerciseComplete, streak, streakUpdatedToday, updateQuestProgressWithParams, isDarkMode, completeWorkoutSet } = useProgress();
  const [recordingState, setRecordingState] = useState<'idle' | 'countdown' | 'recording'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState<number | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [blinkAnim] = useState(new Animated.Value(1));
  const duration = exercise.duration || 30;

  // Dark mode colors
  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#fff',
    text: isDarkMode ? '#ffffff' : '#444',
    textSecondary: isDarkMode ? '#cccccc' : '#666',
    primary: '#1CB0F6',
    accent: '#FFA800',
    danger: '#FF4B4B',
    success: '#58CC02',
    border: isDarkMode ? '#404040' : '#e0e0e0',
  };

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
    const actualDuration = duration - (timer || 0);
    
    // If this is part of a workout, use the context to complete the set
    if (workoutId) {
      completeWorkoutSet(exerciseIndex, actualDuration);
      navigation.goBack();
      return;
    }
    
    // Otherwise, handle as standalone exercise
    const { streaked, newStreak } = await markExerciseComplete(idx, {
      totalDuration: Math.floor(actualDuration / 60), // Convert to minutes
      perfectAccuracy: 1 // Assuming 100% for now
    });
    
    const durationString = `${Math.floor(actualDuration / 60)}:${(actualDuration % 60).toString().padStart(2, '0')}`;
    navigation.navigate('ExerciseCompletion', { 
      exercise, 
      xp: 5, 
      duration: durationString, 
      accuracy: '100%',
      shouldShowStreak: streaked,
      streak: newStreak
    });
  };

  // UI rendering
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {step === 'explanation' && (
        <View style={styles.centered}>
          <AppText style={[styles.title, { color: colors.primary }]}>{exercise.title}</AppText>
          <View style={styles.iconBox}><ExerciseIcon name={exercise.icon} size={56} color={colors.primary} /></View>
          {workoutId && setNumber && (
            <AppText style={[styles.setInfo, { color: colors.accent }]}>
              Set {setNumber} of {totalSets}
            </AppText>
          )}
          <AppText style={[styles.desc, { color: colors.text }]}>
            {exercise.instructions || `Do as many ${exercise.title.toLowerCase()} as you can in ${duration} seconds.`}
          </AppText>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={goNext}>
            <AppText style={styles.buttonText}>Next</AppText>
          </TouchableOpacity>
        </View>
      )}
      {step === 'privacy' && (
        <View style={styles.centered}>
          <FontAwesome5 name="user-shield" size={48} color={colors.primary} style={{ marginBottom: 24 }} />
          <AppText style={[styles.title, { color: colors.primary }]}>Your privacy is protected</AppText>
          <AppText style={[styles.desc, { color: colors.text }]}>Your exercise video is only stored on your device and never uploaded.</AppText>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={goNext}>
            <AppText style={styles.buttonText}>Continue</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={goBack}>
            <AppText style={[styles.linkText, { color: colors.primary }]}>Back</AppText>
          </TouchableOpacity>
        </View>
      )}
      {step === 'camera' && (
        <View style={styles.cameraContainer}>
          {hasPermission === null ? (
            <AppText style={[styles.desc, { color: colors.text }]}>Requesting camera permission...</AppText>
          ) : hasPermission === false ? (
            <AppText style={[styles.desc, { color: colors.text }]}>No access to camera</AppText>
          ) : (
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
                  <View style={styles.countdownContainer}>
                    <Animated.Text style={[styles.countdownDigit, { opacity: countdown === 3 ? 1 : 0.3, color: colors.danger }]}>3</Animated.Text>
                    <Animated.Text style={[styles.countdownDigit, { opacity: countdown === 2 ? 1 : 0.3, color: colors.danger }]}>2</Animated.Text>
                    <Animated.Text style={[styles.countdownDigit, { opacity: countdown === 1 ? 1 : 0.3, color: colors.danger }]}>1</Animated.Text>
                  </View>
                )}
                {recordingState === 'recording' && (
                  <View style={styles.recordingRow}>
                    <Animated.View style={[styles.blinkDot, { opacity: blinkAnim, backgroundColor: colors.danger }]} />
                    <AppText style={[styles.recordingText, { color: colors.danger }]}>Recording</AppText>
                    <AppText style={[styles.timerText, { color: colors.danger }]}>{timer}s</AppText>
                  </View>
                )}
                {showDone && recordingState === 'recording' && (
                  <TouchableOpacity style={[styles.button, { backgroundColor: colors.success }]} onPress={handleDone}>
                    <AppText style={styles.buttonText}>Done</AppText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.link} onPress={goBack}>
                  <AppText style={[styles.linkText, { color: '#fff' }]}>Back</AppText>
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
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  setInfo: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  desc: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  iconBox: {
    marginBottom: 24,
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
});

export default ExerciseScreen; 