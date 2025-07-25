import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExercisePresetKey } from '../config/exercisePresets';

const NUM_BUBBLES = 6;
const initialProgressArr = [false, false, false, false, false, false];

// Per-preset progress/completed
const initialProgress: Record<ExercisePresetKey, boolean[]> = {
  running: [...initialProgressArr],
  strength: [...initialProgressArr],
  yoga: [...initialProgressArr],
};
const initialCompleted: Record<ExercisePresetKey, boolean[]> = {
  running: [...initialProgressArr],
  strength: [...initialProgressArr],
  yoga: [...initialProgressArr],
};

const ProgressContext = createContext({
  progress: initialProgress['strength'],
  completed: initialCompleted['strength'],
  setProgress: (arr: boolean[]) => {},
  setCompleted: (arr: boolean[]) => {},
  presetKey: 'strength' as ExercisePresetKey,
  setPresetKey: (key: ExercisePresetKey) => {},
  markExerciseComplete: async (idx: number) => ({ streaked: false, newStreak: 0 }),
  streak: 0,
  streakUpdatedToday: false,
});

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [presetKey, setPresetKey] = useState<ExercisePresetKey>('strength');
  const [progressMap, setProgressMap] = useState(initialProgress);
  const [completedMap, setCompletedMap] = useState(initialCompleted);
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [streakUpdatedToday, setStreakUpdatedToday] = useState(false);

  const setProgress = (arr: boolean[]) => {
    setProgressMap((prev) => ({ ...prev, [presetKey]: arr }));
  };
  const setCompleted = (arr: boolean[]) => {
    setCompletedMap((prev) => ({ ...prev, [presetKey]: arr }));
  };

  const markExerciseComplete = async (idx: number): Promise<{ streaked: boolean, newStreak: number }> => {
    // Mark this exercise as completed
    const newCompleted = [...(completedMap[presetKey] || [])];
    newCompleted[idx] = true;
    setCompletedMap((prev) => ({ ...prev, [presetKey]: newCompleted }));

    // Unlock only the next one
    const newProgress = [...(progressMap[presetKey] || [])];
    if (idx + 1 < newProgress.length) newProgress[idx + 1] = true;
    setProgressMap((prev) => ({ ...prev, [presetKey]: newProgress }));

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
      return { streaked: true, newStreak };
    }
    return { streaked: false, newStreak: streak };
  };

  return (
    <ProgressContext.Provider
      value={{
        progress: progressMap[presetKey],
        completed: completedMap[presetKey],
        setProgress,
        setCompleted,
        presetKey,
        setPresetKey,
        markExerciseComplete,
        streak,
        streakUpdatedToday,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext); 