import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import { useProgress } from '../components/ProgressContext';

const ExerciseCompletionScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { exercise, xp = 5, duration = '0:30', accuracy = '100%', shouldShowStreak = false, streak = 0 } = route.params || {};
  const { isDarkMode } = useProgress();

  // Dark mode colors
  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#fff',
    text: isDarkMode ? '#ffffff' : '#444',
    textSecondary: isDarkMode ? '#cccccc' : '#666',
    primary: '#1CB0F6',
    accent: '#FFA800',
    success: '#58CC02',
    border: isDarkMode ? '#404040' : '#e0e0e0',
    cardShadow: isDarkMode ? '#000' : '#000',
  };

  const handleContinue = () => {
    if (shouldShowStreak) {
      navigation.navigate('StreakCelebration', { streak });
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <AppText style={[styles.headerText, { color: colors.accent }]}>Exercise complete!</AppText>
        
        {/* Central Illustration */}
        <View style={styles.imageContainer}>
          <Image 
            source={isDarkMode ? require('../../assets/transparent_mascot.png') : require('../../assets/results.png')} 
            style={styles.celebrationImage} 
            contentFit="contain" 
          />
        </View>
        
        {/* Summary Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={[
            styles.statCard, 
            { 
              backgroundColor: colors.accent,
              shadowColor: colors.cardShadow,
            }
          ]}>
            <AppText style={styles.statTitle}>TOTAL XP</AppText>
            <View style={styles.statContent}>
              <MaterialCommunityIcons name="lightning-bolt" size={20} color="#fff" />
              <AppText style={styles.statValue}>{xp}</AppText>
            </View>
          </View>
          
          <View style={[
            styles.statCard, 
            { 
              backgroundColor: colors.primary,
              shadowColor: colors.cardShadow,
            }
          ]}>
            <AppText style={styles.statTitle}>DURATION</AppText>
            <View style={styles.statContent}>
              <MaterialCommunityIcons name="clock-check" size={20} color="#fff" />
              <AppText style={styles.statValue}>{duration}</AppText>
            </View>
          </View>
          
          <View style={[
            styles.statCard, 
            { 
              backgroundColor: colors.success,
              shadowColor: colors.cardShadow,
            }
          ]}>
            <AppText style={styles.statTitle}>PERFECT!</AppText>
            <View style={styles.statContent}>
              <MaterialCommunityIcons name="target" size={20} color="#fff" />
              <AppText style={styles.statValue}>{accuracy}</AppText>
            </View>
          </View>
        </View>
        
        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            { 
              backgroundColor: colors.primary,
              shadowColor: colors.cardShadow,
            }
          ]} 
          onPress={handleContinue}
        >
          <AppText style={styles.continueButtonText}>CONTINUE</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 32,
  },
  celebrationImage: {
    width: 200,
    height: 200,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statTitle: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginLeft: 4,
  },
  continueButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
});

export default ExerciseCompletionScreen; 