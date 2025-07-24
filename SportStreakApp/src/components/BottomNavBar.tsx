import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const navItems = [
  { label: 'Home', icon: '🏠', active: true },
  { label: 'Practice', icon: '🛡️' },
  { label: 'Leaderboard', icon: '🏆' },
  { label: 'Shop', icon: '🛍️' },
  { label: 'Profile', icon: '👤' },
];

const BottomNavBar = () => {
  return (
    <View style={styles.container}>
      {navItems.map((item, idx) => (
        <TouchableOpacity
          key={item.label}
          style={styles.tab}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, item.active && styles.activeIconCircle]}>
            <Text style={[styles.icon, item.active && styles.activeIcon]}>{item.icon}</Text>
          </View>
          {/* <Text style={[styles.label, item.active && styles.activeLabel]}>{item.label}</Text> */}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 4,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E6F0FA',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconCircle: {
    backgroundColor: '#E6F0FA',
  },
  icon: {
    fontSize: 22,
    color: '#B0B0B0',
  },
  activeIcon: {
    color: '#FF4B4B',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  activeLabel: {
    color: '#FF4B4B',
    fontWeight: 'bold',
  },
});

export default BottomNavBar; 