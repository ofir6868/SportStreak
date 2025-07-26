import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import AppText from '../components/AppText';
import { WorkoutConfig } from '../config/workoutConfig';
import { useProgress } from '../components/ProgressContext';

interface ExerciseProgress {
  exerciseId: string;
  completedSets: number;
  setDurations: number[];
  currentState: 'pending' | 'active' | 'completed';
}

const WorkoutCompletionScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { 
    workout, 
    totalDuration, 
    exerciseProgress, 
    sessionStartTime, 
    totalSets, 
    totalExercises, 
    completionPercentage 
  } = route.params;
  const { isDarkMode } = useProgress();

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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getExerciseById = (exerciseId: string) => {
    return workout.exercises.find(ex => ex.id === exerciseId);
  };

  const getAverageSetDuration = (durations: number[]): number => {
    if (durations.length === 0) return 0;
    return Math.round(durations.reduce((sum, duration) => sum + duration, 0) / durations.length);
  };



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="trophy" size={64} color={colors.accent} />
          <AppText style={[styles.congratsText, { color: colors.text }]}>Workout Complete!</AppText>
          <AppText style={[styles.workoutName, { color: colors.primary }]}>{workout.name}</AppText>
        </View>

        {/* Summary Stats */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <AppText style={[styles.summaryTitle, { color: colors.text }]}>Workout Summary</AppText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
              <AppText style={[styles.statValue, { color: colors.text }]}>{formatTime(totalDuration)}</AppText>
              <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</AppText>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="dumbbell" size={24} color={colors.primary} />
              <AppText style={[styles.statValue, { color: colors.text }]}>{totalExercises}</AppText>
              <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Exercises</AppText>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="repeat" size={24} color={colors.primary} />
              <AppText style={[styles.statValue, { color: colors.text }]}>{totalSets}</AppText>
              <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Sets</AppText>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="target" size={24} color={colors.primary} />
              <AppText style={[styles.statValue, { color: colors.text }]}>
                {completionPercentage}%
              </AppText>
              <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Completion</AppText>
            </View>
          </View>
        </View>

        {/* Exercise Details */}
        <View style={[styles.exercisesCard, { backgroundColor: colors.surface }]}>
          <AppText style={[styles.exercisesTitle, { color: colors.text }]}>Exercise Details</AppText>
          {workout.exercises.map((exercise) => {
            const progress = exerciseProgress.find(p => p.exerciseId === exercise.id);
            const avgDuration = progress ? getAverageSetDuration(progress.setDurations) : 0;
            
            return (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.exerciseHeader}>
                  <MaterialCommunityIcons name={exercise.icon} size={24} color={colors.primary} />
                  <View style={styles.exerciseInfo}>
                    <AppText style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</AppText>
                    <AppText style={[styles.exerciseDetails, { color: colors.textSecondary }]}>
                      {progress?.completedSets || 0}/{exercise.sets} sets completed
                    </AppText>
                  </View>
                  {progress?.completedSets === exercise.sets && (
                    <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
                  )}
                </View>
                {progress && progress.completedSets > 0 && (
                  <View style={styles.exerciseStats}>
                    <View style={styles.exerciseStat}>
                      <AppText style={[styles.exerciseStatLabel, { color: colors.textSecondary }]}>Avg. Set Time</AppText>
                      <AppText style={[styles.exerciseStatValue, { color: colors.text }]}>
                        {formatTime(avgDuration)}
                      </AppText>
                    </View>
                    <View style={styles.exerciseStat}>
                      <AppText style={[styles.exerciseStatLabel, { color: colors.textSecondary }]}>Total Time</AppText>
                      <AppText style={[styles.exerciseStatValue, { color: colors.text }]}>
                        {formatTime(progress.setDurations.reduce((sum, duration) => sum + duration, 0))}
                      </AppText>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Home')}
          >
            <AppText style={styles.primaryButtonText}>Back to Home</AppText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate('Workouts')}
          >
            <AppText style={[styles.secondaryButtonText, { color: colors.primary }]}>Try Another Workout</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  congratsText: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 20,
    fontFamily: 'Nunito-Regular',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
  exercisesCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  exercisesTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
  },
  exerciseItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  exerciseStats: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  exerciseStat: {
    flex: 1,
  },
  exerciseStatLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    marginBottom: 4,
  },
  exerciseStatValue: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
});

export default WorkoutCompletionScreen; 