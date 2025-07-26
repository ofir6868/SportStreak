import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useProgress } from './ProgressContext';
import { EXERCISE_PRESETS, ExercisePresetKey } from '../config/exercisePresets';
import AppText from './AppText';

const SectionBanner = () => {
  const { presetKey, setPresetKey } = useProgress();
  const [menuVisible, setMenuVisible] = useState(false);
  const presetKeys: ExercisePresetKey[] = ['running', 'strength', 'yoga'];

  const handleSelect = (key: ExercisePresetKey) => {
    setPresetKey(key);
    setMenuVisible(false);
  };

  const handleAddCustom = () => {
    setMenuVisible(false);
    // TODO: Implement custom preset creation flow
    alert('Add Custom Preset (not implemented)');
  };

  return (
    <View style={styles.banner}>
      <View>
        <AppText style={styles.section}>{EXERCISE_PRESETS[presetKey].label} Path</AppText>
        <AppText style={styles.title}>Keep your streak alive!</AppText>
      </View>
      <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton} activeOpacity={0.7}>
        <AppText style={styles.menuIcon}>≡</AppText>
      </TouchableOpacity>
      {menuVisible && (
        <>
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setMenuVisible(false)} />
          <View style={styles.dropdownMenu}>
            {presetKeys.map((key) => (
              <TouchableOpacity key={key} style={styles.menuItem} onPress={() => handleSelect(key)}>
                <AppText style={[styles.menuItemText, presetKey === key && styles.menuItemTextActive]}>
                  {EXERCISE_PRESETS[key].label}
                </AppText>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addCustomButton} onPress={handleAddCustom}>
              <AppText style={styles.addCustomText}>+ Add Custom Preset</AppText>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    position: 'relative',
  },
  section: {
    color: '#fff',
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: 'Nunito-SemiBold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  menuButton: {
    padding: 8,
    marginLeft: 16,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Nunito-Bold',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 56,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 0,
    minWidth: 170,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  menuItemText: {
    fontSize: 16,
    color: '#222',
  },
  menuItemTextActive: {
    color: '#58CC02',
    fontFamily: 'Nunito-Bold',
  },
  addCustomButton: {
    marginTop: 4,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#E6F0FA',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  addCustomText: {
    color: '#1CB0F6',
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.01)',
    zIndex: 99,
  },
});

export default SectionBanner; 