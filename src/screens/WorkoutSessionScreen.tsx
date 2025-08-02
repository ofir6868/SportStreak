import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import AppText from '../components/AppText';
import { WorkoutConfig } from '../config/workoutConfig';
import { useProgress } from '../components/ProgressContext';

type WorkoutState = 'preparing' | 'active' | 'completed';

const WorkoutSessionScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { workoutId } = route.params;
  const { isDarkMode } = useProgress();
  
  const [workout, setWorkout] = useState<WorkoutConfig | null>(null);
  const [workoutState, setWorkoutState] = useState<WorkoutState>('preparing');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  
  const workoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dark mode colors
  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#fff',
    surface: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    text: isDarkMode ? '#ffffff' : '#222',
    textSecondary: isDarkMode ? '#cccccc' : '#666',
    primary: '#1CB0F6',
    accent: '#FFA800',
    success: '#58CC02',
    danger: '#FF4B4B',
    border: isDarkMode ? '#404040' : '#e0e0e0',
  };

  useEffect(() => {
    // Load workout configuration
    const loadWorkout = async () => {
      const { getWorkoutById } = await import('../config/workoutConfig');
      const workoutConfig = getWorkoutById(workoutId);
      if (workoutConfig) {
        setWorkout(workoutConfig);
      } else {
        Alert.alert('Error', 'Workout not found');
        navigation.goBack();
      }
    };
    loadWorkout();
  }, [workoutId]);

  useEffect(() => {
    if (sessionStartTime && workoutState !== 'completed') {
      workoutTimerRef.current = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (workoutTimerRef.current) {
        clearInterval(workoutTimerRef.current);
      }
    };
  }, [sessionStartTime, workoutState]);

  const startWorkout = () => {
    setWorkoutTimer(0);
    setWorkoutState('active');
    setSessionStartTime(new Date());
    setCurrentExerciseIndex(0);
  };

  const completeWorkout = () => {
    setWorkoutState('completed');
    if (workoutTimerRef.current) {
      clearInterval(workoutTimerRef.current);
    }
    
    const completionData = {
      workout,
      totalDuration: workoutTimer,
      sessionStartTime,
      totalExercises: workout?.exercises.length || 0
    };
    
    navigation.navigate('WorkoutCompletion', completionData);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentExercise = () => {
    return workout?.exercises[currentExerciseIndex];
  };

  const startExercise = () => {
    const exercise = getCurrentExercise();
    if (exercise) {
      navigation.navigate('Exercise', {
        exercise: {
          title: exercise.name,
          icon: exercise.icon,
          duration: exercise.duration,
          instructions: exercise.instructions,
          sets: exercise.sets,
          restBetweenSets: exercise.restBetweenSets,
          id: exercise.id,
          name: exercise.name,
          difficulty: exercise.difficulty
        },
        workoutId,
        exerciseIndex: currentExerciseIndex,
        onExerciseComplete: () => {
          // Move to next exercise or complete workout
          if (currentExerciseIndex < (workout?.exercises.length || 0) - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
          } else {
            completeWorkout();
          }
        }
      });
    }
  };

  if (!workout) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <AppText style={[styles.loadingText, { color: colors.text }]}>Loading workout...</AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <AppText style={[styles.workoutTitle, { color: colors.text }]}>{workout.name}</AppText>
          <AppText style={[styles.workoutSubtitle, { color: colors.textSecondary }]}>
            {workout.type} • {workout.difficulty}
          </AppText>
        </View>
        {workoutState === 'active' && (
          <AppText style={[styles.timer, { color: colors.primary }]}>
            {formatTime(workoutTimer)}
          </AppText>
        )}
      </View>

      {/* Workout State */}
      {workoutState === 'preparing' && (
        <View style={styles.preparingContainer}>
          <View style={styles.workoutOverview}>
            <MaterialCommunityIcons name={workout.icon} size={64} color={colors.primary} />
            <AppText style={[styles.overviewTitle, { color: colors.text }]}>{workout.name}</AppText>
            <AppText style={[styles.overviewDescription, { color: colors.textSecondary }]}>
              {workout.description}
            </AppText>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <AppText style={[styles.statNumber, { color: colors.primary }]}>
                  {workout.exercises.length}
                </AppText>
                <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Exercises</AppText>
              </View>
              <View style={styles.stat}>
                <AppText style={[styles.statNumber, { color: colors.primary }]}>
                  {workout.exercises.reduce((total, ex) => total + ex.sets, 0)}
                </AppText>
                <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Total Sets</AppText>
              </View>
              <View style={styles.stat}>
                <AppText style={[styles.statNumber, { color: colors.primary }]}>
                  {workout.estimatedDuration}m
                </AppText>
                <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</AppText>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: colors.primary }]} 
            onPress={startWorkout}
          >
            <AppText style={styles.startButtonText}>Start Workout</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* Active Workout */}
      {workoutState === 'active' && (
        <View style={styles.activeContainer}>
          <View style={styles.exerciseList}>
            <AppText style={[styles.sectionTitle, { color: colors.text }]}>Exercises</AppText>
            <ScrollView showsVerticalScrollIndicator={false}>
              {workout.exercises.map((exercise, index) => {
                const isCurrent = index === currentExerciseIndex;
                const isCompleted = index < currentExerciseIndex;
                
                return (
                  <View key={exercise.id} style={styles.exerciseItem}>
                    <View style={styles.exerciseInfo}>
                                             <MaterialCommunityIcons 
                         name={exercise.icon as any} 
                         size={32} 
                         color={isCurrent ? colors.primary : colors.textSecondary} 
                       />
                      <View style={styles.exerciseDetails}>
                        <AppText style={[
                          styles.exerciseName, 
                          { color: isCurrent ? colors.primary : colors.text }
                        ]}>
                          {exercise.name}
                        </AppText>
                        <AppText style={[styles.exerciseMeta, { color: colors.textSecondary }]}>
                          {exercise.sets} sets • {exercise.duration}s
                        </AppText>
                      </View>
                    </View>
                    
                    {isCompleted && (
                      <View style={styles.completedIndicator}>
                        <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
                        <AppText style={[styles.completedText, { color: colors.success }]}>Completed</AppText>
                      </View>
                    )}
                    
                    {isCurrent && (
                      <TouchableOpacity 
                        style={[styles.startExerciseButton, { backgroundColor: colors.primary }]}
                        onPress={startExercise}
                      >
                        <AppText style={styles.startExerciseButtonText}>Start</AppText>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  workoutTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  workoutSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
  timer: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  preparingContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  workoutOverview: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  overviewTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  overviewDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  startButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  activeContainer: {
    flex: 1,
    padding: 20,
  },
  exerciseList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exerciseDetails: {
    marginLeft: 12,
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  exerciseMeta: {
    fontSize: 14,
    marginTop: 2,
  },
  completedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    marginLeft: 4,
  },
  startExerciseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startExerciseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});

export default WorkoutSessionScreen; 