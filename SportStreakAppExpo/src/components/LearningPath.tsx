import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProgress } from './ProgressContext';

const { width } = Dimensions.get('window');
const PATH_WIDTH = width * 0.9;
const BUBBLE_RADIUS = 44;
const BUBBLE_DIAM = BUBBLE_RADIUS * 2;
const BUBBLE_SPACING = 130;
const NUM_BUBBLES = 6;
const PATH_X_CENTER = PATH_WIDTH / 2;
const CURVE_X_OFFSET = 60;

const bubbles = [
  { id: 0, type: 'exercise', title: 'Push Ups', subtitle: 'Let\'s go!', status: 'start' as const, icon: <MaterialCommunityIcons name="arm-flex" size={28} color="#1CB0F6" /> },
  { id: 1, type: 'exercise', title: 'Squats', subtitle: 'Lower body', status: 'review' as const, icon: <MaterialCommunityIcons name="human-handsup" size={28} color="#58CC02" /> },
  { id: 2, type: 'exercise', title: 'Plank', subtitle: 'Core strength', status: 'go' as const, icon: <MaterialCommunityIcons name="human" size={28} color="#1CB0F6" /> },
  { id: 3, type: 'exercise', title: 'Jumping Jacks', subtitle: 'Cardio', status: 'locked' as const, icon: <MaterialCommunityIcons name="run" size={28} color="#B0B0B0" /> },
  { id: 4, type: 'exercise', title: 'Lunges', subtitle: 'Legs', status: 'locked' as const, icon: <MaterialCommunityIcons name="walk" size={28} color="#B0B0B0" /> },
  { id: 5, type: 'exercise', title: 'Burpees', subtitle: 'Full body', status: 'locked' as const, icon: <MaterialCommunityIcons name="weight-lifter" size={28} color="#B0B0B0" /> },
];

type Status = 'start' | 'review' | 'go' | 'locked';

const getBubblePosition = (i: number) => {
  const dir = i % 2 === 0 ? 1 : -1;
  const x = PATH_X_CENTER + (i === 0 ? 0 : dir * CURVE_X_OFFSET);
  const y = BUBBLE_SPACING * i + 80; // more margin at top
  return { x, y };
};

const getPathD = () => {
  let d = '';
  for (let i = 0; i < bubbles.length - 1; i++) {
    const { x: x1, y: y1 } = getBubblePosition(i);
    const { x: x2, y: y2 } = getBubblePosition(i + 1);
    const c1x = x1;
    const c1y = y1 + BUBBLE_SPACING / 2;
    const c2x = x2;
    const c2y = y2 - BUBBLE_SPACING / 2;
    d += i === 0 ? `M${x1},${y1} ` : '';
    d += `C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2} `;
  }
  return d;
};

const statusColors = {
  start: '#1CB0F6',
  review: '#58CC02',
  go: '#1CB0F6',
  locked: '#E5E5E5',
};

const statusText = {
  start: 'Start',
  review: 'Review',
  go: 'Go',
  locked: 'Locked',
};

const fontMap = {
  Nunito: require('../../assets/fonts/Nunito-Bold.ttf'),
  'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
  'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
};

type RootStackParamList = {
  Home: undefined;
  Exercise: { exercise: any; idx: number };
};

const initialProgress = [false, false, false, false, false, false];
const initialCompleted = [false, false, false, false, false, false];

const LearningPath = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fontsLoaded] = useFonts(fontMap);
  const { progress, completed } = useProgress();

  // Dynamically assign status based on progress/completed
  const getBubbleStatus = (i: number): Status => {
    if (completed[i]) return 'review';
    if (progress[i]) return i === 0 ? 'start' : 'go';
    return 'locked';
  };

  const handlePress = useCallback((status: Status, bubble: any, idx: number) => {
    if (!progress[idx]) return;
    navigation.navigate('Exercise', {
      exercise: bubble,
      idx,
    });
  }, [navigation, progress]);

  const pathHeight = BUBBLE_SPACING * (NUM_BUBBLES - 1) + 200; // more margin at bottom

  if (!fontsLoaded) return null;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.centeredContainer}>
        <View style={styles.innerContainer}>
          <Svg width={PATH_WIDTH} height={pathHeight} style={styles.svg}>
            <Path
              d={getPathD()}
              stroke="#58CC02"
              strokeWidth={10}
              fill="none"
              strokeLinecap="round"
            />
          </Svg>
          {bubbles.map((bubble, i) => {
            const { x, y } = getBubblePosition(i);
            const status = getBubbleStatus(i);
            const isLocked = status === 'locked';
            return (
              <TouchableOpacity
                key={bubble.id}
                style={[
                  styles.bubble,
                  {
                    left: x - BUBBLE_RADIUS,
                    top: y - BUBBLE_RADIUS,
                    backgroundColor: completed[i]
                      ? '#E6F0FA'
                      : progress[i]
                      ? '#fff'
                      : isLocked
                      ? '#F2F2F2'
                      : '#E5E5E5',
                    borderColor: completed[i]
                      ? '#58CC02'
                      : progress[i]
                      ? statusColors[status]
                      : isLocked
                      ? '#B0B0B0'
                      : '#B0B0B0',
                    borderWidth: 4,
                    shadowColor: statusColors[status],
                    shadowOpacity: progress[i] ? 0.2 : 0.05,
                    shadowRadius: 12,
                    elevation: 4,
                    opacity: 1, // No half opacity for locked
                  },
                ]}
                onPress={() => handlePress(status, bubble, i)}
                activeOpacity={progress[i] ? 0.7 : 1}
                disabled={!progress[i]}
              >
                <View style={[styles.iconCircle, isLocked && { backgroundColor: '#E0E0E0' }]}> 
                  {React.cloneElement(bubble.icon, { color: isLocked ? '#B0B0B0' : statusColors[status] })}
                </View>
                <Text
                  style={[
                    styles.title,
                    {
                      color: isLocked ? '#B0B0B0' : statusColors[status],
                      fontFamily: 'Nunito',
                    },
                  ]}
                >
                  {bubble.title}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    {
                      fontFamily: 'Nunito-Regular',
                      color: isLocked ? '#B0B0B0' : '#888',
                    },
                  ]}
                >
                  {bubble.subtitle}
                </Text>
                <View
                  style={[
                    styles.statusBox,
                    {
                      backgroundColor: isLocked ? '#B0B0B0' : statusColors[status],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        fontFamily: 'Nunito-SemiBold',
                        color: isLocked ? '#fff' : '#fff',
                      },
                    ]}
                  >
                    {statusText[status]}
                  </Text>
                </View>
                {completed[i] && (
                  <Text
                    style={{ position: 'absolute', top: 4, right: 4, fontSize: 16, color: '#58CC02' }}
                  >
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
          <Image source={require('../../assets/mascot.png')} style={styles.mascot} resizeMode="contain" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
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
    backgroundColor: '#F4F8FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: "center"
  },
  subtitle: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  statusBox: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 6,
    alignSelf: 'center',
    backgroundColor: '#1CB0F6',
    shadowColor: '#1CB0F6',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
});

export default LearningPath; 