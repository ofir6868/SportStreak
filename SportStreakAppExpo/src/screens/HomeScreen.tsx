import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import TopStatusBar from '../components/TopStatusBar';
import SectionBanner from '../components/SectionBanner';
import LearningPath from '../components/LearningPath';
import BottomNavBar from '../components/BottomNavBar';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.stickyHeader}>
        <TopStatusBar />
        <SectionBanner />
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
});

export default HomeScreen; 