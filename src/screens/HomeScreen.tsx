import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import TopStatusBar from '../components/TopStatusBar';
import PathsSlider from '../components/PathsSlider';
import LearningPath from '../components/LearningPath';
import BottomNavBar from '../components/BottomNavBar';
import SchedulePanel from '../components/SchedulePanel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AppText from '../components/AppText';
import { useProgress } from '../components/ProgressContext';


const HomeScreen = ({ navigation }: any) => {
  const { 
    forceResetQuests, 
    isDarkMode
  } = useProgress();
  const [isLearningPathVisible, setIsLearningPathVisible] = useState(true);
  const [schedulePanelVisible, setSchedulePanelVisible] = useState(false);
  
  useEffect(() => {
    console.log('HomeScreen: Component mounted');
    console.log('HomeScreen: Platform:', Platform.OS);
    
    // Check if LearningPath should be visible
    const checkLearningPathVisibility = () => {
      try {
        // Add a small delay to ensure everything is loaded
        setTimeout(() => {
          setIsLearningPathVisible(true);
          console.log('HomeScreen: LearningPath should be visible');
        }, 100);
      } catch (error) {
        console.error('HomeScreen: Error checking LearningPath visibility:', error);
      }
    };
    
    checkLearningPathVisibility();
  }, []);
  
  const handleRestart = async () => {
    // Force reset quests to clear cache
    forceResetQuests();
    
    await AsyncStorage.clear();
    navigation.replace('Welcome');
    setTimeout(() => {
      // This will reload the JS bundle (works in dev)
      if (typeof window !== 'undefined' && window.location) {
        window.location.reload();
      }
    }, 500);
  };

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
      <View style={[styles.stickyHeader, { backgroundColor: colors.background }]}>
        <TopStatusBar 
          onSchedulePress={() => setSchedulePanelVisible(true)}
          schedulePanelVisible={schedulePanelVisible}
        />
        <PathsSlider />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 8, position:'absolute', right:0, top: 630   }}>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <AppText style={styles.restartText}>Restart</AppText>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        // Add iOS-specific props
        bounces={Platform.OS === 'ios'}
        alwaysBounceVertical={Platform.OS === 'ios'}
        // Add error handling
        onScrollBeginDrag={() => console.log('HomeScreen: Scroll started')}
        onScrollEndDrag={() => console.log('HomeScreen: Scroll ended')}
      >
        {isLearningPathVisible && (
          <View style={styles.learningPathContainer}>
            <LearningPath />
          </View>
        )}
        {!isLearningPathVisible && (
          <View style={styles.fallbackContainer}>
            <AppText style={[styles.fallbackText, { color: colors.text }]}>
              Loading learning path...
            </AppText>
          </View>
        )}
      </ScrollView>
      <View style={[styles.stickyFooter, { backgroundColor: colors.background }]}>
        <BottomNavBar />
      </View>
      
      {/* Schedule Panel */}
      <SchedulePanel 
        isVisible={schedulePanelVisible}
        onClose={() => setSchedulePanelVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyHeader: {
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  learningPathContainer: {
    width: '100%',
    alignItems: 'center',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  fallbackText: {
    fontSize: 16,
    textAlign: 'center',
  },
  stickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  restartButton: {
    backgroundColor: '#FF4B4B',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginLeft: 8,
  },
  restartText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
});

export default HomeScreen; 