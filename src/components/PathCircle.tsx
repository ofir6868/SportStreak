import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppText from './AppText';
import { PathCircle as PathCircleType } from '../config/exercisePresets';

type Status = 'start' | 'review' | 'go' | 'locked';

interface PathCircleProps {
  circleConfig: PathCircleType;
  index: number;
  status: Status;
  isCompleted: boolean;
  onPress: (status: Status, circle: PathCircleType, index: number) => void;
  isDarkMode: boolean;
}

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

const statusText = {
  start: 'Start',
  review: 'Review',
  go: 'Go',
  locked: 'Locked',
};

const PathCircle: React.FC<PathCircleProps> = ({
  circleConfig,
  index,
  status,
  isCompleted,
  onPress,
  isDarkMode,
}) => {
  const isLocked = status === 'locked';
  const isLastCircle = index === 5; // Assuming 6 circles (0-5)
  
  // Dark mode color scheme
  const colors = {
    // Status colors
    start: '#1CB0F6',
    review: '#58CC02',
    go: '#1CB0F6',
    locked: isDarkMode ? '#555555' : '#E5E5E5',
    
    // Bubble colors
    bubbleBackground: isDarkMode ? '#2a2a2a' : '#fff',
    bubbleBorderLocked: isDarkMode ? '#555555' : '#B0B0B0',
    bubbleShadowLocked: isDarkMode ? '#000' : '#000',
    
    // Icon colors
    iconBackground: isDarkMode ? '#1a1a1a' : '#F4F8FB',
    iconLocked: isDarkMode ? '#888888' : '#B0B0B0',
    iconActive: '#ffffff',
    
    // Text colors
    titleLocked: isDarkMode ? '#888888' : '#B0B0B0',
    titleActive: isDarkMode ? '#ffffff' : '#1CB0F6',
    subtitleLocked: isDarkMode ? '#666666' : '#B0B0B0',
    subtitleActive: isDarkMode ? '#cccccc' : '#888',
    
    // Status box colors
    statusBoxLocked: isDarkMode ? '#555555' : '#B0B0B0',
    statusText: '#ffffff',
    
    // Check mark
    checkMark: '#58CC02',
  };

  const statusColor = colors[status];
  const iconName = iconMap[circleConfig.icon] || 'run';

  const handlePress = () => {
    onPress(status, circleConfig, index);
  };

  return (
    <TouchableOpacity
      style={[
        styles.bubble,
        {
          backgroundColor: colors.bubbleBackground,
          borderColor: isLocked ? colors.bubbleBorderLocked : statusColor,
          shadowColor: isLocked ? colors.bubbleShadowLocked : statusColor,
          shadowOpacity: !isLocked ? 0.2 : 0.05,
        },
      ]}
      onPress={handlePress}
      disabled={isLocked}
      activeOpacity={!isLocked ? 0.7 : 1}
    >
      {/* Icon Circle - Fixed at top */}
      <View style={[styles.iconCircle, { backgroundColor: isLocked ? colors.iconBackground : statusColor }]}>
        {isLastCircle ? (
          <MaterialCommunityIcons
            name="trophy"
            size={28}
            color={isLocked ? colors.iconLocked : colors.iconActive}
          />
        ) : (
          <MaterialCommunityIcons
            name={iconName}
            size={28}
            color={isLocked ? colors.iconLocked : colors.iconActive}
          />
        )}
      </View>

      {/* Text Container - Fixed height */}
      <View style={styles.textContainer}>
        <AppText
          style={[
            styles.title,
            {
              color: isLocked ? colors.titleLocked : colors.titleActive,
            },
          ]}
          numberOfLines={2}
        >
          {circleConfig.title}
        </AppText>
        <AppText
          style={[
            styles.subtitle,
            {
              color: isLocked ? colors.subtitleLocked : colors.subtitleActive,
            },
          ]}
          numberOfLines={2}
        >
          {circleConfig.subtitle}
        </AppText>
      </View>

      {/* Status Box - Fixed at bottom */}
      <View
        style={[
          styles.statusBox,
          {
            backgroundColor: isLocked ? colors.statusBoxLocked : statusColor,
          },
        ]}
      >
        <AppText
          style={[
            styles.statusText,
            {
              color: colors.statusText,
            },
          ]}
        >
          {statusText[status]}
        </AppText>
      </View>

      {/* Completion Check Mark */}
      {isCompleted && (
        <MaterialCommunityIcons
          name="check-bold"
          size={20}
          color={colors.checkMark}
          style={styles.checkMark}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bubble: {
    width: 88, // BUBBLE_DIAM
    height: 88, // BUBBLE_DIAM
    borderRadius: 44, // BUBBLE_RADIUS
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 4,
    shadowRadius: 12,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    marginTop: -25,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    maxHeight: 40,
    width: '100%',
  },
  title: {
    fontSize: 13,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    maxWidth: 70,
    textAlign: 'center',
    lineHeight: 8,
  },
  statusBox: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 4,
    alignSelf: 'center',
    shadowColor: '#1CB0F6',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 11,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  checkMark: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
  },
});

export default PathCircle; 