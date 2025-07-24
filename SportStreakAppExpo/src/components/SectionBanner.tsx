import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const SectionBanner = () => {
  const handleMenuPress = () => {
    Alert.alert('Menu', 'Menu button pressed!');
  };
  return (
    <View style={styles.banner}>
      <View>
        <Text style={styles.section}>YOUR FITNESS JOURNEY</Text>
        <Text style={styles.title}>Keep your streak alive!</Text>
      </View>
      <TouchableOpacity onPress={handleMenuPress} activeOpacity={0.7}>
        <Text style={styles.listIcon}>≡</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#58CC02',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  section: {
    color: '#fff',
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listIcon: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});

export default SectionBanner; 