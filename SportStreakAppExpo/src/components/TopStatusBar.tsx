import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TopStatusBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.icon}>🔥</Text>
        <Text style={styles.value}>0</Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.icon, { color: '#1CB0F6' }]}>💎</Text>
        <Text style={styles.value}>500</Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.icon, { color: '#FF4B4B' }]}>❤️</Text>
        <Text style={styles.value}>5</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
    marginRight: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
});

export default TopStatusBar; 