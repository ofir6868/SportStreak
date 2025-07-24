import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SectionBanner = () => {
  return (
    <View style={styles.banner}>
      <View>
        <Text style={styles.section}>SECTION 1, UNIT 1</Text>
        <Text style={styles.title}>Form basic sentences</Text>
      </View>
      <Text style={styles.listIcon}>≡</Text>
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