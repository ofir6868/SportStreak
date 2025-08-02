import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppText from './AppText';
import { Slider } from '@miblanchard/react-native-slider';
import { useProgress } from './ProgressContext';

interface SchedulePanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SchedulePanel: React.FC<SchedulePanelProps> = ({ isVisible, onClose }) => {
  const { 
    isDarkMode, 
    workoutDaysPerWeek, 
    setWorkoutDaysPerWeek, 
    selectedWorkoutDays, 
    setSelectedWorkoutDays 
  } = useProgress();
  const [slideAnim] = useState(new Animated.Value(-350));

  // Dark mode colors
  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#fff',
    cardBackground: isDarkMode ? '#2a2a2a' : '#fff',
    text: isDarkMode ? '#ffffff' : '#222',
    textSecondary: isDarkMode ? '#cccccc' : '#444',
    primary: '#1CB0F6',
    accent: '#FFA800',
    border: isDarkMode ? '#404040' : '#e0e0e0',
    modalOverlay: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
  };

  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);
  const currentSlidePosition = useRef(350);
  const panStartY = useRef(0);

  // Create PanResponder for gesture handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: (_, gestureState) => {
        if (isAnimatingRef.current) return;
        panStartY.current = gestureState.y0;
        setIsAnimating(false);
      },
      onPanResponderMove: (_, gestureState) => {
        if (isAnimatingRef.current) return;
        const newPosition = currentSlidePosition.current + gestureState.dy;
        slideAnim.setValue(Math.max(-350, Math.min(350, newPosition)));
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isAnimatingRef.current) return;
        
        const velocity = gestureState.vy;
        const distance = gestureState.dy;
        
        // Determine if we should close based on velocity or distance
        const shouldClose = velocity < -0.5 || distance < -50;
        
        if (shouldClose) {
          // Close panel
          isAnimatingRef.current = true;
          setIsAnimating(true);
          Animated.timing(slideAnim, {
            toValue: -350,
            duration: 350,
            useNativeDriver: true,
          }).start(() => {
            isAnimatingRef.current = false;
            setIsAnimating(false);
            currentSlidePosition.current = -350;
            onClose();
          });
        } else {
          // Return to open position
          isAnimatingRef.current = true;
          setIsAnimating(true);
          Animated.spring(slideAnim, {
            toValue: 350,
            useNativeDriver: true,
            tension: 8
          }).start(() => {
            isAnimatingRef.current = false;
            setIsAnimating(false);
            currentSlidePosition.current = 350;
          });
        }
      },
    })
  ).current;

  useEffect(() => {
    // Reset animation state when visibility changes
    isAnimatingRef.current = false;
    setIsAnimating(false);
    
    if (isVisible) {
      isAnimatingRef.current = true;
      setIsAnimating(true);
      Animated.spring(slideAnim, {
        toValue: 350,
        useNativeDriver: true,
        bounciness: 0
      }).start(() => {
        isAnimatingRef.current = false;
        setIsAnimating(false);
        currentSlidePosition.current = 350;
      });
    } else {
      isAnimatingRef.current = true;
      setIsAnimating(true);
      Animated.timing(slideAnim, {
        toValue: -350,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        isAnimatingRef.current = false;
        setIsAnimating(false);
        currentSlidePosition.current = -350;
      });
    }
  }, [isVisible]);

  // Cleanup effect to reset animation state
  useEffect(() => {
    return () => {
      isAnimatingRef.current = false;
      setIsAnimating(false);
    };
  }, []);

  const handleDayPress = (dayIndex: number) => {
    const newSelectedDays = [...selectedWorkoutDays];
    const dayIndexInArray = newSelectedDays.indexOf(dayIndex);
    
    if (dayIndexInArray > -1) {
      // Remove day if already selected
      newSelectedDays.splice(dayIndexInArray, 1);
    } else {
      // Add day if not selected and under limit
      if (newSelectedDays.length < workoutDaysPerWeek) {
        newSelectedDays.push(dayIndex);
      }
    }
    
    setSelectedWorkoutDays(newSelectedDays);
  };

  const handleWorkoutDaysChange = (value: number) => {
    setWorkoutDaysPerWeek(value);
    
    if (selectedWorkoutDays.length > value) {
      // Remove excess selected days if new limit is lower
      setSelectedWorkoutDays(selectedWorkoutDays.slice(0, value));
    } else if (selectedWorkoutDays.length === 0) {
      // Auto-select first N days if no days are selected
      const autoSelectedDays = Array.from({ length: value }, (_, i) => i);
      setSelectedWorkoutDays(autoSelectedDays);
    }
  };

  const isDaySelected = (dayIndex: number) => selectedWorkoutDays.includes(dayIndex);

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          backgroundColor: colors.background,
          transform: [{ translateY: slideAnim }]
        }
      ]}
      {...panResponder.panHandlers}
    >
      {/* Handle bar */}
      <View style={styles.handleContainer}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        <TouchableOpacity 
          onPress={() => {
            // Prevent multiple simultaneous animations
            if (isAnimatingRef.current) return;
            
            isAnimatingRef.current = true;
            setIsAnimating(true);
            Animated.timing(slideAnim, {
              toValue: -350,
              duration: 350,
              useNativeDriver: true,
            }).start(() => {
              isAnimatingRef.current = false;
              setIsAnimating(false);
              onClose();
            });
          }} 
          style={styles.closeButton}
        >
          <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <MaterialCommunityIcons name="calendar-week" size={24} color={colors.primary} />
        <AppText style={[styles.title, { color: colors.text }]}>Your Schedule</AppText>
      </View>

      {/* Workout Days Slider */}
      <View style={[styles.sliderContainer, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.sliderHeader}>
          <MaterialCommunityIcons name="calendar-clock" size={20} color={colors.primary} />
          <AppText style={[styles.sliderLabel, { color: colors.text }]}>How many days per week?</AppText>
        </View>
        <View style={styles.sliderRow}>
          <Slider
            value={workoutDaysPerWeek}
            onValueChange={value => handleWorkoutDaysChange(Array.isArray(value) ? value[0] : value)}
            minimumValue={1}
            maximumValue={7}
            step={1}
            containerStyle={{ flex: 1 }}
            thumbTintColor={colors.primary}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
          />
          <AppText style={[styles.sliderValue, { color: colors.primary }]}>{workoutDaysPerWeek} days</AppText>
        </View>
      </View>

      {/* Calendar */}
      <View style={[styles.calendarContainer, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.calendarHeader}>
          <MaterialCommunityIcons name="calendar-check" size={20} color={colors.primary} />
          <AppText style={[styles.calendarTitle, { color: colors.text }]}>Select your workout days</AppText>
          <View style={[styles.selectionCount, { backgroundColor: colors.primary }]}>
            <AppText style={styles.selectionCountText}>
              {selectedWorkoutDays.length}/{workoutDaysPerWeek}
            </AppText>
          </View>
        </View>
      
        {/* Day headers */}
        <View style={styles.dayHeaders}>
          {DAYS_OF_WEEK.map((day, index) => (
            <View key={day} style={styles.dayHeader}>
              <AppText style={[styles.dayHeaderText, { color: colors.textSecondary }]}>{day}</AppText>
            </View>
          ))}
        </View>

        {/* Day buttons */}
        <View style={styles.daysContainer}>
          {DAYS_OF_WEEK.map((day, index) => {
            const isSelected = isDaySelected(index);
            const isDisabled = !isSelected && selectedWorkoutDays.length >= workoutDaysPerWeek;
            
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  { backgroundColor: colors.cardBackground },
                  isSelected && [styles.dayButtonSelected, { backgroundColor: colors.primary }],
                  isDisabled && [styles.dayButtonDisabled, { backgroundColor: colors.border }]
                ]}
                onPress={() => handleDayPress(index)}
                disabled={isDisabled}
                activeOpacity={0.7}
              >
                <AppText style={[
                  styles.dayButtonText,
                  { color: colors.text },
                  isSelected && styles.dayButtonTextSelected,
                  isDisabled && { color: colors.textSecondary }
                ]}>
                  {index + 1}
                </AppText>
                {isSelected && (
                  <MaterialCommunityIcons 
                    name="check" 
                    size={16} 
                    color="#fff" 
                    style={styles.checkIcon} 
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Summary */}
      <View style={[styles.summaryContainer, { backgroundColor: colors.cardBackground }]}>
        <AppText style={[styles.summaryText, { color: colors.textSecondary }]}>
          {selectedWorkoutDays.length === 0 
            ? 'Select your workout days above'
            : selectedWorkoutDays.length === workoutDaysPerWeek
            ? 'Perfect! Your schedule is complete'
            : `Select ${workoutDaysPerWeek - selectedWorkoutDays.length} more day${workoutDaysPerWeek - selectedWorkoutDays.length !== 1 ? 's' : ''}`
          }
        </AppText>
        {selectedWorkoutDays.length > 0 && (
          <AppText style={[styles.selectedDaysText, { color: colors.primary }]}>
            {selectedWorkoutDays.map(dayIndex => DAYS_OF_WEEK[dayIndex]).join(', ')}
          </AppText>
        )}
      </View>

      {/* Bottom Handle */}
      <View 
        style={[
          styles.bottomHandleContainer,
          { 
            backgroundColor: colors.cardBackground
          }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.bottomHandle, { backgroundColor: colors.border }]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -350, // Start off-screen
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: 35,
    paddingBottom: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 20,
  },
  handleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginLeft: 12,
  },
  sliderContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  connectionLine: {
    height: 2,
    width: 60,
    alignSelf: 'center',
    marginBottom: 8,
    borderRadius: 1,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    marginLeft: 8,
    marginBottom: 0,
  },
  sliderHint: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderValue: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    minWidth: 60,
    textAlign: 'right',
  },
  calendarContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectionCount: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 40,
    alignItems: 'center',
  },
  selectionCountText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
  },
  calendarTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    marginLeft: 8,
    marginBottom: 0,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E6F0FA',
    position: 'relative',
  },
  dayButtonSelected: {
    borderColor: '#1CB0F6',
    shadowColor: '#1CB0F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dayButtonDisabled: {
    opacity: 0.5,
  },
  dayButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
  checkIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFA800',
    borderRadius: 8,
    padding: 1,
  },
  summaryContainer: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedDaysText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  bottomHandleContainer: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bottomHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});

export default SchedulePanel; 