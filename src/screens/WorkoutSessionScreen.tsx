import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import AppText from '../components/AppText';
import { WorkoutConfig } from '../config/workoutConfig';
import { useProgress } from '../components/ProgressContext';

type WorkoutState = 'preparing' | 'active' | 'rest' | 'completed';
type ExerciseState = 'pending' | 'active' | 'completed';

interface ExerciseProgress {
  exerciseId: string;
  completedSets: number;
  setDurations: number[];
  currentState: ExerciseState;
}

const WorkoutSessionScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { workoutId } = route.params;
  const { isDarkMode, setWorkoutSessionState } = useProgress();
  
  const [workout, setWorkout] = useState<WorkoutConfig | null>(null);
  const [workoutState, setWorkoutState] = useState<WorkoutState>('preparing');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  
  const workoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        const initialProgress = workoutConfig.exercises.map(exercise => ({
          exerciseId: exercise.id,
          completedSets: 0,
          setDurations: [],
          currentState: 'pending' as ExerciseState
        }));
        setExerciseProgress(initialProgress);
        console.log('Initial exercise progress:', initialProgress);
      } else {
        Alert.alert('Error', 'Workout not found');
        navigation.goBack();
      }
    };
    loadWorkout();
  }, [workoutId]);

  // Monitor exercise progress changes
  useEffect(() => {
    console.log('Exercise progress updated:', exerciseProgress);
  }, [exerciseProgress]);

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

  useEffect(() => {
    if (restTimer !== null && restTimer > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev && prev <= 1) {
            console.log('Rest timer finished, calling startNextSet');
            clearInterval(restTimerRef.current!);
            // Automatically start next set when rest timer finishes
            setTimeout(() => {
              startNextSet();
            }, 100);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    }

    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, [restTimer]);

  const startWorkout = () => {
    setWorkoutTimer(0);
    setWorkoutState('active');
    setSessionStartTime(new Date());
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    updateExerciseState(0, 'active');
    
    // Register this component's completeSet function with the context
    setWorkoutSessionState({
      completeSet: completeSet
    });
  };

  const updateExerciseState = (exerciseIndex: number, state: ExerciseState) => {
    setExerciseProgress(prev => 
      prev.map((progress, index) => 
        index === exerciseIndex 
          ? { ...progress, currentState: state }
          : progress
      )
    );
  };

  const completeSet = (exerciseIndex: number, duration: number) => {
    console.log('completeSet called - exerciseIndex:', exerciseIndex, 'currentSet:', currentSet, 'duration:', duration);
    const exercise = workout?.exercises[exerciseIndex];
    if (!exercise) return;

    setExerciseProgress(prev => {
      console.log('Updating exercise progress - exerciseIndex:', exerciseIndex, 'prev:', prev);
      const updatedProgress = prev.map((progress, index) => 
        index === exerciseIndex 
          ? {
              ...progress,
              completedSets: progress.completedSets + 1,
              setDurations: [...progress.setDurations, duration]
            }
          : progress
      );
      
      // Use functional update to get the current set value
      setCurrentSet(prevSet => {
        console.log('completeSet - prevSet:', prevSet, 'exercise sets:', exercise.sets);
        
        if (prevSet < exercise.sets) {
          // More sets to go
          console.log('More sets to go - currentSet:', prevSet, 'total sets:', exercise.sets);
          setRestTimer(exercise.restBetweenSets);
          setWorkoutState('rest');
          return prevSet + 1;
        } else {
          // Exercise completed
          console.log('Exercise completed - moving to next exercise');
          updateExerciseState(exerciseIndex, 'completed');
          
          if (exerciseIndex < workout.exercises.length - 1) {
            // Move to next exercise
            setCurrentExerciseIndex(exerciseIndex + 1);
            updateExerciseState(exerciseIndex + 1, 'active');
            setRestTimer(workout.restBetweenExercises);
            setWorkoutState('rest');
            return 1;
          } else {
            // Workout completed - pass the updated progress data
            completeWorkout(updatedProgress);
            return prevSet;
          }
        }
      });
      
      return updatedProgress;
    });
  };

  const completeWorkout = (updatedProgress?: ExerciseProgress[]) => {
    setWorkoutState('completed');
    if (workoutTimerRef.current) {
      clearInterval(workoutTimerRef.current);
    }
    
    // Calculate total duration in seconds
    const totalDuration = workoutTimer;
    
    // Use the updated progress if provided, otherwise use current state
    const progressToUse = updatedProgress || exerciseProgress;
    
    // Get the current exercise progress state and ensure all exercises are marked as completed
    const finalExerciseProgress = progressToUse.map(progress => {
      // For exercises that were actually worked on, use their actual completed sets
      // For exercises that weren't reached, mark as 0 completed sets
      const exercise = workout.exercises.find(ex => ex.id === progress.exerciseId);
      const actualCompletedSets = progress.completedSets;
      
      return {
        exerciseId: progress.exerciseId,
        completedSets: actualCompletedSets,
        setDurations: progress.setDurations,
        currentState: 'completed' as const
      };
    });
    
    const totalSetsCompleted = finalExerciseProgress.reduce((total, progress) => total + progress.completedSets, 0);
    const totalSetsInWorkout = workout.exercises.reduce((total, ex) => total + ex.sets, 0);
    const completionPercentage = totalSetsInWorkout > 0 ? Math.round((totalSetsCompleted / totalSetsInWorkout) * 100) : 0;
    
    const completionData = {
      workout,
      totalDuration,
      exerciseProgress: finalExerciseProgress,
      sessionStartTime,
      totalSets: totalSetsCompleted,
      totalExercises: workout.exercises.length,
      completionPercentage
    };
    
    console.log('Workout completion data:', completionData);
    console.log('Exercise progress details:', finalExerciseProgress);
    
    // Navigate to completion screen
    navigation.navigate('WorkoutCompletion', completionData);
  };

  const startNextSet = () => {
    console.log('startNextSet called - current state:', workoutState, 'current exercise:', currentExerciseIndex, 'current set:', currentSet);
    setWorkoutState('active');
    setRestTimer(null);
    
    // Always ensure the current exercise is in active state
    updateExerciseState(currentExerciseIndex, 'active');
    console.log('startNextSet completed - new state should be active');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentExercise = () => {
    return workout?.exercises[currentExerciseIndex];
  };

  const getExerciseProgress = (exerciseId: string) => {
    return exerciseProgress.find(progress => progress.exerciseId === exerciseId);
  };

  const startExercise = () => {
    const exercise = getCurrentExercise();
    if (exercise) {
      navigation.navigate('Exercise', {
        exercise: {
          title: exercise.name,
          icon: exercise.icon,
          duration: exercise.duration,
          instructions: exercise.instructions
        },
        workoutId,
        exerciseIndex: currentExerciseIndex,
        setNumber: currentSet,
        totalSets: exercise.sets
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
                <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Est. Time</AppText>
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
          <ScrollView style={styles.exercisesList}>
            {workout.exercises.map((exercise, index) => {
              const progress = getExerciseProgress(exercise.id);
              const isCurrent = index === currentExerciseIndex;
              
              return (
                <View 
                  key={exercise.id} 
                  style={[
                    styles.exerciseCard, 
                    { backgroundColor: colors.surface },
                    isCurrent && { borderColor: colors.primary, borderWidth: 2 }
                  ]}
                >
                  <View style={styles.exerciseHeader}>
                    <MaterialCommunityIcons name={exercise.icon as any} size={32} color={colors.primary} />
                    <View style={styles.exerciseInfo}>
                      <AppText style={[styles.exerciseName, { color: colors.text }]}>
                        {exercise.name}
                      </AppText>
                      <AppText style={[styles.exerciseDetails, { color: colors.textSecondary }]}>
                        {exercise.sets} sets • {exercise.duration}s each
                      </AppText>
                    </View>
                    <View style={styles.progressIndicator}>
                      <AppText style={[styles.progressText, { color: colors.primary }]}>
                        {progress?.completedSets || 0}/{exercise.sets}
                      </AppText>
                    </View>
                  </View>
                  
                  {isCurrent && progress?.currentState === 'active' && (
                    <View style={styles.currentExerciseInfo}>
                      <AppText style={[styles.currentSetText, { color: colors.text }]}>
                        Set {currentSet} of {exercise.sets}
                      </AppText>
                      <TouchableOpacity 
                        style={[styles.startExerciseButton, { backgroundColor: colors.accent }]}
                        onPress={startExercise}
                      >
                        <AppText style={styles.startExerciseButtonText}>Start Set</AppText>
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  {progress?.currentState === 'completed' && (
                    <View style={styles.completedIndicator}>
                      <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
                      <AppText style={[styles.completedText, { color: colors.success }]}>Completed</AppText>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Rest Period */}
      {workoutState === 'rest' && restTimer !== null && (
        <View style={styles.restContainer}>
          <MaterialCommunityIcons name="timer" size={64} color={colors.primary} />
          <AppText style={[styles.restTitle, { color: colors.text }]}>Rest Time</AppText>
          <AppText style={[styles.restTimer, { color: colors.primary }]}>
            {formatTime(restTimer)}
          </AppText>
          <AppText style={[styles.restSubtitle, { color: colors.textSecondary }]}>
            {currentSet <= (getCurrentExercise()?.sets || 0) 
              ? `Get ready for Set ${currentSet}`
              : 'Get ready for next exercise'
            }
          </AppText>
          <TouchableOpacity 
            style={[styles.skipRestButton, { backgroundColor: colors.accent }]}
            onPress={startNextSet}
          >
            <AppText style={styles.skipRestButtonText}>Skip Rest</AppText>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: 'Nunito-Regular',
    marginTop: 4,
  },
  startButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  activeContainer: {
    flex: 1,
  },
  exercisesList: {
    flex: 1,
    padding: 16,
  },
  exerciseCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  exerciseDetails: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    marginTop: 2,
  },
  progressIndicator: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  currentExerciseInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  currentSetText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    marginBottom: 8,
  },
  startExerciseButton: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  startExerciseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  completedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  completedText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    marginLeft: 8,
  },
  restContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  restTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  restTimer: {
    fontSize: 48,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
  },
  restSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  skipRestButton: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  skipRestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default WorkoutSessionScreen; 