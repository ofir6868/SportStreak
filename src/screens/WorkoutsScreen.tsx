import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '../components/AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import { WORKOUT_CONFIGS } from '../config/workoutConfig';

const filters = ['All', 'Strength', 'Cardio', 'Yoga'];

const WorkoutsScreen = () => {
  const [selected, setSelected] = useState('All');
  const navigation = useNavigation<any>();
  
  const handleStartWorkout = (workoutId: string) => {
    navigation.navigate('WorkoutSession', { workoutId });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>Workouts</AppText>
        <AppText style={styles.headerSubtitle}>Choose your workout and start training!</AppText>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={{ paddingHorizontal: 12 }}>
        {filters.map(f => (
          <TouchableOpacity key={f} style={[styles.filterBtn, selected === f && styles.filterBtnActive]} onPress={() => setSelected(f)}>
            <AppText style={[styles.filterText, selected === f && styles.filterTextActive]}>{f}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.grid}>
          {WORKOUT_CONFIGS.filter(w => selected === 'All' || w.type === selected).map(w => (
            <View key={w.id} style={styles.card}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name={w.icon} size={32} color="#1CB0F6" />
              </View>
              <AppText style={styles.workoutName}>{w.name}</AppText>
              <AppText style={styles.difficulty}>{w.difficulty}</AppText>
              <TouchableOpacity 
                style={styles.startBtn}
                onPress={() => handleStartWorkout(w.id)}
              >
                <AppText style={styles.startBtnText}>Start</AppText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#1CB0F6',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Nunito-Regular',
  },
  filterBar: {
    marginBottom: 8,
    maxHeight: 44,
  },
  scrollView: {
    flex: 1,
  },
  filterBtn: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E6F0FA',
  },
  filterBtnActive: {
    backgroundColor: '#1CB0F6',
    borderColor: '#1CB0F6',
  },
  filterText: {
    color: '#1CB0F6',
    fontFamily: 'Nunito-Regular',
    fontSize: 15,
  },
  filterTextActive: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    width: 160,
    margin: 10,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconCircle: {
    backgroundColor: '#E6F7FF',
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  difficulty: {
    color: '#888',
    fontSize: 14,
    marginBottom: 10,
  },
  startBtn: {
    backgroundColor: '#FFA800',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginTop: 4,
  },
  startBtnText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
  },
});

export default WorkoutsScreen; 