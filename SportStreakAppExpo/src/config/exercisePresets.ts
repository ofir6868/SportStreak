export type ExercisePresetKey = 'running' | 'strength' | 'yoga';

export type ExercisePreset = {
  label: string;
  description: string;
  exerciseIds: number[]; // Preselected exercise IDs from wger API
};

// At runtime, fetch details for each exerciseId from the wger API
// e.g. https://wger.de/api/v2/exerciseinfo/{id}/?language=2

export const EXERCISE_PRESETS: Record<ExercisePresetKey, ExercisePreset> = {
  strength: {
    label: 'Strength',
    description: 'Build muscle and power with strength exercises.',
    exerciseIds: [1551, 615, 139, 172], // Push-Up, Squat, Dip, Curl
  },
  running: {
    label: 'Running',
    description: 'Improve your endurance and cardio with running sessions.',
    exerciseIds: [320, 996, 348, 101], // Jumping Jack, Mountain Climber, Sprint, Burpee
  },
  yoga: {
    label: 'Yoga',
    description: 'Enhance flexibility and balance with yoga flows.',
    exerciseIds: [1002, 1321, 977, 984], // Child's Pose, Side Plank, Cobra, Bridge
  },
};