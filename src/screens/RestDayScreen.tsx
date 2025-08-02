import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import AppText from '../components/AppText';
import { useProgress } from '../components/ProgressContext';

const RestDayScreen = () => {
  const navigation = useNavigation<any>();
  const { streak, acknowledgeRestDay, isDarkMode } = useProgress();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate in the content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const handleRestDayComplete = async () => {
    // Acknowledge the rest day and update streak
    const result = await acknowledgeRestDay();
    if (result.streaked) {
      // If streak was updated, show celebration
      navigation.navigate('StreakCelebration', { streak: result.newStreak });
    } else {
      // Otherwise just go back to home
      navigation.navigate('Home');
    }
  };

  // Dark mode colors
  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#fff',
    cardBackground: isDarkMode ? '#2a2a2a' : '#fff',
    text: isDarkMode ? '#ffffff' : '#222',
    textSecondary: isDarkMode ? '#cccccc' : '#666',
    primary: '#1CB0F6',
    accent: '#FFA800',
    restDay: '#4CAF50',
    border: isDarkMode ? '#404040' : '#e0e0e0',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* Rest Day Icon */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.restDay }]}>
            <AppText style={styles.iconText}>😴</AppText>
          </View>
        </View>

        {/* Main Title */}
        <AppText style={[styles.title, { color: colors.text }]}>
          Rest Day!
        </AppText>

        {/* Subtitle */}
        <AppText style={[styles.subtitle, { color: colors.textSecondary }]}>
          Acknowledge your rest day to extend your streak!
        </AppText>

        {/* Streak Info */}
        <View style={[styles.streakContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.streakRow}>
            <AppText style={styles.fireEmoji}>🔥</AppText>
            <AppText style={[styles.streakText, { color: colors.text }]}>
              {streak}-day streak
            </AppText>
          </View>
          <AppText style={[styles.streakDescription, { color: colors.textSecondary }]}>
            Rest days count towards your streak!
          </AppText>
        </View>

        {/* Rest Day Benefits */}
        <View style={[styles.benefitsContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <AppText style={[styles.benefitsTitle, { color: colors.text }]}>
            Why rest days matter:
          </AppText>
          <View style={styles.benefitItem}>
            <AppText style={styles.benefitIcon}>💪</AppText>
            <AppText style={[styles.benefitText, { color: colors.textSecondary }]}>
              Muscles grow stronger during recovery
            </AppText>
          </View>
          <View style={styles.benefitItem}>
            <AppText style={styles.benefitIcon}>⚡</AppText>
            <AppText style={[styles.benefitText, { color: colors.textSecondary }]}>
              Prevents burnout and injury
            </AppText>
          </View>
          <View style={styles.benefitItem}>
            <AppText style={styles.benefitIcon}>🎯</AppText>
            <AppText style={[styles.benefitText, { color: colors.textSecondary }]}>
              Come back stronger tomorrow
            </AppText>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.restDay }]} 
          onPress={handleRestDayComplete}
          activeOpacity={0.8}
        >
          <AppText style={styles.buttonText}>
            Extend My Streak
          </AppText>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconText: {
    fontSize: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
    marginBottom: 32,
    textAlign: 'center',
  },
  streakContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fireEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  streakText: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
  },
  streakDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },
  benefitsContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
    width: '100%',
  },
  benefitsTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    flex: 1,
  },
  button: {
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
  },

});

export default RestDayScreen; 