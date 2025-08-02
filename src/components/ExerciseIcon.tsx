import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Icon mapping for better iOS compatibility
const iconMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  'run': 'run',
  'run-fast': 'run-fast',
  'timer': 'timer',
  'terrain': 'terrain',
  'road-variant': 'road-variant',
  'walk': 'walk',
  'arm-flex': 'arm-flex',
  'human-handsup': 'human-handsup',
  'human': 'human',
  'weight-lifter': 'weight-lifter',
  'yoga': 'yoga',
  'tree': 'tree',
  'dog': 'dog',
  'bridge': 'bridge',
  'human-child': 'human-child',
  'rotate-3d-variant': 'rotate-3d-variant',
  'moon-waning-crescent': 'moon-waning-crescent',
  'timer-sand': 'timer-sand',
  'arm-flex-outline': 'arm-flex-outline',
  'dog-side': 'dog-side',
  'star-circle': 'star-circle',
  'star-circle-outline': 'star-circle-outline',
  'star': 'star',
};

interface ExerciseIconProps {
  name: string;
  color?: string;
  size?: number;
}

const ExerciseIcon: React.FC<ExerciseIconProps> = ({ 
  name, 
  color = '#1CB0F6', 
  size = 28 
}) => {
  const iconName = iconMap[name] || 'run';
  
  return (
    <MaterialCommunityIcons 
      name={iconName} 
      size={size} 
      color={color}
      style={{ opacity: 1 }} // Ensure visibility on iOS
    />
  );
};

export default ExerciseIcon; 