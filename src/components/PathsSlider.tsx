import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppText from './AppText';
import { useProgress } from './ProgressContext';
import { EXERCISE_PRESETS, PathKey } from '../config/exercisePresets';

const { width: screenWidth } = Dimensions.get('window');

const PathsSlider = () => {
  const { presetKey, pathKey, setPathKey, isDarkMode } = useProgress();
  
  const currentPreset = EXERCISE_PRESETS[presetKey];
  const paths = currentPreset?.paths || [];

  // Animation values
  const heightAnim = useRef(new Animated.Value(50)).current; // Minimized height
  const opacityAnim = useRef(new Animated.Value(0)).current; // Text opacity
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // Icon scale
  const widthAnim = useRef(new Animated.Value(50)).current; // Minimized width (square)
  const expandTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const handlePathSelect = (newPathKey: PathKey) => {
    if (newPathKey === pathKey) return; // Don't animate if same path
    
    setPathKey(newPathKey);
    
    // Expand briefly to show the change
    if (!isExpanded) {
      expandSlider();
    }
  };

  const expandSlider = () => {
    setIsExpanded(true);
    
    // Clear any existing timeout
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }

    // Animate to expanded state
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: 80, // Expanded height
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(widthAnim, {
        toValue: 105, // Expanded width
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    // Auto-collapse after showing the change
    expandTimeoutRef.current = setTimeout(() => {
      collapseSlider();
    }, 1700);
  };

  const collapseSlider = () => {
    setIsExpanded(false);
    
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: 50, // Minimized height
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(widthAnim, {
        toValue: 50, // Minimized width (square)
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current);
      }
    };
  }, []);

  const getPathIcon = (iconName: string) => {
    return iconName;
  };

  const colors = {
    background: isDarkMode ? '#2a2a2a' : '#fff',
    text: isDarkMode ? '#ffffff' : '#222',
    textSecondary: isDarkMode ? '#cccccc' : '#888',
    primary: '#1CB0F6',
    border: isDarkMode ? '#404040' : '#e0e0e0',
    selectedBackground: isDarkMode ? '#1a1a1a' : '#F8F9FB',
  };

  if (paths.length <= 1) {
    return null; // Don't show slider if there's only one path
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
        }
      ]}
    >
      {/* Path Title Section */}
      <View style={styles.titleContainer}>
        <View style={[styles.hrLine, { backgroundColor: colors.border }]} />
        <AppText style={[styles.pathTitle, { color: colors.text }]}>
          {currentPreset?.label || 'Exercise Paths'}
        </AppText>
        <View style={[styles.hrLine, { backgroundColor: colors.border }]} />
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {paths.map((path) => {
          const isSelected = pathKey === path.key;
          
          return (
            <Animated.View
              key={path.key}
              style={[
                styles.pathItem,
                {
                  backgroundColor: isSelected ? colors.selectedBackground : colors.background,
                  borderColor: isSelected ? colors.primary : colors.border,
                  width: widthAnim,
                  height: heightAnim ,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.touchableArea}
                onPress={() => handlePathSelect(path.key)}
                activeOpacity={0.7}
              >
              <Animated.View 
                style={[
                  styles.iconContainer,
                ]}
              >
                <MaterialCommunityIcons
                  name={getPathIcon(path.icon) as any}
                  size={24}
                  color={isSelected ? colors.primary : colors.textSecondary}
                />
              </Animated.View>
              
              <Animated.View
                style={{
                  opacity: opacityAnim,
                  height: Animated.multiply(opacityAnim, 20), // Animate height with opacity
                }}
              >
                <AppText
                  style={[
                    styles.pathLabel,
                    {
                      color: isSelected ? colors.primary : colors.text,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {path.label}
                </AppText>
              </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    // borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    overflow: 'hidden', // Prevent content from overflowing during animation
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  hrLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 12,
  },
  pathTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 12,
    alignItems: 'center', // Center items vertically
  },
  pathItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
  },
  touchableArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default PathsSlider; 