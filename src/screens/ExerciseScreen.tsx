import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import ExerciseIcon from '../components/ExerciseIcon';
import { useProgress } from '../components/ProgressContext';
import AppText from '../components/AppText';
import { CameraMode, DetailsMode } from '../components/exercise-modes';

const steps = ['explanation', 'camera'] as const;
type Step = typeof steps[number];

const ExerciseScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { exercise, idx, workoutId, exerciseIndex, setNumber, totalSets, onExerciseComplete } = route.params;
  const [step, setStep] = useState<Step>('explanation');

  const { markExerciseComplete, streak, streakUpdatedToday, updateQuestProgressWithParams, isDarkMode, completeWorkoutSet, exerciseMode } = useProgress();
  const [recordingState, setRecordingState] = useState<'idle' | 'countdown' | 'recording' | 'paused' | 'rest'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState<number | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [blinkAnim] = useState(new Animated.Value(1));
  const [currentSet, setCurrentSet] = useState(1);
  const [getReadyTimer, setGetReadyTimer] = useState<number | null>(null);
  const [pausedTimer, setPausedTimer] = useState<number | null>(null);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const duration = exercise.duration || 30;
  const totalExerciseSets = exercise.sets || 1;
  const getReadyDuration = 10; // 10 seconds for get ready

  // Dark mode colors
  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#fff',
    text: isDarkMode ? '#CCCCCC' : '#444',
    textSecondary: isDarkMode ? '#cccccc' : '#666',
    primary: '#1CB0F6',
    accent: '#FFA800',
    danger: '#FF4B4B',
    success: '#58CC02',
    border: isDarkMode ? '#404040' : '#e0e0e0',
  };



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

  // Get ready and countdown logic (integrated into 10 seconds)
  React.useEffect(() => {
    let getReadyInterval: any;
    
    if (recordingState === 'countdown') {
      // Start with get ready phase (10 seconds total)
      setGetReadyTimer(getReadyDuration);
      setCountdown(3);
      
      getReadyInterval = setInterval(() => {
        setGetReadyTimer((prev) => {
          if (prev && prev > 1) {
            // When we reach 3 seconds remaining, start countdown
            const current = prev - 1;
            if (current <= 3) {
              setCountdown(current);
            }
            return current;
          } else if (prev === 1) {
            // Get ready phase complete, start recording
            clearInterval(getReadyInterval);
            setRecordingState('recording');
            setTimer(duration);
            setShowDone(true);
            setGetReadyTimer(null);
            return 0;
          }
          return prev;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(getReadyInterval);
    };
  }, [recordingState, duration, getReadyDuration]);

  // Timer logic
  React.useEffect(() => {
    let timerInterval: any;
    if (recordingState === 'recording' && timer !== null) {
      timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev && prev > 1) return prev - 1;
          clearInterval(timerInterval);
          // Timer finished - automatically progress to next stage
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [recordingState, timer]);

  // Auto-progress when timer reaches 0
  React.useEffect(() => {
    if (timer === 0 && recordingState === 'recording') {
      // Timer finished, automatically call handleDone to progress
      handleDone();
    }
  }, [timer, recordingState]);

  // Rest timer logic
  React.useEffect(() => {
    let restInterval: any;
    if (recordingState === 'rest' && restTimer !== null) {
      restInterval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev && prev > 1) return prev - 1;
          clearInterval(restInterval);
          // Rest finished, automatically start next set
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [recordingState, restTimer]);

  // Auto-progress when rest timer reaches 0
  React.useEffect(() => {
    if (restTimer === 0 && recordingState === 'rest') {
      // Rest finished, automatically start next set directly
      setCurrentSet(currentSet + 1);
      setRecordingState('recording');
      setTimer(duration);
      setShowDone(true);
      setRestTimer(null);
    }
  }, [restTimer, recordingState, currentSet, duration]);

  const goNext = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };
  const goBack = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
    else navigation.goBack();
  };

  const handlePause = () => {
    if (recordingState === 'recording') {
      setPausedTimer(timer);
      setRecordingState('paused');
    } else if (recordingState === 'paused') {
      setTimer(pausedTimer);
      setRecordingState('recording');
      setPausedTimer(null);
    }
  };

  const handleSkip = () => {
    // Skip only preparation stages (get ready and rest periods), not the actual exercise sets
    if (recordingState === 'countdown') {
      // Skip get ready stage (10s timer + 3s countdown) and go directly to recording
      setRecordingState('recording');
      setTimer(duration);
      setShowDone(true);
      setGetReadyTimer(null);
    } else if (recordingState === 'rest') {
      // Skip rest period and go directly to next set recording
      setCurrentSet(currentSet + 1);
      setRecordingState('recording');
      setTimer(duration);
      setShowDone(true);
      setRestTimer(null);
    }
    // Note: No longer allowing skip during recording/paused states (actual exercise sets)
  };

  const handleDone = async () => {
    const actualDuration = duration - (timer || 0);
    
    // If this is part of a workout, call the completion callback
    if (workoutId && onExerciseComplete) {
      onExerciseComplete();
      return;
    }
    
    // Handle multiple sets for standalone exercises
    if (totalExerciseSets > 1 && currentSet < totalExerciseSets) {
      // Start rest period between sets
      setRecordingState('rest');
      setRestTimer(exercise.restBetweenSets || 30);
      setTimer(null);
      setShowDone(false);
      setPausedTimer(null);
      return;
    }
    
    // Otherwise, handle as standalone exercise completion
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
          {totalExerciseSets > 1 && !workoutId && (
            <AppText style={[styles.setInfo, { color: colors.accent }]}>
              {totalExerciseSets} sets • {duration}s each
            </AppText>
          )}
          <AppText style={[styles.desc, { color: colors.text }]}>
            {exercise.instructions || `Do as many ${exercise.title.toLowerCase()} as you can in ${duration} seconds.`}
          </AppText>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={goNext}>
            <AppText style={styles.buttonText}>Next</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={goBack}>
            <AppText style={[styles.linkText, { color: colors.primary }]}>Back</AppText>
          </TouchableOpacity>
        </View>
      )}
      {/* {step === 'privacy' && (
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
      )} */}
      {step === 'camera' && (
        <DetailsMode
          exercise={exercise}
          duration={duration}
          onDone={handleDone}
          onBack={goBack}
          onPause={handlePause}
          onSkip={handleSkip}
          colors={colors}
          recordingState={recordingState}
          setRecordingState={setRecordingState}
          countdown={countdown}
          timer={timer}
          showDone={showDone}
          blinkAnim={blinkAnim}
          getReadyTimer={getReadyTimer}
          restTimer={restTimer}
          workoutId={workoutId}
          setNumber={setNumber}
          totalSets={totalSets}
          currentSet={currentSet}
          totalExerciseSets={totalExerciseSets}
          restBetweenSets={exercise.restBetweenSets || 30}
        />
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
});

export default ExerciseScreen; 