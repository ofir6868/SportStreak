export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  completedAt?: number;
}

export type QuestType = 
  | 'workout_count'
  | 'streak_days'
  | 'total_duration'
  | 'perfect_accuracy'
  | 'morning_workout'
  | 'evening_workout';

export interface QuestTypeConfig {
  type: QuestType;
  title: string;
  description: string;
  unit: string;
  dailyTargetRange: { min: number; max: number };
  weeklyTargetRange: { min: number; max: number };
}

export const QUEST_TYPES: QuestTypeConfig[] = [
  {
    type: 'workout_count',
    title: 'Workout Warrior',
    description: 'Complete workouts',
    unit: 'workouts',
    dailyTargetRange: { min: 2, max: 3 },
    weeklyTargetRange: { min: 5, max: 7 }
  },
  {
    type: 'streak_days',
    title: 'Streak Master',
    description: 'Maintain your streak',
    unit: 'days',
    dailyTargetRange: { min: 1, max: 1 },
    weeklyTargetRange: { min: 3, max: 5 }
  },
  {
    type: 'total_duration',
    title: 'Endurance Builder',
    description: 'Total workout time',
    unit: 'minutes',
    dailyTargetRange: { min: 10, max: 20 },
    weeklyTargetRange: { min: 60, max: 90 }
  },
  {
    type: 'perfect_accuracy',
    title: 'Perfect Form',
    description: 'Achieve perfect accuracy',
    unit: 'times',
    dailyTargetRange: { min: 1, max: 3 },
    weeklyTargetRange: { min: 3, max: 4 }
  },
  {
    type: 'morning_workout',
    title: 'Early Stefany',
    description: 'Complete morning workouts',
    unit: 'times',
    dailyTargetRange: { min: 1, max: 2 },
    weeklyTargetRange: { min: 3, max: 4 }
  },
  {
    type: 'evening_workout',
    title: 'Night Fox',
    description: 'Complete evening workouts',
    unit: 'times',
    dailyTargetRange: { min: 1, max: 2 },
    weeklyTargetRange: { min: 3, max: 4 }
  }
];

export const DAILY_QUESTS_COUNT = 3;
export const WEEKLY_QUESTS_COUNT = 2;

// Generic helper functions
export const getRandomReward = (): number => {
  const rewards = [10, 15, 20];
  return rewards[Math.floor(Math.random() * rewards.length)];
};

export const getRandomTarget = (range: { min: number; max: number }): number => {
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

export const generateQuests = (questTypes: QuestTypeConfig[], count: number, isWeekly: boolean = false): Quest[] => {
  const quests: Quest[] = [];
  const shuffledTypes = [...questTypes].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < count; i++) {
    const questType = shuffledTypes[i];
    const targetRange = isWeekly ? questType.weeklyTargetRange : questType.dailyTargetRange;
    const target = getRandomTarget(targetRange);
    const reward = isWeekly ? getRandomReward() * 2 : getRandomReward();
    
    quests.push({
      id: `${isWeekly ? 'weekly' : 'daily'}_${questType.type}_${Date.now()}_${i}`,
      type: questType.type,
      title: questType.title,
      description: `${questType.description} (${target} ${questType.unit})`,
      target,
      current: 0,
      reward,
      completed: false
    });
  }
  
  return quests;
};

export const generateDailyQuests = (): Quest[] => {
  return generateQuests(QUEST_TYPES, DAILY_QUESTS_COUNT, false);
};

export const generateWeeklyQuests = (): Quest[] => {
  return generateQuests(QUEST_TYPES, WEEKLY_QUESTS_COUNT, true);
}; 