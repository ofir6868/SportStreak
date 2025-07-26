import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useProgress } from './ProgressContext';

const navItems = [
  { label: 'Home', icon: <FontAwesome5 name="home" size={22} />, route: 'Home' },
  { label: 'Quests', icon: <MaterialCommunityIcons name="trophy" size={22} />, route: 'Quests' },
  { label: 'Workouts', icon: <MaterialCommunityIcons name="dumbbell" size={22} />, route: 'Workouts' },
  { label: 'Shop', icon: <Feather name="shopping-bag" size={22} />, route: 'Shop' },
  { label: 'Profile', icon: <FontAwesome5 name="user" size={22} />, route: 'Profile' },
];

const BottomNavBar = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { isDarkMode } = useProgress();

  // Dark mode colors
  const colors = {
    background: isDarkMode ? '#2a2a2a' : '#fff',
    border: isDarkMode ? '#404040' : '#E6F0FA',
    activeBackground: isDarkMode ? '#404040' : '#E6F0FA',
    inactiveIcon: isDarkMode ? '#888888' : '#B0B0B0',
    activeIcon: '#FF4B4B',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
      {navItems.map((item) => {
        const active = route.name === item.route;
        return (
          <TouchableOpacity
            key={item.label}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={[
              styles.iconCircle, 
              active && [styles.activeIconCircle, { backgroundColor: colors.activeBackground }]
            ]}>
              {React.cloneElement(item.icon, {
                color: active ? colors.activeIcon : colors.inactiveIcon,
                style: [styles.icon, active && styles.activeIcon],
              })}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    zIndex: 4,
    paddingBottom: 48
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
    // backgroundColor will be set dynamically
  },
  icon: {
    fontSize: 22,
  },
  activeIcon: {
    fontFamily: 'Nunito-Bold',
  },
});

export default BottomNavBar; 