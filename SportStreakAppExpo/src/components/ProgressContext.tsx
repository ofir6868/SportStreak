import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NUM_BUBBLES = 6;
const initialProgress = [true, false, false, false, false, false];
const initialCompleted = [false, false, false, false, false, false];

const ProgressContext = createContext<any>(null);

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  // For manual testing, do not load/save progress/completed from AsyncStorage
  const [progress, setProgress] = useState<boolean[]>(initialProgress);
  const [completed, setCompleted] = useState<boolean[]>(initialCompleted);
  const [streak, setStreak] = useState<number>(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [streakUpdatedToday, setStreakUpdatedToday] = useState<boolean>(false);

  // useEffect(() => {
  //   (async () => {
  //     // Only load streak and lastCompletedDate from AsyncStorage
  //     const storedStreak = await AsyncStorage.getItem('exerciseStreak');
  //     const storedLastDate = await AsyncStorage.getItem('lastCompletedDate');
  //     if (storedStreak) setStreak(Number(storedStreak));
  //     if (storedLastDate) setLastCompletedDate(storedLastDate);
  //     // Check if streak was updated today
  //     const today = new Date().toISOString().slice(0, 10);
  //     setStreakUpdatedToday(storedLastDate === today);
  //   })();
  // }, []);

  const markExerciseComplete = async (idx: number): Promise<{ streaked: boolean, newStreak: number }> => {
    // Mark this exercise as completed
    const newCompleted = [...completed];
    newCompleted[idx] = true;
    setCompleted(newCompleted);
    // Unlock only the next one
    const newProgress = [...progress];
    if (idx + 1 < NUM_BUBBLES) newProgress[idx + 1] = true;
    setProgress(newProgress);
    // Streak logic (persisted)
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
      // await AsyncStorage.setItem('exerciseStreak', String(newStreak));
      // await AsyncStorage.setItem('lastCompletedDate', today);
      return { streaked: true, newStreak };
    }
    return { streaked: false, newStreak: streak };
  };

  return (
    <ProgressContext.Provider value={{ progress, completed, streak, streakUpdatedToday, markExerciseComplete }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext); 