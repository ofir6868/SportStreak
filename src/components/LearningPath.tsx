import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { EXERCISE_PRESETS, PathCircle as PathCircleType } from '../config/exercisePresets';
import AppText from './AppText';
import PathCircle from './PathCircle';
import { useProgress } from './ProgressContext';

// Use safe dimensions for iOS
const getSafeDimensions = () => {
  const { width, height } = Dimensions.get('window');
  // On iOS, account for safe areas and potential issues
  const safeWidth = Platform.OS === 'ios' ? Math.min(width, 400) : width;
  return { width: safeWidth, height };
};

const { width } = getSafeDimensions();
const PATH_WIDTH = width * 0.9;
const CIRCLE_RADIUS = 44;
const CIRCLE_SPACING = 130;
const NUM_CIRCLES = 6;
const PATH_X_CENTER = PATH_WIDTH / 2;
const CURVE_X_OFFSET = 60;
const VERTICAL_GAP = 140;

const getCirclePosition = (i: number, numCircles: number) => {
  // Spread bubbles vertically with more space
  const dir = i % 2 === 0 ? 1 : -1;
  const x = PATH_X_CENTER + (i === 0 ? 0 : dir * CURVE_X_OFFSET);
  // Use VERTICAL_GAP for vertical spacing
  const y = VERTICAL_GAP * i + 80;
  return { x, y };
};

