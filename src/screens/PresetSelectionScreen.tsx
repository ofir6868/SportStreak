import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXERCISE_PRESETS, ExercisePresetKey } from '../config/exercisePresets';
import AppText from '../components/AppText';
import { useProgress } from '../components/ProgressContext';

const PresetSelectionScreen = ({ navigation }: { navigation: any }) => {
  const [selected, setSelected] = useState<ExercisePresetKey | null>(null);
  const { setPresetKey } = useProgress();

  const handleContinue = async () => {
    if (!selected) return;
    await AsyncStorage.setItem('selectedPreset', selected);
    setPresetKey(selected);
    navigation.replace('UserInfo');
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>Choose your exercise type</AppText>
      <FlatList
        data={Object.entries(EXERCISE_PRESETS)}
        keyExtractor={([key]) => key}
        renderItem={({ item: [key, preset] }) => (
          <TouchableOpacity
            style={[styles.preset, selected === key && styles.selectedPreset]}
            onPress={() => setSelected(key as ExercisePresetKey)}
          >
            <AppText style={styles.presetTitle}>{preset.label}</AppText>
            <AppText style={styles.presetDesc}>{preset.description}</AppText>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={[styles.button, !selected && { opacity: 0.5 }]}
        onPress={handleContinue}
        disabled={!selected}
      >
        <AppText style={styles.buttonText}>CONTINUE</AppText>
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
    fontFamily: 'Nunito-Bold',
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
    fontFamily: 'Nunito-Bold',
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
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
});

export default PresetSelectionScreen; 