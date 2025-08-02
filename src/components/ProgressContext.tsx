import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExercisePresetKey, PathKey } from '../config/exercisePresets';
import { Quest, generateDailyQuests, generateWeeklyQuests } from '../config/questConfig';
import { calculateQuestProgress, QuestTrackingParams } from '../config/questTracking';

const NUM_BUBBLES = 6;
const initialProgressArr = [false, false, false, false, false, false];

// Per-path progress/completed tracking
const initialProgress: Record<PathKey, boolean[]> = {
  pushUpsPath: [...initialProgressArr],
  flexFlow: [...initialProgressArr],
  sprintBasics: [...initialProgressArr],
  cardioBlast: [...initialProgressArr],
  corePower: [...initialProgressArr],
  balanceFlow: [...initialProgressArr],
};
const initialCompleted: Record<PathKey, boolean[]> = {
  pushUpsPath: [...initialProgressArr],
  flexFlow: [...initialProgressArr],
  sprintBasics: [...initialProgressArr],
  cardioBlast: [...initialProgressArr],
  corePower: [...initialProgressArr],
  balanceFlow: [...initialProgressArr],
};

const ProgressContext = createContext({
  progress: initialProgress['pushUpsPath'],
  completed: initialCompleted['pushUpsPath'],
  setProgress: (arr: boolean[]) => {},
  setCompleted: (arr: boolean[]) => {},
  presetKey: 'strength' as ExercisePresetKey,
  setPresetKey: (key: ExercisePresetKey) => {},
  pathKey: 'pushUpsPath' as PathKey,
  setPathKey: (key: PathKey) => {},
  markExerciseComplete: async (idx: number, additionalParams?: QuestTrackingParams) => ({ streaked: false, newStreak: 0 }),
  acknowledgeRestDay: async () => ({ streaked: false, newStreak: 0 }),
  streak: 0,
  streakUpdatedToday: false,
  setStreakUpdatedToday: (updated: boolean) => {},
  nickname: '',
  setNickname: (name: string) => {},
  diamonds: 500,
  addDiamonds: (amount: number) => {},
  totalWorkouts: 0,
  incrementWorkouts: () => {},
  dailyQuests: [] as Quest[],
  weeklyQuests: [] as Quest[],
  updateQuestProgress: (type: string, amount: number) => {},
  updateQuestProgressWithParams: (params: QuestTrackingParams) => {},
  completeQuest: (questId: string) => {},
  lastQuestReset: '',
  resetQuestsIfNeeded: () => {},
  forceResetQuests: () => {},
  completedQuestToast: { visible: false, title: '', reward: 0 },
  hideQuestToast: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
  exerciseMode: 'details' as 'camera' | 'details',
  setExerciseMode: (mode: 'camera' | 'details') => {},
  // Schedule state
  workoutDaysPerWeek: 3,
  setWorkoutDaysPerWeek: (days: number) => {},
  selectedWorkoutDays: [] as number[],
  setSelectedWorkoutDays: (days: number[]) => {},
  // Workout session state
  workoutSessionState: null as any,
  setWorkoutSessionState: (state: any) => {},
  completeWorkoutSet: (exerciseIndex: number, duration: number) => {},
  isDataLoaded: false,
});

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [presetKey, setPresetKeyState] = useState<ExercisePresetKey>('strength');
  const [pathKey, setPathKeyState] = useState<PathKey>('pushUpsPath');
  const [progressMap, setProgressMap] = useState(initialProgress);
  const [completedMap, setCompletedMap] = useState(initialCompleted);
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [streakUpdatedToday, setStreakUpdatedToday] = useState(false);
  const [nickname, setNicknameState] = useState('');
  const [diamonds, setDiamonds] = useState(500);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [weeklyQuests, setWeeklyQuests] = useState<Quest[]>([]);
  const [lastQuestReset, setLastQuestReset] = useState('');
  const [completedQuestToast, setCompletedQuestToast] = useState({ visible: false, title: '', reward: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [exerciseMode, setExerciseModeState] = useState<'camera' | 'details'>('details');
  const [workoutDaysPerWeek, setWorkoutDaysPerWeekState] = useState(3);
  const [selectedWorkoutDays, setSelectedWorkoutDaysState] = useState<number[]>([]);
  const [workoutSessionState, setWorkoutSessionState] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Load data from AsyncStorage
    const loadData = async () => {
      try {
        console.log('ProgressContext: Starting data load...');
        
        const [name, preset, path, diamondsData, lastReset, dailyQuestsData, weeklyQuestsData, darkModeData, totalWorkoutsData, exerciseModeData, workoutDaysData, selectedDaysData] = await Promise.all([
          AsyncStorage.getItem('nickname'),
          AsyncStorage.getItem('selectedPreset'),
          AsyncStorage.getItem('selectedPath'),
          AsyncStorage.getItem('diamonds'),
          AsyncStorage.getItem('lastQuestReset'),
          AsyncStorage.getItem('dailyQuests'),
          AsyncStorage.getItem('weeklyQuests'),
          AsyncStorage.getItem('isDarkMode'),
          AsyncStorage.getItem('totalWorkouts'),
          AsyncStorage.getItem('exerciseMode'),
          AsyncStorage.getItem('workoutDaysPerWeek'),
          AsyncStorage.getItem('selectedWorkoutDays')
        ]);

        console.log('ProgressContext: Data loaded from AsyncStorage:', {
          name: !!name,
          preset,
          path,
          diamondsData,
          lastReset,
          dailyQuestsData: !!dailyQuestsData,
          weeklyQuestsData: !!weeklyQuestsData,
          darkModeData,
          totalWorkoutsData
        });

        if (name && !nickname) setNicknameState(name);
        if (preset && ['running', 'strength', 'yoga'].includes(preset)) {
          setPresetKeyState(preset as ExercisePresetKey);
        }
        if (path && ['pushUpsPath', 'flexFlow', 'sprintBasics', 'cardioBlast', 'corePower', 'balanceFlow'].includes(path)) {
          setPathKeyState(path as PathKey);
        }
        if (diamondsData) setDiamonds(parseInt(diamondsData));
        if (totalWorkoutsData) setTotalWorkouts(parseInt(totalWorkoutsData));
        if (lastReset) setLastQuestReset(lastReset);
        if (darkModeData) setIsDarkMode(JSON.parse(darkModeData));
        if (exerciseModeData && ['camera', 'details'].includes(exerciseModeData)) {
          setExerciseModeState(exerciseModeData as 'camera' | 'details');
        }
        if (workoutDaysData) setWorkoutDaysPerWeekState(parseInt(workoutDaysData));
        if (selectedDaysData) setSelectedWorkoutDaysState(JSON.parse(selectedDaysData));
        
        // Initialize quests if they don't exist or if it's a new day
        const today = new Date().toISOString().slice(0, 10);
        if (!dailyQuestsData || !weeklyQuestsData || lastReset !== today) {
          const newDailyQuests = generateDailyQuests();
          const newWeeklyQuests = generateWeeklyQuests();
          setDailyQuests(newDailyQuests);
          setWeeklyQuests(newWeeklyQuests);
          setLastQuestReset(today);
          AsyncStorage.setItem('dailyQuests', JSON.stringify(newDailyQuests));
          AsyncStorage.setItem('weeklyQuests', JSON.stringify(newWeeklyQuests));
          AsyncStorage.setItem('lastQuestReset', today);
        } else {
          if (dailyQuestsData) {
            const parsedDaily = JSON.parse(dailyQuestsData);
            // Ensure completed quests have current = target
            const fixedDaily = parsedDaily.map((quest: any) => {
              if (quest.completed && quest.current !== quest.target) {
                return { ...quest, current: quest.target };
              }
              return quest;
            });
            setDailyQuests(fixedDaily);
          }
          if (weeklyQuestsData) {
            const parsedWeekly = JSON.parse(weeklyQuestsData);
            // Ensure completed quests have current = target
            const fixedWeekly = parsedWeekly.map((quest: any) => {
              if (quest.completed && quest.current !== quest.target) {
                return { ...quest, current: quest.target };
              }
              return quest;
            });
            setWeeklyQuests(fixedWeekly);
          }
        }
        
        // Mark data as loaded
        setIsDataLoaded(true);
        
      } catch (error) {
        // Set default values on error
        setPresetKeyState('strength');
        setPathKeyState('pushUpsPath');
        setDiamonds(500);
        setTotalWorkouts(0);
        setLastQuestReset(new Date().toISOString().slice(0, 10));
        setIsDarkMode(false);
        
        // Generate default quests
        const newDailyQuests = generateDailyQuests();
        const newWeeklyQuests = generateWeeklyQuests();
        setDailyQuests(newDailyQuests);
        setWeeklyQuests(newWeeklyQuests);
        
        // Mark data as loaded even on error
        setIsDataLoaded(true);
      }
    };
    
    loadData();
  }, []);

  const setNickname = (name: string) => {
    setNicknameState(name);
    AsyncStorage.setItem('nickname', name);
  };

  const setProgress = (arr: boolean[]) => {
    setProgressMap((prev) => ({ ...prev, [pathKey]: arr }));
  };
  const setCompleted = (arr: boolean[]) => {
    setCompletedMap((prev) => ({ ...prev, [pathKey]: arr }));
  };

  const setPresetKey = (key: ExercisePresetKey) => {
    setPresetKeyState(key);
    AsyncStorage.setItem('selectedPreset', key);
  };

  const setPathKey = (key: PathKey) => {
    setPathKeyState(key);
    AsyncStorage.setItem('selectedPath', key);
  };

  const addDiamonds = (amount: number) => {
    setDiamonds(prev => prev + amount);
    AsyncStorage.setItem('diamonds', (diamonds + amount).toString());
  };

  const incrementWorkouts = () => {
    setTotalWorkouts(prev => prev + 1);
    AsyncStorage.setItem('totalWorkouts', (totalWorkouts + 1).toString());
  };

  const updateQuestProgress = (type: string, amount: number) => {
    const updateQuests = (quests: Quest[]) => 
      quests.map(quest => 
        quest.type === type && !quest.completed 
          ? { ...quest, current: Math.min(quest.current + amount, quest.target) }
          : quest
      );
    
    setDailyQuests(updateQuests);
    setWeeklyQuests(updateQuests);
  };

  const updateQuestProgressWithParams = (params: QuestTrackingParams) => {
    const updateQuests = (quests: Quest[]) => 
      quests.map(quest => {
        // Don't update if already completed
        if (quest.completed) {
          return quest;
        }
        
        let increment = 0;
        
        // Calculate increment based on quest type
        switch (quest.type) {
          case 'workout_count':
            increment = params.workoutCount || 0;
            break;
          case 'streak_days':
            increment = params.streakDays || 0;
            break;
          case 'total_duration':
            increment = params.totalDuration || 0;
            break;
          case 'perfect_accuracy':
            increment = params.perfectAccuracy || 0;
            break;
          case 'morning_workout':
            increment = params.currentHour && params.currentHour >= 6 && params.currentHour < 12 ? 1 : 0;
            break;
          case 'evening_workout':
            increment = params.currentHour && params.currentHour >= 18 && params.currentHour < 22 ? 1 : 0;
            break;
        }
        
        // Skip if no increment for this quest type
        if (increment === 0) {
          return quest;
        }
        
        const newCurrent = Math.min(quest.current + increment, quest.target);
        const newlyCompleted = !quest.completed && newCurrent >= quest.target;
        
        if (newlyCompleted) {
          // Show toast for newly completed quest
          setCompletedQuestToast({
            visible: true,
            title: quest.title,
            reward: quest.reward
          });
          
          // Auto-complete the quest and add diamonds
          addDiamonds(quest.reward);
          return { ...quest, current: quest.target, completed: true, completedAt: Date.now() };
        }
        
        return { ...quest, current: newCurrent };
      });
    
    // Use functional state updates to ensure we're working with the latest state
    setDailyQuests(prevDailyQuests => {
      const updatedDaily = updateQuests(prevDailyQuests);
      // Save to AsyncStorage
      AsyncStorage.setItem('dailyQuests', JSON.stringify(updatedDaily));
      return updatedDaily;
    });
    
    setWeeklyQuests(prevWeeklyQuests => {
      const updatedWeekly = updateQuests(prevWeeklyQuests);
      // Save to AsyncStorage
      AsyncStorage.setItem('weeklyQuests', JSON.stringify(updatedWeekly));
      return updatedWeekly;
    });
  };

  const completeQuest = (questId: string) => {
    let reward = 0;
    
    // Update daily quests
    const updatedDaily = dailyQuests.map(quest => {
      if (quest.id === questId && !quest.completed && quest.current >= quest.target) {
        reward = quest.reward;
        return { ...quest, current: quest.target, completed: true, completedAt: Date.now() };
      }
      return quest;
    });
    
    // Update weekly quests
    const updatedWeekly = weeklyQuests.map(quest => {
      if (quest.id === questId && !quest.completed && quest.current >= quest.target) {
        reward = quest.reward;
        return { ...quest, current: quest.target, completed: true, completedAt: Date.now() };
      }
      return quest;
    });
    
    setDailyQuests(updatedDaily);
    setWeeklyQuests(updatedWeekly);
    
    // Save to AsyncStorage
    AsyncStorage.setItem('dailyQuests', JSON.stringify(updatedDaily));
    AsyncStorage.setItem('weeklyQuests', JSON.stringify(updatedWeekly));
    
    if (reward > 0) {
      addDiamonds(reward);
    }
  };

  const resetQuestsIfNeeded = () => {
    const today = new Date().toISOString().slice(0, 10);
    if (lastQuestReset !== today) {
      const newDailyQuests = generateDailyQuests();
      const newWeeklyQuests = generateWeeklyQuests();
      
      setDailyQuests(newDailyQuests);
      setWeeklyQuests(newWeeklyQuests);
      setLastQuestReset(today);
      
      AsyncStorage.setItem('lastQuestReset', today);
      AsyncStorage.setItem('dailyQuests', JSON.stringify(newDailyQuests));
      AsyncStorage.setItem('weeklyQuests', JSON.stringify(newWeeklyQuests));
    }
  };

  const hideQuestToast = () => {
    setCompletedQuestToast({ visible: false, title: '', reward: 0 });
  };

  const forceResetQuests = () => {
    const newDailyQuests = generateDailyQuests();
    const newWeeklyQuests = generateWeeklyQuests();
    
    setDailyQuests(newDailyQuests);
    setWeeklyQuests(newWeeklyQuests);
    setLastQuestReset(new Date().toISOString().slice(0, 10));
    
    AsyncStorage.setItem('dailyQuests', JSON.stringify(newDailyQuests));
    AsyncStorage.setItem('weeklyQuests', JSON.stringify(newWeeklyQuests));
    AsyncStorage.setItem('lastQuestReset', new Date().toISOString().slice(0, 10));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    AsyncStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
  };

  const setExerciseMode = (mode: 'camera' | 'details') => {
    setExerciseModeState(mode);
    AsyncStorage.setItem('exerciseMode', mode);
  };

  const setWorkoutDaysPerWeek = (days: number) => {
    setWorkoutDaysPerWeekState(days);
    AsyncStorage.setItem('workoutDaysPerWeek', days.toString());
  };

  const setSelectedWorkoutDays = (days: number[]) => {
    setSelectedWorkoutDaysState(days);
    AsyncStorage.setItem('selectedWorkoutDays', JSON.stringify(days));
  };

  const completeWorkoutSet = (exerciseIndex: number, duration: number) => {
    if (workoutSessionState) {
      workoutSessionState.completeSet(exerciseIndex, duration);
    }
  };

  const acknowledgeRestDay = async () => {
    const today = new Date().toISOString().slice(0, 10);
    if (lastCompletedDate !== today) {
      // If last completed was yesterday, increment streak, else reset to 1
      let newStreak = 1;
      if (lastCompletedDate) {
        const last = new Date(lastCompletedDate);
        const diff = (new Date(today).getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) newStreak = streak + 1;
      }
      setStreak(newStreak);
      setLastCompletedDate(today);
      setStreakUpdatedToday(true);
      
      // Update streak quest progress
      updateQuestProgressWithParams({ streakDays: 1 });
      
      return { streaked: true, newStreak };
    }
    return { streaked: false, newStreak: streak };
  };


  const markExerciseComplete = async (idx: number, additionalParams?: QuestTrackingParams): Promise<{ streaked: boolean, newStreak: number }> => {
    // Mark this exercise as completed
    const newCompleted = [...(completedMap[pathKey] || [])];
    newCompleted[idx] = true;
    setCompletedMap((prev) => ({ ...prev, [pathKey]: newCompleted }));

    // Unlock only the next one
    const newProgress = [...(progressMap[pathKey] || [])];
    if (idx + 1 < newProgress.length) newProgress[idx + 1] = true;
    setProgressMap((prev) => ({ ...prev, [pathKey]: newProgress }));

    // Increment total workouts
    incrementWorkouts();

    // Update quest progress using generic tracking - combine all parameters
    const trackingParams: QuestTrackingParams = {
      workoutCount: 1,
      currentHour: new Date().getHours(),
      ...additionalParams
    };
    updateQuestProgressWithParams(trackingParams);

    // Streak logic
    const today = new Date().toISOString().slice(0, 10);
    if (lastCompletedDate !== today) {
      // If last completed was yesterday, increment streak, else reset to 1
      let newStreak = 1;
      if (lastCompletedDate) {
        const last = new Date(lastCompletedDate);
        const diff = (new Date(today).getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) newStreak = streak + 1;
      }
      setStreak(newStreak);
      setLastCompletedDate(today);
      setStreakUpdatedToday(true);
      
      // Update streak quest progress
      updateQuestProgressWithParams({ streakDays: 1 });
      
      return { streaked: true, newStreak };
    }
    return { streaked: false, newStreak: streak };
  };

  return (
    <ProgressContext.Provider
      value={{
        progress: progressMap[pathKey],
        completed: completedMap[pathKey],
        setProgress,
        setCompleted,
        presetKey,
        setPresetKey,
        pathKey,
        setPathKey,
        markExerciseComplete,
        acknowledgeRestDay,
        streak,
        streakUpdatedToday,
        setStreakUpdatedToday,
        nickname,
        setNickname,
        diamonds,
        addDiamonds,
        totalWorkouts,
        incrementWorkouts,
        dailyQuests,
        weeklyQuests,
        updateQuestProgress,
        updateQuestProgressWithParams,
        completeQuest,
        lastQuestReset,
        resetQuestsIfNeeded,
        forceResetQuests,
        completedQuestToast,
        hideQuestToast,
        isDarkMode,
        toggleDarkMode,
        exerciseMode,
        setExerciseMode,
        workoutDaysPerWeek,
        setWorkoutDaysPerWeek,
        selectedWorkoutDays,
        setSelectedWorkoutDays,
        workoutSessionState,
        setWorkoutSessionState,
        completeWorkoutSet,
        isDataLoaded,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext); 