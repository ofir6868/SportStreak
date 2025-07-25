export type ExercisePresetKey = 'running' | 'strength' | 'yoga';

export type PathCircle = {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  status: 'start' | 'review' | 'go' | 'locked';
  icon: string; // icon name, to be mapped in component
  duration?: number; // duration in seconds
};

export type ExercisePreset = {
  label: string;
  description: string;
  circles: PathCircle[];
};

export const EXERCISE_PRESETS: Record<ExercisePresetKey, ExercisePreset> = {
  running: {
    label: 'Running',
    description: 'Improve your endurance and cardio with running sessions.',
    circles: [
      { id: 0, type: 'run', title: 'Warm Up', subtitle: 'Get ready', status: 'start', icon: 'run', duration: 30 },
      { id: 1, type: 'run', title: 'Jog', subtitle: 'Steady pace', status: 'go', icon: 'run-fast', duration: 30 },
      { id: 2, type: 'run', title: 'Intervals', subtitle: 'Speed bursts', status: 'locked', icon: 'timer', duration: 30 },
      { id: 3, type: 'run', title: 'Hill Sprints', subtitle: 'Power & speed', status: 'locked', icon: 'terrain', duration: 30 },
      { id: 4, type: 'run', title: 'Long Run', subtitle: 'Endurance', status: 'locked', icon: 'road-variant', duration: 30 },
      { id: 5, type: 'run', title: 'Cool Down', subtitle: 'Slow pace', status: 'locked', icon: 'walk', duration: 30 },
    ],
  },
  strength: {
    label: 'Strength',
    description: 'Build muscle and power with strength exercises.',
    circles: [
      { id: 0, type: 'strength', title: 'Push Ups', subtitle: 'Upper body', status: 'start', icon: 'arm-flex', duration: 30 },
      { id: 1, type: 'strength', title: 'Squats', subtitle: 'Lower body', status: 'go', icon: 'human-handsup', duration: 30 },
      { id: 2, type: 'strength', title: 'Plank', subtitle: 'Core', status: 'locked', icon: 'human', duration: 30 },
      { id: 3, type: 'strength', title: 'Lunges', subtitle: 'Legs', status: 'locked', icon: 'walk', duration: 30 },
      { id: 4, type: 'strength', title: 'Pull Ups', subtitle: 'Back & arms', status: 'locked', icon: 'weight-lifter', duration: 30 },
      { id: 5, type: 'strength', title: 'Burpees', subtitle: 'Full body', status: 'locked', icon: 'run-fast', duration: 30 },
    ],
  },
  yoga: {
    label: 'Yoga',
    description: 'Enhance flexibility and balance with yoga flows.',
    circles: [
      { id: 0, type: 'yoga', title: 'Sun Salutation', subtitle: 'Warm up', status: 'start', icon: 'yoga', duration: 30 },
      { id: 1, type: 'yoga', title: 'Tree Pose', subtitle: 'Balance', status: 'go', icon: 'tree', duration: 30 },
      { id: 2, type: 'yoga', title: 'Warrior I', subtitle: 'Strength', status: 'locked', icon: 'human', duration: 30 },
      { id: 3, type: 'yoga', title: 'Downward Dog', subtitle: 'Stretch', status: 'locked', icon: 'dog', duration: 30 },
      { id: 4, type: 'yoga', title: 'Bridge Pose', subtitle: 'Backbend', status: 'locked', icon: 'bridge', duration: 30 },
      { id: 5, type: 'yoga', title: 'Child Pose', subtitle: 'Relax', status: 'locked', icon: 'human-child', duration: 30 },
    ],
  },
}; 