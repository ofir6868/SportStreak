import { QuestType } from './questConfig';

export interface QuestTrackingRule {
  type: QuestType;
  trackingFunction: (params: QuestTrackingParams) => number;
  description: string;
}

export interface QuestTrackingParams {
  workoutCount?: number;
  streakDays?: number;
  totalDuration?: number;
  perfectAccuracy?: number;
  currentHour?: number;
  [key: string]: any;
}

export const QUEST_TRACKING_RULES: QuestTrackingRule[] = [
  {
    type: 'workout_count',
    trackingFunction: (params) => params.workoutCount || 0,
    description: 'Tracks completed workouts'
  },
  {
    type: 'streak_days',
    trackingFunction: (params) => params.streakDays || 0,
    description: 'Tracks current streak length'
  },
  {
    type: 'total_duration',
    trackingFunction: (params) => params.totalDuration || 0,
    description: 'Tracks total workout duration in minutes'
  },
  {
    type: 'perfect_accuracy',
    trackingFunction: (params) => params.perfectAccuracy || 0,
    description: 'Tracks perfect accuracy achievements'
  },
  {
    type: 'morning_workout',
    trackingFunction: (params) => {
      const hour = params.currentHour || new Date().getHours();
      return (hour >= 6 && hour < 12) ? 1 : 0;
    },
    description: 'Tracks morning workouts (6 AM - 12 PM)'
  },
  {
    type: 'evening_workout',
    trackingFunction: (params) => {
      const hour = params.currentHour || new Date().getHours();
      return (hour >= 18 && hour < 22) ? 1 : 0;
    },
    description: 'Tracks evening workouts (6 PM - 10 PM)'
  }
];

export const getTrackingRule = (type: QuestType): QuestTrackingRule | undefined => {
  return QUEST_TRACKING_RULES.find(rule => rule.type === type);
};

export const calculateQuestProgress = (type: QuestType, params: QuestTrackingParams): number => {
  const rule = getTrackingRule(type);
  return rule ? rule.trackingFunction(params) : 0;
}; 