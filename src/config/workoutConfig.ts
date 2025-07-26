export type WorkoutIcon = 'dumbbell' | 'meditation' | 'run' | 'arm-flex' | 'yoga' | 'heart-pulse' | 'weight-lifter' | 'bike' | 'timer';

export type ExerciseConfig = {
  id: string;
  name: string;
  icon: string;
  duration: number; // duration in seconds for each set
  sets: number; // number of sets for this exercise
  restBetweenSets: number; // rest time in seconds between sets
  instructions?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
};

export type WorkoutConfig = {
  id: string;
  name: string;
  type: string;
  icon: WorkoutIcon;
  difficulty: string;
  description: string;
  estimatedDuration: number; // total estimated duration in minutes
  exercises: ExerciseConfig[];
  restBetweenExercises: number; // rest time in seconds between exercises
};

export type WorkoutSession = {
  workoutId: string;
  startTime: Date;
  endTime?: Date;
  completedSets: Record<string, number>; // exerciseId -> completed sets
  exerciseDurations: Record<string, number[]>; // exerciseId -> array of set durations
  totalDuration?: number;
};

export const WORKOUT_CONFIGS: WorkoutConfig[] = [
  {
    id: 'full-body-blast',
    name: 'Full Body Blast',
    type: 'Strength',
    icon: 'dumbbell',
    difficulty: 'Intermediate',
    description: 'Complete full body workout targeting all major muscle groups',
    estimatedDuration: 45,
    restBetweenExercises: 60,
    exercises: [
      {
        id: 'push-ups',
        name: 'Push Ups',
        icon: 'arm-flex',
        duration: 45,
        sets: 1,
        restBetweenSets: 30,
        instructions: 'Do as many push-ups as you can in the time limit',
        difficulty: 'Intermediate'
      },
      // {
      //   id: 'squats',
      //   name: 'Squats',
      //   icon: 'human',
      //   duration: 45,
      //   sets: 3,
      //   restBetweenSets: 30,
      //   instructions: 'Perform bodyweight squats with proper form',
      //   difficulty: 'Beginner'
      // },
      // {
      //   id: 'plank',
      //   name: 'Plank',
      //   icon: 'human',
      //   duration: 30,
      //   sets: 3,
      //   restBetweenSets: 45,
      //   instructions: 'Hold plank position, engaging your core',
      //   difficulty: 'Beginner'
      // },
      // {
      //   id: 'lunges',
      //   name: 'Lunges',
      //   icon: 'walk',
      //   duration: 40,
      //   sets: 2,
      //   restBetweenSets: 30,
      //   instructions: 'Alternate legs for forward lunges',
      //   difficulty: 'Intermediate'
      // }
    ]
  },
  {
    id: 'morning-yoga',
    name: 'Morning Yoga',
    type: 'Yoga',
    icon: 'yoga',
    difficulty: 'Beginner',
    description: 'Gentle yoga flow to start your day with energy',
    estimatedDuration: 30,
    restBetweenExercises: 15,
    exercises: [
      {
        id: 'sun-salute',
        name: 'Sun Salute',
        icon: 'yoga',
        duration: 60,
        sets: 3,
        restBetweenSets: 20,
        instructions: 'Complete one full sun salutation sequence',
        difficulty: 'Beginner'
      },
      {
        id: 'tree-pose',
        name: 'Tree Pose',
        icon: 'tree-outline',
        duration: 30,
        sets: 2,
        restBetweenSets: 15,
        instructions: 'Hold tree pose on each leg',
        difficulty: 'Beginner'
      },
      {
        id: 'warrior-i',
        name: 'Warrior I',
        icon: 'human',
        duration: 45,
        sets: 2,
        restBetweenSets: 20,
        instructions: 'Hold warrior I pose on each side',
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    id: 'cardio-burn',
    name: 'Cardio Burn',
    type: 'Cardio',
    icon: 'run',
    difficulty: 'Advanced',
    description: 'High-intensity cardio workout to burn calories',
    estimatedDuration: 40,
    restBetweenExercises: 45,
    exercises: [
      {
        id: 'jumping-jacks',
        name: 'Jumping Jacks',
        icon: 'run',
        duration: 60,
        sets: 3,
        restBetweenSets: 30,
        instructions: 'Perform jumping jacks at a steady pace',
        difficulty: 'Beginner'
      },
      {
        id: 'burpees',
        name: 'Burpees',
        icon: 'run',
        duration: 45,
        sets: 3,
        restBetweenSets: 45,
        instructions: 'Complete full burpee with push-up and jump',
        difficulty: 'Advanced'
      },
      {
        id: 'mountain-climbers',
        name: 'Mountain Climbers',
        icon: 'run',
        duration: 45,
        sets: 3,
        restBetweenSets: 30,
        instructions: 'Alternate knees to chest in plank position',
        difficulty: 'Intermediate'
      },
      {
        id: 'high-knees',
        name: 'High Knees',
        icon: 'run',
        duration: 30,
        sets: 3,
        restBetweenSets: 30,
        instructions: 'Run in place bringing knees to chest',
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    id: 'core-focus',
    name: 'Core Focus',
    type: 'Strength',
    icon: 'arm-flex',
    difficulty: 'Intermediate',
    description: 'Targeted core workout for strength and stability',
    estimatedDuration: 35,
    restBetweenExercises: 40,
    exercises: [
      {
        id: 'plank',
        name: 'Plank',
        icon: 'human',
        duration: 45,
        sets: 3,
        restBetweenSets: 30,
        instructions: 'Hold plank position with proper form',
        difficulty: 'Beginner'
      },
      {
        id: 'crunches',
        name: 'Crunches',
        icon: 'human',
        duration: 45,
        sets: 3,
        restBetweenSets: 30,
        instructions: 'Perform controlled crunches',
        difficulty: 'Beginner'
      },
      {
        id: 'russian-twists',
        name: 'Russian Twists',
        icon: 'human',
        duration: 40,
        sets: 3,
        restBetweenSets: 30,
        instructions: 'Rotate torso side to side',
        difficulty: 'Intermediate'
      },
      {
        id: 'leg-raises',
        name: 'Leg Raises',
        icon: 'human',
        duration: 40,
        sets: 2,
        restBetweenSets: 45,
        instructions: 'Lift legs straight up while lying on back',
        difficulty: 'Intermediate'
      }
    ]
  }
];

export const getWorkoutById = (id: string): WorkoutConfig | undefined => {
  return WORKOUT_CONFIGS.find(workout => workout.id === id);
};

export const getWorkoutsByType = (type: string): WorkoutConfig[] => {
  return WORKOUT_CONFIGS.filter(workout => workout.type === type);
}; 