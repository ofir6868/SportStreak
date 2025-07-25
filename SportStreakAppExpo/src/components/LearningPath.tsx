import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProgress } from './ProgressContext';
import { EXERCISE_PRESETS, ExercisePresetKey } from '../config/exercisePresets';

const { width } = Dimensions.get('window');
const PATH_WIDTH = width * 0.9;
const BUBBLE_RADIUS = 44;
const BUBBLE_DIAM = BUBBLE_RADIUS * 2;
const BUBBLE_SPACING = 130;
const NUM_BUBBLES = 6;
const PATH_X_CENTER = PATH_WIDTH / 2;
const CURVE_X_OFFSET = 60;
const VERTICAL_GAP = 140;


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

type Status = 'start' | 'review' | 'go' | 'locked';

type RootStackParamList = {
  Home: undefined;
  Exercise: { exercise: any; idx: number };
};

const initialProgress = [false, false, false, false, false, false];
const initialCompleted = [false, false, false, false, false, false];

const fetchExerciseDetails = async (id: number) => {
  try {
    const res = await fetch(`https://wger.de/api/v2/exerciseinfo/${id}/`);
    if (!res.ok) throw new Error('Failed to fetch exercise info');
    const data = await res.json();
    // Find English translation
    const translation = data.translations.find((t: any) => t.language === 2);
    const name = translation?.name?.trim() || 'No name';
    // Get image
    const image = data.images && data.images.length > 0 ? data.images[0].image : null;
    return { id, name, image };
  } catch (e) {
    console.log('Fetch error for id', id, e);
    return { id, name: 'No name', image: null };
  }
};

const LearningPath = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fontsLoaded] = useFonts(fontMap);
  const { progress, completed, presetKey } = useProgress();
  const exerciseIds = EXERCISE_PRESETS[presetKey].exerciseIds;
  const [exerciseDetails, setExerciseDetails] = useState<{ id: number; name: string; image: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all(exerciseIds.map(fetchExerciseDetails)).then((results) => {
      if (isMounted) {
        setExerciseDetails(results);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [exerciseIds]);

  // Dynamically assign status based on progress/completed
  const getBubbleStatus = (i: number): Status => {
    if (i === 0) return completed[0] ? 'review' : 'start'; // First circle: review if completed, else start
    if (completed[i]) return 'review';
    if (progress[i]) return 'go';
    return 'locked';
  };

  const handlePress = useCallback((status: Status, bubble: any, idx: number) => {
    if (status === 'locked') return;
    navigation.navigate('Exercise', {
      exercise: bubble,
      idx,
    });
  }, [navigation]);

  const numBubbles = exerciseDetails.length;
  const pathHeight = VERTICAL_GAP * (numBubbles - 1) + 200;
  // Calculate last bubble's y position
  const lastBubbleY = VERTICAL_GAP * (numBubbles - 1) + 80;
  const minContainerHeight = lastBubbleY + BUBBLE_RADIUS + 40;

  // PATCH: Always render, show warning if fonts not loaded
  // if (!fontsLoaded) return null;

  if (loading) {
    return <View style={{ padding: 40, alignItems: 'center' }}><Text>Loading exercises...</Text></View>;
  }

  return (
    <View style={styles.outerContainer}>
      {!fontsLoaded && (
        <></>
      )}
      <View style={styles.centeredContainer}>
        <View style={[styles.innerContainer, { minHeight: minContainerHeight }]}>
          <Svg width={PATH_WIDTH} height={pathHeight} style={styles.svg}>
            <Path
              d={getPathD(numBubbles)}
              stroke="#58CC02"
              strokeWidth={10}
              fill="none"
              strokeLinecap="round"
            />
          </Svg>
          {exerciseDetails.map((exercise, i) => {
            const { x, y } = getBubblePosition(i, numBubbles);
            const status = getBubbleStatus(i);
            const isLocked = status === 'locked';
            return (
              <TouchableOpacity
                key={exercise.id}
                style={[
                  styles.bubble,
                  {
                    left: x - BUBBLE_RADIUS,
                    top: y - BUBBLE_RADIUS,
                    backgroundColor: isLocked ? '#F2F2F2' : '#fff',
                    borderColor: isLocked ? '#B0B0B0' : statusColors[status],
                    borderWidth: 4,
                    shadowColor: statusColors[status],
                    shadowOpacity: !isLocked ? 0.2 : 0.05,
                    shadowRadius: 12,
                    elevation: 4,
                    opacity: 1,
                  },
                ]}
                onPress={() => handlePress(status, exercise, i)}
                disabled={isLocked}
                activeOpacity={!isLocked ? 0.7 : 1}
              >
                {/* Icon at top center */}
                <View style={{ position: 'absolute', top: 8, left: 0, right: 0, alignItems: 'center', zIndex: 2 }}>
                  <View style={[styles.iconCircle, isLocked && { backgroundColor: '#E0E0E0' }]}> 
                    {exercise.image ? (
                      <Image source={{ uri: exercise.image }} style={{ width: 36, height: 36, borderRadius: 18, resizeMode: 'contain' }} />
                    ) : (
                      presetKey === 'strength' ? (
                        <MaterialCommunityIcons name="dumbbell" size={36} color={isLocked ? '#B0B0B0' : statusColors[status]} />
                      ) : presetKey === 'running' ? (
                        <MaterialCommunityIcons name="run" size={36} color={isLocked ? '#B0B0B0' : statusColors[status]} />
                      ) : (
                        <MaterialCommunityIcons name="yoga" size={36} color={isLocked ? '#B0B0B0' : statusColors[status]} />
                      )
                    )}
                  </View>
                </View>
                {/* Text centered in the bubble */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <Text
                    style={[
                      styles.title,
                      {
                        color: isLocked ? '#B0B0B0' : statusColors[status],
                        fontFamily: fontsLoaded ? 'Nunito' : undefined,
                        maxWidth: 60,
                        textAlign: 'center',
                        fontSize: 13,
                        lineHeight: 15,
                        overflow: 'hidden',
                        flexWrap: 'nowrap',
                      },
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {exercise.name}
                  </Text>
                </View>
                {/* Status button at bottom center */}
                <View
                  style={[
                    styles.statusBox,
                    {
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      right: 0,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      backgroundColor: isLocked ? '#B0B0B0' : statusColors[status],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        fontFamily: fontsLoaded ? 'Nunito-SemiBold' : undefined,
                        color: isLocked ? '#fff' : '#fff',
                      },
                    ]}
                  >
                    {statusText[status]}
                  </Text>
                </View>
                {completed[i] && (
                  <Text
                    style={{ position: 'absolute', top: 7, right: 11, fontSize: 16, color: '#58CC02', zIndex: 3 }}
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
    position: 'absolute',
    top: -28,
    left: 17,
    right: 0,
    bottom: 0,
    backgroundColor: '#F4F8FB',
    alignItems: 'center',
    justifyContent: 'center',
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