const getPathD = (numCircles: number, startIndex: number, endIndex: number) => {
  if (numCircles < 2 || startIndex >= endIndex) return '';
  
  // Get all bubble positions
  const positions = [];
  for (let i = 0; i < numCircles; i++) {
    positions.push(getCirclePosition(i, numCircles));
  }
  
  // Create a mathematical sin-like curve that passes through circles from startIndex to endIndex
  let d = `M${positions[startIndex].x},${positions[startIndex].y}`;
  
  // For each segment between circles, create a smooth curve
  for (let i = startIndex; i < endIndex; i++) {
    const current = positions[i];
    const next = positions[i + 1];
    
    // Calculate distances
    const verticalDistance = next.y - current.y;
    const horizontalDistance = Math.abs(next.x - current.x);
    
    // Create a mathematical sin-like curve
    // The curve should flow smoothly from one circle to the next
    // with appropriate curvature that mimics a sin function
    
    // Determine the direction for this segment
    const isEven = i % 2 === 0;
    const curveDirection = isEven ? 1 : -1;
    
    // Calculate control points for a smooth sin-like curve
    // Use mathematical approach to create proper sin-like curves
    
    // First control point: starts from current circle and curves outward
    // Use mathematical proportions for sin-like curves with proper amplitude
    // The 0.8 factor creates a pronounced sin-like curve
    const control1X = current.x + (curveDirection * horizontalDistance * 0.8);
    const control1Y = current.y + verticalDistance * 0.7;
    
    // Second control point: curves back toward the next circle
    // Mirror the first control point for smooth transition
    const control2X = next.x - (curveDirection * horizontalDistance * 0.8);
    const control2Y = next.y - verticalDistance * 0.7;
    
    d += ` C${control1X},${control1Y} ${control2X},${control2Y} ${next.x},${next.y}`;
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
  Exercise: { exercise: PathCircleType; idx: number };
};

const LearningPath = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fontsLoaded] = useFonts(fontMap);
  const { progress, completed, presetKey, pathKey, isDarkMode } = useProgress();
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
    console.log('LearningPath: Path key:', pathKey);
  }, [fontsLoaded, progress, completed, presetKey, pathKey]);

  // Add error boundary and data loading check
  useEffect(() => {
    const checkData = async () => {
      try {
        console.log('LearningPath: Checking data...');
        // Ensure we have valid data
        if (progress && completed && presetKey && pathKey) {
          console.log('LearningPath: Data is valid, setting loaded to true');
          setIsDataLoaded(true);
        } else {
          console.log('LearningPath: Data not ready, waiting...');
          // Wait a bit for data to load
          setTimeout(() => {
            if (progress && completed && presetKey && pathKey) {
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
  }, [progress, completed, presetKey, pathKey]);

  // Get path circles with fallback
  const currentPreset = EXERCISE_PRESETS[presetKey];
  const currentPath = currentPreset?.paths.find(path => path.key === pathKey);
  const presetCircles = currentPath?.circles || EXERCISE_PRESETS['strength'].paths[0].circles;

  // Dark mode color scheme with excellent contrast
  const colors = {
    // Path colors
    pathStroke: '#FFA800', // Active path color
    pathStrokeGrayed: isDarkMode ? '#555555' : '#E5E5E5', // Grayed out path color
    pathStrokeWidth: 10,
    
    // Container background
    containerBackground: isDarkMode ? '#1a1a1a' : '#fff',
  };

  // Dynamically assign status based on progress/completed
  const getCircleStatus = (i: number): Status => {
    if (i === 0) return completed[0] ? 'review' : 'start'; // First circle: review if completed, else start
    if (completed[i]) return 'review';
    if (progress[i]) return 'go';
    return 'locked';
  };

  const handlePress = useCallback((status: Status, bubble: PathCircleType, idx: number) => {
    if (status === 'locked') return;
    navigation.navigate('Exercise', {
      exercise: bubble,
      idx,
    });
  }, [navigation]);

  const numCircles = presetCircles.length;
  const pathHeight = VERTICAL_GAP * (numCircles - 1) + 200;
  // Calculate last bubble's y position
  const lastCircleY = VERTICAL_GAP * (numCircles - 1) + 80;
  const minContainerHeight = lastCircleY + CIRCLE_RADIUS + 40;

  // Find the maximum reached circle index
  const getMaxReachedIndex = () => {
    for (let i = numCircles - 1; i >= 0; i--) {
      if (completed[i] || progress[i]) {
        return i;
      }
    }
    return -1; // No circles reached yet
  };

  const maxReachedIndex = getMaxReachedIndex();

  // Show loading state
  if (!isDataLoaded) {
    return (
      <View style={[styles.outerContainer, { backgroundColor: colors.containerBackground }]}>
        <View style={styles.centeredContainer}>
          <View style={[styles.innerContainer, { minHeight: minContainerHeight }]}>
            <AppText style={[styles.loadingText, { color: '#1CB0F6' }]}>
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
            <AppText style={[styles.testTitle, { color: '#1CB0F6' }]}>
              Learning Path Test Mode
            </AppText>
            <AppText style={[styles.testText, { color: '#888' }]}>
              Platform: {Platform.OS}
            </AppText>
            <AppText style={[styles.testText, { color: '#888' }]}>
              Fonts Loaded: {fontsLoaded ? 'Yes' : 'No'}
            </AppText>
            <AppText style={[styles.testText, { color: '#888' }]}>
              Preset: {presetKey}
            </AppText>
            <AppText style={[styles.testText, { color: '#888' }]}>
              Path: {pathKey}
            </AppText>
            <AppText style={[styles.testText, { color: '#888' }]}>
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
              {/* Render reached path segment */}
              {maxReachedIndex >= 0 && (
                <Path
                  d={getPathD(numCircles, 0, maxReachedIndex)}
                  stroke={colors.pathStroke}
                  strokeWidth={colors.pathStrokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              )}
              {/* Render unreached path segment */}
              {maxReachedIndex < numCircles - 1 && (
                <Path
                  d={getPathD(numCircles, Math.max(0, maxReachedIndex), numCircles - 1)}
                  stroke={colors.pathStrokeGrayed}
                  strokeWidth={colors.pathStrokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              )}
            </Svg>
          </View>
          
          {/* Render PathCircles */}
          {presetCircles.map((circleConfig, i) => {
            const { x, y } = getCirclePosition(i, numCircles);
            const status = getCircleStatus(i);
            
            return (
              <View
                key={circleConfig.id}
                style={[
                  styles.bubbleContainer,
                  {
                    left: x - CIRCLE_RADIUS,
                    top: y - CIRCLE_RADIUS,
                  },
                ]}
              >
                <PathCircle
                  circleConfig={circleConfig}
                  index={i}
                  status={status}
                  isCompleted={completed[i]}
                  onPress={handlePress}
                  isDarkMode={isDarkMode}
                />
              </View>
            );
          })}
          
          <Image 
            source={isDarkMode ? require('../../assets/transparent_mascot.png') : require('../../assets/mascot.png')} 
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
    minHeight: CIRCLE_SPACING * (NUM_CIRCLES - 1) + 240,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingBottom: 40,
  },
  svgContainer: {
    width: PATH_WIDTH,
    height: VERTICAL_GAP * (NUM_CIRCLES - 1) + 200,
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
  bubbleContainer: {
    position: 'absolute',
    zIndex: 2,
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
});

export default LearningPath; 