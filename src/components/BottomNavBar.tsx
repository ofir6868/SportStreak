import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const navItems = [
  { label: 'Home', icon: <FontAwesome5 name="home" size={22} />, active: true },
  { label: 'Practice', icon: <MaterialCommunityIcons name="dumbbell" size={22} />, active: false },
  { label: 'Leaderboard', icon: <FontAwesome5 name="trophy" size={22} />, active: false },
  { label: 'Shop', icon: <Feather name="shopping-bag" size={22} />, active: false },
  { label: 'Profile', icon: <FontAwesome5 name="user" size={22} />, active: false },
];

const BottomNavBar = () => {
  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={styles.tab}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, item.active && styles.activeIconCircle]}>
            {React.cloneElement(item.icon, {
              color: item.active ? '#FF4B4B' : '#B0B0B0',
              style: [styles.icon, item.active && styles.activeIcon],
            })}
          </View>
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
    marginBottom: 40
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
});

export default BottomNavBar; 