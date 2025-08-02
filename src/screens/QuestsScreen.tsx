import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '../components/AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { useProgress } from '../components/ProgressContext';
import { getTheme } from '../config/theme';

const QuestsScreen = () => {
  const { 
    dailyQuests, 
    weeklyQuests, 
    completeQuest, 
    resetQuestsIfNeeded,
    diamonds,
    isDarkMode
  } = useProgress();
  const theme = getTheme(isDarkMode);

  useEffect(() => {
    resetQuestsIfNeeded();
  }, []);



  const handleQuestPress = (quest: any) => {
    if (quest.current >= quest.target && !quest.completed) {
      completeQuest(quest.id);
    }
  };

  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.header}>
          <View style={styles.mascotCircle}>
            <MaterialCommunityIcons name="trophy" size={38} color="#fff" />
          </View>
          <AppText style={[styles.headerTitle, { color: theme.text }]}>Quests</AppText>
          <AppText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Complete quests to earn rewards! Quests refresh every day.</AppText>
        </View>
        <View style={styles.sectionTitleRow}>
          <AppText style={[styles.sectionTitle, { color: theme.text }]}>Daily Quests</AppText>
          <AppText style={[styles.timer, { color: theme.textSecondary }]}>{getTimeUntilReset()}</AppText>
        </View>
        {dailyQuests.map(quest => (
          <TouchableOpacity 
            key={quest.id} 
            style={[
              styles.questCard,
              { backgroundColor: theme.cardBackground },
              quest.completed && styles.completedQuestCard
            ]}
            onPress={() => handleQuestPress(quest)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name={quest.completed ? "check-circle" : "lightning-bolt"} 
              size={24} 
              color={quest.completed ? "#4CAF50" : "#FFA800"} 
              style={{ marginRight: 10 }} 
            />
            <View style={{ flex: 1 }}>
              <AppText style={[
                styles.questTitle,
                { color: theme.text },
                quest.completed && styles.completedQuestTitle
              ]}>
                {quest.title}
              </AppText>
              <AppText style={[styles.questDescription, { color: theme.textSecondary }]}>{quest.description}</AppText>
              <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                <View style={[
                  styles.progressBarFill, 
                  { 
                    width: `${Math.min((quest.current / quest.target) * 100, 100)}%`,
                    backgroundColor: quest.completed ? "#4CAF50" : "#FFA800"
                  }
                ]} />
              </View>
              <AppText style={[styles.progressText, { color: theme.textSecondary }]}>
                {quest.current} / {quest.target}
              </AppText>
            </View>
            <View style={[
              styles.rewardBadge,
              quest.completed && styles.completedRewardBadge
            ]}>
              <MaterialCommunityIcons name="diamond" size={16} color="#1CB0F6" />
              <AppText style={[styles.rewardText, { color: theme.text }]}>{quest.reward}</AppText>
            </View>
          </TouchableOpacity>
        ))}
        <AppText style={[styles.sectionTitle, { color: theme.text }]}>Weekly Quests</AppText>
        {weeklyQuests.map(quest => (
          <TouchableOpacity 
            key={quest.id} 
            style={[
              styles.questCard,
              { backgroundColor: theme.cardBackground },
              quest.completed && styles.completedQuestCard
            ]}
            onPress={() => handleQuestPress(quest)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name={quest.completed ? "check-circle" : "calendar-week"} 
              size={24} 
              color={quest.completed ? "#4CAF50" : "#1CB0F6"} 
              style={{ marginRight: 10 }} 
            />
            <View style={{ flex: 1 }}>
              <AppText style={[
                styles.questTitle,
                { color: theme.text },
                quest.completed && styles.completedQuestTitle
              ]}>
                {quest.title}
              </AppText>
              <AppText style={[styles.questDescription, { color: theme.textSecondary }]}>{quest.description}</AppText>
              <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                <View style={[
                  styles.progressBarFill, 
                  { 
                    width: `${Math.min((quest.current / quest.target) * 100, 100)}%`,
                    backgroundColor: quest.completed ? "#4CAF50" : "#1CB0F6"
                  }
                ]} />
              </View>
              <AppText style={[styles.progressText, { color: theme.textSecondary }]}>
                {quest.current} / {quest.target}
              </AppText>
            </View>
            <View style={[
              styles.rewardBadge,
              quest.completed && styles.completedRewardBadge
            ]}>
              <MaterialCommunityIcons name="diamond" size={16} color="#1CB0F6" />
              <AppText style={[styles.rewardText, { color: theme.text }]}>{quest.reward}</AppText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 0,
  },
  header: {
    backgroundColor: '#A084F9',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    marginBottom: 18,
  },
  mascotCircle: {
    backgroundColor: '#7C5CE0',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 0,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginTop: 10,
    marginBottom: 6,
    marginHorizontal: 18,
  },
  timer: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    marginTop: 10,
  },
  questCard: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  questTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 4,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    marginVertical: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
  },
  rewardBadge: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  rewardText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    marginLeft: 4,
  },
  completedQuestCard: {
    opacity: 0.7,
  },
  completedQuestTitle: {
    textDecorationLine: 'line-through',
  },
  questDescription: {
    fontSize: 13,
    marginBottom: 4,
  },
  completedRewardBadge: {
    backgroundColor: '#E8F5E8',
  },
});

export default QuestsScreen; 