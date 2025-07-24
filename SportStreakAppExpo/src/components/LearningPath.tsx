import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';

const LearningPath = () => {
  const handleLockedPress = () => {
    Alert.alert('Locked', 'Complete previous lessons first');
  };
  const handleStartPress = () => {
    // Placeholder for lesson start
    Alert.alert('Start', 'Starting lesson...');
  };
  return (
    <View style={styles.container}>
      <View style={styles.path}>
        <TouchableOpacity style={styles.activeBubble} onPress={handleStartPress}>
          <Text style={styles.star}>★</Text>
        </TouchableOpacity>
        <View style={styles.startLabelBox}>
          <Text style={styles.startLabel}>START</Text>
        </View>
        <TouchableOpacity style={styles.lockedBubble} onPress={handleLockedPress}>
          <Text style={styles.lockedStar}>★</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lockedBubble} onPress={handleLockedPress}>
          <Text style={styles.lockedStar}>★</Text>
        </TouchableOpacity>
        <View style={styles.chestBox}>
          <TouchableOpacity style={styles.chest} onPress={handleLockedPress}>
            <Text style={styles.chestIcon}>🗝️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Image
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Duolingo_logo_mascot.png' }}
        style={styles.mascot}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  path: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeBubble: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#58CC02',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#58CC02',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  star: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  startLabelBox: {
    position: 'absolute',
    left: 80,
    top: 18,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  startLabel: {
    color: '#58CC02',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  lockedBubble: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    opacity: 0.5,
  },
  lockedStar: {
    color: '#B0B0B0',
    fontSize: 28,
    fontWeight: 'bold',
  },
  chestBox: {
    marginTop: 8,
  },
  chest: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  chestIcon: {
    fontSize: 28,
  },
  mascot: {
    width: 90,
    height: 90,
    marginLeft: 12,
  },
});

export default LearningPath; 