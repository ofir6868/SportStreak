// Base interface for any exercise activity (individual exercise or workout)
export interface ExerciseActivity {
  id: string;
  name: string;
  icon: string;
  type: 'individual' | 'workout';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: number; // in minutes
  description?: string;
}

// Interface for individual exercises
export interface IndividualExercise extends ExerciseActivity {
  type: 'individual';
  duration: number; // duration in seconds
  instructions?: string;
}

// Interface for workout exercises (exercises within a workout)
export interface WorkoutExercise extends ExerciseActivity {
  type: 'workout';
  duration: number; // duration in seconds for each set
  sets: number; // number of sets for this exercise
  restBetweenSets: number; // rest time in seconds between sets
  instructions?: string;
}

// Interface for complete workouts
export interface Workout extends ExerciseActivity {
  type: 'workout';
  exercises: WorkoutExercise[];
  restBetweenExercises: number; // rest time in seconds between exercises
}

// Union type for all exercise activities
export type AnyExerciseActivity = IndividualExercise | WorkoutExercise | Workout;

// Progress tracking for any exercise activity
export interface ExerciseProgress {
  activityId: string;
  activityType: 'individual' | 'workout';
  completedSets?: number;
  setDurations?: number[];
  currentState: 'pending' | 'active' | 'completed';
  totalDuration?: number;
}

// Session tracking for workouts
export interface WorkoutSession {
  workoutId: string;
  startTime: Date;
  endTime?: Date;
  exerciseProgress: ExerciseProgress[];
  totalDuration?: number;
}

// Factory function to create exercise activities
export const createExerciseActivity = (
  config: Partial<AnyExerciseActivity>
): AnyExerciseActivity => {
  if (config.type === 'individual') {
    return {
      id: config.id || '',
      name: config.name || '',
      icon: config.icon || '',
      type: 'individual',
      difficulty: config.difficulty || 'Beginner',
      estimatedDuration: config.estimatedDuration || 0,
      duration: (config as IndividualExercise).duration || 30,
      instructions: (config as IndividualExercise).instructions,
      description: config.description,
    } as IndividualExercise;
  } else if (config.type === 'workout') {
    if ((config as Workout).exercises) {
      return {
        id: config.id || '',
        name: config.name || '',
        icon: config.icon || '',
        type: 'workout',
        difficulty: config.difficulty || 'Beginner',
        estimatedDuration: config.estimatedDuration || 0,
        exercises: (config as Workout).exercises || [],
        restBetweenExercises: (config as Workout).restBetweenExercises || 60,
        description: config.description,
      } as Workout;
    } else {
      return {
        id: config.id || '',
        name: config.name || '',
        icon: config.icon || '',
        type: 'workout',
        difficulty: config.difficulty || 'Beginner',
        estimatedDuration: config.estimatedDuration || 0,
        duration: (config as WorkoutExercise).duration || 30,
        sets: (config as WorkoutExercise).sets || 1,
        restBetweenSets: (config as WorkoutExercise).restBetweenSets || 30,
        instructions: (config as WorkoutExercise).instructions,
        description: config.description,
      } as WorkoutExercise;
    }
  }
  
  throw new Error('Invalid exercise activity type');
};

// Utility functions
export const isIndividualExercise = (activity: AnyExerciseActivity): activity is IndividualExercise => {
  return activity.type === 'individual';
};

export const isWorkoutExercise = (activity: AnyExerciseActivity): activity is WorkoutExercise => {
  return activity.type === 'workout' && !('exercises' in activity);
};

export const isWorkout = (activity: AnyExerciseActivity): activity is Workout => {
  return activity.type === 'workout' && 'exercises' in activity;
};

export const getActivityDuration = (activity: AnyExerciseActivity): number => {
  if (isIndividualExercise(activity)) {
    return activity.duration;
  } else if (isWorkoutExercise(activity)) {
    return activity.duration * activity.sets;
  } else if (isWorkout(activity)) {
    return activity.exercises.reduce((total, exercise) => {
      return total + (exercise.duration * exercise.sets);
    }, 0);
  }
  return 0;
};

export const getActivityInstructions = (activity: AnyExerciseActivity): string => {
  if (isIndividualExercise(activity) || isWorkoutExercise(activity)) {
    return activity.instructions || `Do as many ${activity.name.toLowerCase()} as you can in the time limit.`;
  } else if (isWorkout(activity)) {
    return activity.description || `Complete all exercises in this ${activity.name.toLowerCase()} workout.`;
  }
  return '';
}; 