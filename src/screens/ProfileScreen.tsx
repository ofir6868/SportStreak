import React, { useState } from 'react';
import { View, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import AppText from '../components/AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProgress } from '../components/ProgressContext';
import BottomNavBar from '../components/BottomNavBar';

type AvatarIcon = 'account-circle';

const ProfileScreen = () => {
  const { nickname, streak, totalWorkouts, diamonds, isDarkMode, toggleDarkMode } = useProgress();
  const [sound, setSound] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Dark mode colors
  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#fff',
    cardBackground: isDarkMode ? '#2a2a2a' : '#fff',
    text: isDarkMode ? '#ffffff' : '#222',
    textSecondary: isDarkMode ? '#cccccc' : '#888',
    primary: '#1CB0F6',
    accent: '#FFA800',
    border: isDarkMode ? '#404040' : '#e0e0e0',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={[styles.profileCard, { backgroundColor: colors.cardBackground, shadowColor: isDarkMode ? '#000' : '#000' }]}>
          <MaterialCommunityIcons name="account-circle" size={54} color={colors.primary} style={styles.avatar} />
          <AppText style={[styles.nickname, { color: colors.primary }]}>{nickname || 'User'}</AppText>
          <View style={styles.streakRow}>
            <MaterialCommunityIcons name="fire" size={20} color={colors.accent} />
            <AppText style={[styles.streakText, { color: colors.accent }]}>{streak} day streak</AppText>
          </View>
          <View style={styles.statsRow}>
            <AppText style={[styles.stat, { color: colors.textSecondary }]}>{totalWorkouts} Workouts</AppText>
            <View style={styles.diamondStat}>
              <MaterialCommunityIcons name="diamond" size={16} color={colors.primary} />
              <AppText style={[styles.stat, { color: colors.primary, marginLeft: 4 }]}>{diamonds}</AppText>
            </View>
          </View>
        </View>
        <View style={[styles.prefsCard, { backgroundColor: colors.cardBackground, shadowColor: isDarkMode ? '#000' : '#000' }]}>
          <AppText style={[styles.prefsTitle, { color: colors.text }]}>Preferences</AppText>
          <View style={styles.prefRow}>
            <AppText style={[styles.prefLabel, { color: colors.text }]}>Sound effects</AppText>
            <Switch 
              value={sound} 
              onValueChange={setSound} 
              trackColor={{ true: colors.primary, false: isDarkMode ? '#555' : '#ccc' }} 
              thumbColor={sound ? '#fff' : isDarkMode ? '#888' : '#eee'} 
            />
          </View>
          <View style={styles.prefRow}>
            <AppText style={[styles.prefLabel, { color: colors.text }]}>Notifications</AppText>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications} 
              trackColor={{ true: colors.primary, false: isDarkMode ? '#555' : '#ccc' }} 
              thumbColor={notifications ? '#fff' : isDarkMode ? '#888' : '#eee'} 
            />
          </View>
          <View style={styles.prefRow}>
            <AppText style={[styles.prefLabel, { color: colors.text }]}>Dark mode</AppText>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleDarkMode} 
              trackColor={{ true: colors.primary, false: isDarkMode ? '#555' : '#ccc' }} 
              thumbColor={isDarkMode ? '#fff' : isDarkMode ? '#888' : '#eee'} 
            />
          </View>
        </View>
        <TouchableOpacity style={[styles.editBtn, { backgroundColor: colors.primary }]}>
          <AppText style={styles.editBtnText}>Edit Profile</AppText>
        </TouchableOpacity>
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
    paddingTop: 32,
  },
  profileCard: {
    borderRadius: 18,
    alignItems: 'center',
    margin: 18,
    marginBottom: 10,
    padding: 22,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    marginBottom: 8,
  },
  nickname: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 2,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  streakText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
    alignItems: 'center',
  },
  stat: {
    fontSize: 14,
    marginHorizontal: 10,
  },
  diamondStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefsCard: {
    borderRadius: 18,
    marginHorizontal: 18,
    marginTop: 10,
    padding: 18,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  prefsTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    marginBottom: 10,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  prefLabel: {
    fontSize: 15,
  },
  editBtn: {
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
    alignItems: 'center',
    margin: 18,
    marginTop: 18,
  },
  editBtnText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
});

export default ProfileScreen; 