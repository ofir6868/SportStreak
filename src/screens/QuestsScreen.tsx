import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '../components/AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { useProgress } from '../components/ProgressContext';

const QuestsScreen = () => {
  const { 
    dailyQuests, 
    weeklyQuests, 
    completeQuest, 
    resetQuestsIfNeeded,
    diamonds 
  } = useProgress();

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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.header}>
          <View style={styles.mascotCircle}>
            <MaterialCommunityIcons name="trophy" size={38} color="#fff" />
          </View>
          <AppText style={styles.headerTitle}>Quests</AppText>
          <AppText style={styles.headerSubtitle}>Complete quests to earn rewards! Quests refresh every day.</AppText>
        </View>
        <View style={styles.sectionTitleRow}>
          <AppText style={styles.sectionTitle}>Daily Quests</AppText>
          <AppText style={styles.timer}>{getTimeUntilReset()}</AppText>
        </View>
        {dailyQuests.map(quest => (
          <TouchableOpacity 
            key={quest.id} 
            style={[
              styles.questCard,
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
                quest.completed && styles.completedQuestTitle
              ]}>
                {quest.title}
              </AppText>
              <AppText style={styles.questDescription}>{quest.description}</AppText>
              <View style={styles.progressBarBg}>
                <View style={[
                  styles.progressBarFill, 
                  { 
                    width: `${Math.min((quest.current / quest.target) * 100, 100)}%`,
                    backgroundColor: quest.completed ? "#4CAF50" : "#FFA800"
                  }
                ]} />
              </View>
              <AppText style={styles.progressText}>
                {quest.current} / {quest.target}
              </AppText>
            </View>
            <View style={[
              styles.rewardBadge,
              quest.completed && styles.completedRewardBadge
            ]}>
              <MaterialCommunityIcons name="diamond" size={16} color="#1CB0F6" />
              <AppText style={styles.rewardText}>{quest.reward}</AppText>
            </View>
          </TouchableOpacity>
        ))}
        <AppText style={styles.sectionTitle}>Weekly Quests</AppText>
        {weeklyQuests.map(quest => (
          <TouchableOpacity 
            key={quest.id} 
            style={[
              styles.questCard,
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
                quest.completed && styles.completedQuestTitle
              ]}>
                {quest.title}
              </AppText>
              <AppText style={styles.questDescription}>{quest.description}</AppText>
              <View style={styles.progressBarBg}>
                <View style={[
                  styles.progressBarFill, 
                  { 
                    width: `${Math.min((quest.current / quest.target) * 100, 100)}%`,
                    backgroundColor: quest.completed ? "#4CAF50" : "#1CB0F6"
                  }
                ]} />
              </View>
              <AppText style={styles.progressText}>
                {quest.current} / {quest.target}
              </AppText>
            </View>
            <View style={[
              styles.rewardBadge,
              quest.completed && styles.completedRewardBadge
            ]}>
              <MaterialCommunityIcons name="diamond" size={16} color="#1CB0F6" />
              <AppText style={styles.rewardText}>{quest.reward}</AppText>
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
    color: '#fff',
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
    color: '#222',
    marginTop: 10,
    marginBottom: 6,
    marginHorizontal: 18,
  },
  timer: {
    color: '#FFA800',
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    marginTop: 10,
  },
  questCard: {
    backgroundColor: '#fff',
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
    color: '#222',
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 4,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E6F0FA',
    borderRadius: 4,
    marginVertical: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#FFA800',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Nunito-Regular',
  },
  rewardBadge: {
    backgroundColor: '#E6F7FF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  rewardText: {
    color: '#1CB0F6',
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    marginLeft: 4,
  },
  completedQuestCard: {
    opacity: 0.7,
    backgroundColor: '#F8F9FA',
  },
  completedQuestTitle: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  questDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  completedRewardBadge: {
    backgroundColor: '#E8F5E8',
  },
});

export default QuestsScreen; 