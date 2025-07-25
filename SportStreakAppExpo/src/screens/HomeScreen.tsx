import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import TopStatusBar from '../components/TopStatusBar';
import LearningPath from '../components/LearningPath';
import BottomNavBar from '../components/BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const HomeScreen = ({ navigation }: any) => {
  const handleRestart = async () => {
    await AsyncStorage.clear();
    navigation.replace('Welcome');
    setTimeout(() => {
      // This will reload the JS bundle (works in dev)
      if (typeof window !== 'undefined' && window.location) {
        window.location.reload();
      }
    }, 500);
  };
  return (
    <View style={styles.container}>
      <View style={styles.stickyHeader}>
        <TopStatusBar />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 8, position:'absolute', right:0, top: 62   }}>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartText}>Restart</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LearningPath />
      </ScrollView>
      <View style={styles.stickyFooter}>
        <BottomNavBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stickyHeader: {
    zIndex: 10,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  stickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
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
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen; 