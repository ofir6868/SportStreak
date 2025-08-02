import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AppText from '../AppText';
import CircularProgress from '../CircularProgress';

interface DetailsModeProps {
  exercise: any;
  duration: number;
  onDone: () => void;
  onBack: () => void;
  onPause: () => void;
  onSkip: () => void;
  colors: any;
  recordingState: 'idle' | 'countdown' | 'recording' | 'paused' | 'rest';
  setRecordingState: (state: 'idle' | 'countdown' | 'recording' | 'paused' | 'rest') => void;
  countdown: number;
  timer: number | null;
  showDone: boolean;
  blinkAnim: Animated.Value;
  getReadyTimer?: number | null;
  restTimer?: number | null;
  workoutId?: string;
  setNumber?: number;
  totalSets?: number;
  currentSet?: number;
  totalExerciseSets?: number;
  restBetweenSets?: number;
}

const DetailsMode: React.FC<DetailsModeProps> = ({
  exercise,
  duration,
  onDone,
  onBack,
  onPause,
  onSkip,
  colors,
  recordingState,
  setRecordingState,
  countdown,
  timer,
  showDone,
  blinkAnim,
  getReadyTimer,
  restTimer,
  workoutId,
  setNumber,
  totalSets,
  currentSet = 1,
  totalExerciseSets = 1,
  restBetweenSets = 30,
}) => {
  // Calculate timer progress for circular progress
  const progress = timer !== null ? (duration - timer) / duration : 0;
  const progressAngle = Math.min(progress * 360, 360);

  // Generate workout stages based on exercise type and sets
  const getWorkoutStages = () => {
    const stages = [];
    
    // Add get ready stage (10 seconds total, includes countdown in last 3 seconds)
    stages.push({ 
      name: 'Get ready', 
      duration: 10, // 10 seconds total
      active: recordingState === 'idle' || recordingState === 'countdown',
      paused: recordingState === 'idle', // idle means paused/stopped
      type: 'prep',
      countdown: recordingState === 'countdown' && getReadyTimer && getReadyTimer <= 3 ? countdown : null,
      getReadyTimer: recordingState === 'countdown' && getReadyTimer && getReadyTimer > 3 ? getReadyTimer : null
    });
    
    // Add work stages for each set
    for (let i = 1; i <= totalExerciseSets; i++) {
      const isCurrentSet = currentSet === i;
      const isActive = recordingState === 'recording' && isCurrentSet;
      const isPaused = recordingState === 'paused' && isCurrentSet;
      
      stages.push({ 
        name: `Work Set ${i}`, 
        duration: duration, 
        active: isActive,
        paused: isPaused,
        type: 'work',
        setNumber: i
      });
      
      // Add rest stage between sets (except after the last set)
      if (i < totalExerciseSets) {
        const isCurrentRest = recordingState === 'rest' && currentSet === i;
        stages.push({ 
          name: 'Rest', 
          duration: restBetweenSets, 
          active: isCurrentRest,
          paused: false, // rest periods don't have pause state
          type: 'rest',
          restTimer: isCurrentRest ? restTimer : null
        });
      }
    }
    
    return stages;
  };

  const workoutStages = getWorkoutStages();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <FontAwesome5 name="chevron-left" size={16} color={colors.text} />
        </TouchableOpacity>
        
        <View style={[styles.sessionInfo, { backgroundColor: colors.cardBackground }]}>
          <AppText style={[styles.sessionTitle, { color: colors.text }]}>
            {exercise.title} session
          </AppText>
          <AppText style={[styles.sessionSubtitle, { color: colors.textSecondary }]}>
            {duration}s duration
            {workoutId && setNumber && totalSets && ` • Set ${setNumber} of ${totalSets}`}
            {totalExerciseSets > 1 && ` • ${totalExerciseSets} sets`}
          </AppText>
        </View>
        
        <View style={styles.iconButton}>
          <FontAwesome5 name="dumbbell" size={16} color={colors.text} />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>

        {(recordingState === 'idle' || recordingState === 'countdown') && (
          <>
            <AppText style={[styles.startText, { color: colors.text }]}>
              {recordingState === 'countdown' ? 'Get Ready!' : 'Start!'}
            </AppText>
            {recordingState === 'countdown' ? (
              <>
                {getReadyTimer && getReadyTimer > 3 ? (
                  <View style={styles.timerContainer}>
                    <CircularProgress
                      progress={(10 - getReadyTimer) / 10}
                      size={200}
                      strokeWidth={8}
                      color={colors.primary}
                      backgroundColor={colors.border}
                      textColor={colors.text}
                      text={`${getReadyTimer}s`}
                      fontSize={36}
                    />
                  </View>
                ) : (
                  <View style={styles.countdownContainer}>
                    <Animated.Text style={[styles.countdownDigit, { opacity: countdown === 3 ? 1 : 0.3, color: colors.primary }]}>3</Animated.Text>
                    <Animated.Text style={[styles.countdownDigit, { opacity: countdown === 2 ? 1 : 0.3, color: colors.primary }]}>2</Animated.Text>
                    <Animated.Text style={[styles.countdownDigit, { opacity: countdown === 1 ? 1 : 0.3, color: colors.primary }]}>1</Animated.Text>
                  </View>
                )}
                <TouchableOpacity 
                  style={[styles.skipButton, { backgroundColor: colors.textSecondary + '20' }]} 
                  onPress={onSkip}
                >
                  <AppText style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                    Skip
                  </AppText>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: colors.primary }]}
                onPress={() => setRecordingState('countdown')}
              >
                <FontAwesome5 name="play" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </>
        )}

        {(recordingState === 'recording' || recordingState === 'paused') && (
          <>
            <AppText style={[styles.startText, { color: colors.text }]}>
              {totalExerciseSets > 1 ? `Set ${currentSet} of ${totalExerciseSets}` : 'Keep Going!'}
            </AppText>
            <View style={styles.timerContainer}>
              <CircularProgress
                progress={progress}
                size={200}
                strokeWidth={8}
                color={colors.primary}
                backgroundColor={colors.border}
                textColor={colors.text}
                text={timer !== null ? `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}` : '00:00'}
                fontSize={36}
              />
            </View>
            <View style={styles.buttonContainer}>
              {showDone && (
                <TouchableOpacity 
                  style={[styles.pauseButton, { backgroundColor: colors.accent }]} 
                  onPress={onPause}
                >
                  <FontAwesome5 
                    name={recordingState === 'paused' ? 'play' : 'pause'} 
                    size={20} 
                    color="#fff" 
                  />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        {recordingState === 'rest' && (
          <>
            <AppText style={[styles.startText, { color: colors.text }]}>
              Rest Time
            </AppText>
            <View style={styles.timerContainer}>
              <CircularProgress
                progress={restTimer ? (exercise.restBetweenSets || 30) - restTimer / (exercise.restBetweenSets || 30) : 0}
                size={200}
                strokeWidth={8}
                color={colors.accent}
                backgroundColor={colors.border}
                textColor={colors.text}
                text={restTimer !== null ? `${Math.floor(restTimer / 60)}:${(restTimer % 60).toString().padStart(2, '0')}` : '00:00'}
                fontSize={36}
              />
            </View>
            <AppText style={[styles.startText, { color: colors.textSecondary, fontSize: 16 }]}>
              Get ready for Set {currentSet + 1}
            </AppText>
            <TouchableOpacity 
              style={[styles.skipButton, { backgroundColor: colors.textSecondary + '20' }]} 
              onPress={onSkip}
            >
              <AppText style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                Skip Rest
              </AppText>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { backgroundColor: '#fff' }]}>
        <ScrollView style={styles.bottomSheetContent} showsVerticalScrollIndicator={false}>
          {workoutStages.map((stage, index) => (
            <View key={index} style={styles.stageRow}>
              <View style={[
                styles.stageName, 
                stage.active && { backgroundColor: colors.primary + '20' },
                stage.paused && { backgroundColor: colors.accent + '20' }
              ]}>
                <View style={styles.stageContent}>
                  <AppText style={[
                    styles.stageText, 
                    { color: stage.active ? colors.primary : stage.paused ? colors.accent : colors.text }
                  ]}>
                    {stage.name}
                    {stage.getReadyTimer && stage.active && (
                      <AppText style={[styles.countdownIndicator, { color: colors.primary }]}>
                        {' '}({stage.getReadyTimer}s)
                      </AppText>
                    )}
                    {stage.countdown && stage.active && (
                      <AppText style={[styles.countdownIndicator, { color: colors.primary }]}>
                        {' '}({stage.countdown})
                      </AppText>
                    )}
                    {stage.restTimer && stage.active && (
                      <AppText style={[styles.countdownIndicator, { color: colors.primary }]}>
                        {' '}({stage.restTimer}s)
                      </AppText>
                    )}
                  </AppText>
                  {stage.paused && (
                    <FontAwesome5 
                      name="pause" 
                      size={12} 
                      color={colors.accent} 
                      style={styles.statusIcon}
                    />
                  )}
                  {stage.active && !stage.paused && (
                    <FontAwesome5 
                      name="play" 
                      size={12} 
                      color={colors.primary} 
                      style={styles.statusIcon}
                    />
                  )}
                </View>
              </View>
              <AppText style={[styles.stageDuration, { color: colors.textSecondary }]}>
                {stage.duration}s
              </AppText>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: {
    flex: 1,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  sessionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  startText: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    marginBottom: 40,
  },
  startButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  countdownDigit: {
    fontSize: 48,
    fontFamily: 'Nunito-Bold',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  pauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 20,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: 300, // Add max height to prevent overflow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSheetContent: {
    gap: 12,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  stageName: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stageText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  stageDuration: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  countdownIndicator: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },
  stageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  statusIcon: {
    marginLeft: 8,
  },
});

export default DetailsMode; 