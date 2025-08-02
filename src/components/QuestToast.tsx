import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppText from './AppText';
import { useProgress } from './ProgressContext';
import { getTheme } from '../config/theme';

interface QuestToastProps {
  visible: boolean;
  questTitle: string;
  reward: number;
  onHide: () => void;
}

const QuestToast: React.FC<QuestToastProps> = ({ visible, questTitle, reward, onHide }) => {
  const { isDarkMode } = useProgress();
  const theme = getTheme(isDarkMode);
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show toast
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Hide after 3 seconds
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.content, { backgroundColor: theme.cardBackground }]}>
        <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />
        <View style={styles.textContainer}>
          <AppText style={[styles.title, { color: theme.text }]}>Quest Completed!</AppText>
          <AppText style={[styles.questTitle, { color: theme.textSecondary }]}>{questTitle}</AppText>
        </View>
        <View style={[styles.rewardContainer, { backgroundColor: theme.border }]}>
          <MaterialCommunityIcons name="diamond" size={20} color="#1CB0F6" />
          <AppText style={[styles.rewardText, { color: theme.text }]}>+{reward}</AppText>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  content: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  questTitle: {
    fontSize: 14,
    marginTop: 2,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    marginLeft: 4,
  },
});

export default QuestToast; 