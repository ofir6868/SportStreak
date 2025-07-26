import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProgress } from './ProgressContext';
import { EXERCISE_PRESETS, ExercisePresetKey, PathCircle } from '../config/exercisePresets';
import AppText from './AppText';

// Use safe dimensions for iOS
const getSafeDimensions = () => {
  const { width, height } = Dimensions.get('window');
  // On iOS, account for safe areas and potential issues
  const safeWidth = Platform.OS === 'ios' ? Math.min(width, 400) : width;
  return { width: safeWidth, height };
};

const { width } = getSafeDimensions();
const PATH_WIDTH = width * 0.9;
const BUBBLE_RADIUS = 44;
const BUBBLE_DIAM = BUBBLE_RADIUS * 2;
const BUBBLE_SPACING = 130;
const NUM_BUBBLES = 6;
const PATH_X_CENTER = PATH_WIDTH / 2;
const CURVE_X_OFFSET = 60;
const VERTICAL_GAP = 140;

// Dedicated ExerciseIcon component with better iOS compatibility
export const ExerciseIcon = ({ name, color = '#1CB0F6', size = 28 }: { name: string, color?: string, size?: number }) => {
  // Add fallback for iOS icon mapping issues
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
  };

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

const getBubblePosition = (i: number, numBubbles: number) => {
  // Spread bubbles vertically with more space
  const dir = i % 2 === 0 ? 1 : -1;
  const x = PATH_X_CENTER + (i === 0 ? 0 : dir * CURVE_X_OFFSET);
  // Use VERTICAL_GAP for vertical spacing
  const y = VERTICAL_GAP * i + 80;
  return { x, y };
};

const getPathD = (numBubbles: number) => {
  let d = '';
  for (let i = 0; i < numBubbles - 1; i++) {
    const { x: x1, y: y1 } = getBubblePosition(i, numBubbles);
    const { x: x2, y: y2 } = getBubblePosition(i + 1, numBubbles);
    const c1x = x1;
    const c1y = y1 + (y2 - y1) / 2;
    const c2x = x2;
    const c2y = y2 - (y2 - y1) / 2;
    d += i === 0 ? `M${x1},${y1} ` : '';
    d += `C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2} `;
  }
  return d;
};

const fontMap = {
  Nunito: require('../../assets/fonts/Nunito-Bold.ttf'),
  'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
  'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
};

type Status = 'start' | 'review' | 'go' | 'locked';

type RootStackParamList = {
  Home: undefined;
  Exercise: { exercise: PathCircle; idx: number };
};

const initialProgress = [false, false, false, false, false, false];
const initialCompleted = [false, false, false, false, false, false];

