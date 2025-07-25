import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { useProgress } from './ProgressContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EXERCISE_PRESETS, ExercisePresetKey } from '../config/exercisePresets';

const presetIcons = {
  strength: 'dumbbell',
  running: 'run',
  yoga: 'yoga',
};

const FloatingPresetSelector = () => {
  const { presetKey, setPresetKey } = useProgress();
  const [open, setOpen] = useState(false);
  const presetKeys: ExercisePresetKey[] = ['strength', 'running', 'yoga'];

  return (
    <View style={styles.floatingContainer} pointerEvents="box-none">
      <Animated.View style={[styles.selector, open && styles.selectorOpen]}>
        {!open ? (
          <TouchableOpacity style={styles.iconButton} onPress={() => setOpen(true)}>
            <MaterialCommunityIcons name={presetIcons[presetKey] as any} size={32} color="#58CC02" />
          </TouchableOpacity>
        ) : (
          <View style={styles.row}>
            {presetKeys.map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.presetButton, presetKey === key && styles.presetButtonActive]}
                onPress={() => {
                  setPresetKey(key);
                  setOpen(false);
                }}
              >
                <MaterialCommunityIcons name={presetIcons[key] as any} size={28} color={presetKey === key ? '#58CC02' : '#888'} />
                <Text style={[styles.presetText, presetKey === key && styles.presetTextActive]}>{EXERCISE_PRESETS[key].label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 80,
    alignItems: 'center',
    zIndex: 200,
    pointerEvents: 'box-none',
  },
  selector: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 6,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  selectorOpen: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    minWidth: 180,
    minHeight: 56,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#E6F0FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  presetButtonActive: {
    backgroundColor: '#E6F0FA',
  },
  presetText: {
    marginLeft: 6,
    color: '#888',
    fontWeight: 'bold',
    fontSize: 15,
  },
  presetTextActive: {
    color: '#58CC02',
  },
});

export default FloatingPresetSelector; 