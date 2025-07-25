import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXERCISE_PRESETS, ExercisePresetKey } from '../config/exercisePresets';

const PresetSelectionScreen = ({ navigation }: any) => {
  const [selected, setSelected] = useState<ExercisePresetKey | null>(null);

  const handleContinue = async () => {
    if (!selected) return;
    await AsyncStorage.setItem('selectedPreset', selected);
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your exercise type</Text>
      <FlatList
        data={Object.entries(EXERCISE_PRESETS)}
        keyExtractor={([key]) => key}
        renderItem={({ item: [key, preset] }) => (
          <TouchableOpacity
            style={[styles.preset, selected === key && styles.selectedPreset]}
            onPress={() => setSelected(key as ExercisePresetKey)}
          >
            <Text style={styles.presetTitle}>{preset.label}</Text>
            <Text style={styles.presetDesc}>{preset.description}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={[styles.button, !selected && { opacity: 0.5 }]}
        onPress={handleContinue}
        disabled={!selected}
      >
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 50,
    paddingBottom: 50,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  preset: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  selectedPreset: {
    borderColor: '#1CB0F6',
    backgroundColor: '#E6F0FA',
  },
  presetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  presetDesc: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#1CB0F6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PresetSelectionScreen; 