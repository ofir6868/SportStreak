import React from 'react';
import { View, StyleSheet } from 'react-native';
import TopStatusBar from '../components/TopStatusBar';
import SectionBanner from '../components/SectionBanner';
import LearningPath from '../components/LearningPath';
import BottomNavBar from '../components/BottomNavBar';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <TopStatusBar />
      <SectionBanner />
      <LearningPath />
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomeScreen; 