const LearningPath = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fontsLoaded] = useFonts(fontMap);
  const { progress, completed, presetKey, isDarkMode } = useProgress();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);

  // Add console logging for debugging
  useEffect(() => {
    console.log('LearningPath: Component mounted');
    console.log('LearningPath: Platform:', Platform.OS);
    console.log('LearningPath: Fonts loaded:', fontsLoaded);
    console.log('LearningPath: Progress:', progress);
    console.log('LearningPath: Completed:', completed);
    console.log('LearningPath: Preset key:', presetKey);
  }, [fontsLoaded, progress, completed, presetKey]);

  // Add error boundary and data loading check
  useEffect(() => {
    const checkData = async () => {
      try {
        console.log('LearningPath: Checking data...');
        // Ensure we have valid data
        if (progress && completed && presetKey) {
          console.log('LearningPath: Data is valid, setting loaded to true');
          setIsDataLoaded(true);
        } else {
          console.log('LearningPath: Data not ready, waiting...');
          // Wait a bit for data to load
          setTimeout(() => {
            if (progress && completed && presetKey) {
              console.log('LearningPath: Data loaded after delay');
              setIsDataLoaded(true);
            } else {
              console.log('LearningPath: Data still not ready, showing error');
              setError('Data not loaded properly');
              // Enable test mode if data fails to load
              setTestMode(true);
            }
          }, 1000);
        }
      } catch (err) {
        console.error('LearningPath: Error in checkData:', err);
        setError('Failed to load learning path data');
        console.error('LearningPath error:', err);
        setTestMode(true);
      }
    };
    
    checkData();
  }, [progress, completed, presetKey]);

  // Get preset circles with fallback
  const presetCircles = EXERCISE_PRESETS[presetKey]?.circles || EXERCISE_PRESETS['strength'].circles;

  // Dark mode color scheme with excellent contrast
  const colors = {
    // Path colors
    pathStroke: isDarkMode ? '#58CC02' : '#58CC02', // Keep green for path
    pathStrokeWidth: 10,
    
    // Bubble colors
    bubbleBackground: isDarkMode ? '#2a2a2a' : '#fff',
    bubbleBorderLocked: isDarkMode ? '#555555' : '#B0B0B0',
    bubbleShadowLocked: isDarkMode ? '#000' : '#000',
    
    // Status colors
    start: '#1CB0F6',
    review: '#58CC02',
    go: '#1CB0F6',
    locked: isDarkMode ? '#555555' : '#E5E5E5',
    
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
    
    // Container background
    containerBackground: isDarkMode ? '#1a1a1a' : '#fff',
  };

  const statusText = {
    start: 'Start',
    review: 'Review',
    go: 'Go',
    locked: 'Locked',
  };

  // Dynamically assign status based on progress/completed
  const getBubbleStatus = (i: number): Status => {
    if (i === 0) return completed[0] ? 'review' : 'start'; // First circle: review if completed, else start
    if (completed[i]) return 'review';
    if (progress[i]) return 'go';
    return 'locked';
  };

  const handlePress = useCallback((status: Status, bubble: PathCircle, idx: number) => {
    if (status === 'locked') return;
    navigation.navigate('Exercise', {
      exercise: bubble,
      idx,
    });
  }, [navigation]);

  const numBubbles = presetCircles.length;
  const pathHeight = VERTICAL_GAP * (numBubbles - 1) + 200;
  // Calculate last bubble's y position
  const lastBubbleY = VERTICAL_GAP * (numBubbles - 1) + 80;
  const minContainerHeight = lastBubbleY + BUBBLE_RADIUS + 40;

  // Show loading state
  if (!isDataLoaded) {
    return (
      <View style={[styles.outerContainer, { backgroundColor: colors.containerBackground }]}>
        <View style={styles.centeredContainer}>
          <View style={[styles.innerContainer, { minHeight: minContainerHeight }]}>
            <AppText style={[styles.loadingText, { color: colors.titleActive }]}>
              Loading learning path...
            </AppText>
          </View>
        </View>
      </View>
    );
  }

  // Show error state
  if (error && !testMode) {
    return (
      <View style={[styles.outerContainer, { backgroundColor: colors.containerBackground }]}>
        <View style={styles.centeredContainer}>
          <View style={[styles.innerContainer, { minHeight: minContainerHeight }]}>
            <AppText style={[styles.errorText, { color: '#FF4B4B' }]}>
              {error}
            </AppText>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setIsDataLoaded(false);
              }}
            >
              <AppText style={styles.retryText}>Retry</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.retryButton, { marginTop: 10, backgroundColor: '#58CC02' }]}
              onPress={() => setTestMode(true)}
            >
              <AppText style={styles.retryText}>Test Mode</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Test mode - simple rendering
  if (testMode) {
    return (
      <View style={[styles.outerContainer, { backgroundColor: colors.containerBackground }]}>
        <View style={styles.centeredContainer}>
          <View style={[styles.innerContainer, { minHeight: 400 }]}>
            <AppText style={[styles.testTitle, { color: colors.titleActive }]}>
              Learning Path Test Mode
            </AppText>
            <AppText style={[styles.testText, { color: colors.subtitleActive }]}>
              Platform: {Platform.OS}
            </AppText>
            <AppText style={[styles.testText, { color: colors.subtitleActive }]}>
              Fonts Loaded: {fontsLoaded ? 'Yes' : 'No'}
            </AppText>
            <AppText style={[styles.testText, { color: colors.subtitleActive }]}>
              Preset: {presetKey}
            </AppText>
            <AppText style={[styles.testText, { color: colors.subtitleActive }]}>
              Circles: {presetCircles?.length || 0}
            </AppText>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setTestMode(false);
                setError(null);
                setIsDataLoaded(false);
              }}
            >
              <AppText style={styles.retryText}>Exit Test Mode</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.outerContainer, { backgroundColor: colors.containerBackground }]}>
      <View style={styles.centeredContainer}>
        <View style={[styles.innerContainer, { minHeight: minContainerHeight }]}>
          {/* Add fallback for SVG rendering issues on iOS */}
          <View style={styles.svgContainer}>
            <Svg width={PATH_WIDTH} height={pathHeight} style={styles.svg}>
              <Path
                d={getPathD(numBubbles)}
                stroke={colors.pathStroke}
                strokeWidth={colors.pathStrokeWidth}
                fill="none"
                strokeLinecap="round"
              />
            </Svg>
          </View>
          {presetCircles.map((bubble, i) => {
            const { x, y } = getBubblePosition(i, numBubbles);
            const status = getBubbleStatus(i);
            const isLocked = status === 'locked';
            const statusColor = colors[status];
            
            return (
              <TouchableOpacity
                key={bubble.id}
                style={[
                  styles.bubble,
                  {
                    left: x - BUBBLE_RADIUS,
                    top: y - BUBBLE_RADIUS,
                    backgroundColor: colors.bubbleBackground,
                    borderColor: isLocked ? colors.bubbleBorderLocked : statusColor,
                    borderWidth: 4,
                    shadowColor: isLocked ? colors.bubbleShadowLocked : statusColor,
                    shadowOpacity: !isLocked ? 0.2 : 0.05,
                    shadowRadius: 12,
                    elevation: Platform.OS === 'android' ? 4 : 0, // iOS doesn't use elevation
                    opacity: 1,
                  },
                ]}
                onPress={() => handlePress(status, bubble, i)}
                disabled={isLocked}
                activeOpacity={!isLocked ? 0.7 : 1}
              >
                <View style={[styles.iconCircle, { backgroundColor: isLocked ? colors.iconBackground : statusColor }]}> 
                  <ExerciseIcon 
                    name={bubble.icon} 
                    size={28} 
                    color={isLocked ? colors.iconLocked : colors.iconActive} 
                  />
                </View>
                <AppText
                  style={[
                    styles.title,
                    {
                      color: isLocked ? colors.titleLocked : colors.titleActive,
                      fontFamily: fontsLoaded ? 'Nunito' : Platform.OS === 'ios' ? 'System' : undefined,
                    },
                  ]}
                >
                  {bubble.title}
                </AppText>
                <AppText
                  style={[
                    styles.subtitle,
                    {
                      fontFamily: fontsLoaded ? 'Nunito-Regular' : Platform.OS === 'ios' ? 'System' : undefined,
                      color: isLocked ? colors.subtitleLocked : colors.subtitleActive,
                    },
                  ]}
                >
                  {bubble.subtitle}
                </AppText>
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
                        fontFamily: fontsLoaded ? 'Nunito-SemiBold' : Platform.OS === 'ios' ? 'System' : undefined,
                        color: colors.statusText,
                      },
                    ]}
                  >
                    {statusText[status]}
                  </AppText>
                </View>
                {completed[i] && (
                  <MaterialCommunityIcons
                    name="check-bold"
                    size={20}
                    color={colors.checkMark}
                    style={{ position: 'absolute', top: -8, right: -8, zIndex: 10 }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
          <Image 
            source={require('../../assets/mascot.png')} 
            style={styles.mascot} 
            resizeMode="contain"
            // Add onError handler for iOS image loading issues
            onError={() => console.log('Mascot image failed to load')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  centeredContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mascot: {
    position: 'absolute',
    left: 20, // keep mascot within bounds
    top: 260, // align with first/second bubble
    width: 90,
    height: 160,
    zIndex: 10,
  },
  innerContainer: {
    width: PATH_WIDTH,
    minHeight: BUBBLE_SPACING * (NUM_BUBBLES - 1) + 240,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingBottom: 40,
  },
  svgContainer: {
    width: PATH_WIDTH,
    height: VERTICAL_GAP * (NUM_BUBBLES - 1) + 200,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
  },
  svg: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
  },
  bubble: {
    position: 'absolute',
    width: BUBBLE_DIAM,
    height: BUBBLE_DIAM,
    borderRadius: BUBBLE_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    padding: 0,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Nunito-Bold',
    textAlign: "center"
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 2,
  },
  statusBox: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 6,
    alignSelf: 'center',
    shadowColor: '#1CB0F6',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1CB0F6',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  testTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  testText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    textAlign: 'center',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 100,
  },
});

export default LearningPath; 