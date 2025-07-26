import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Image, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXERCISE_PRESETS, ExercisePresetKey } from '../config/exercisePresets';
import AppText from '../components/AppText';
import { useProgress } from '../components/ProgressContext';

const PresetSelectionScreen = ({ navigation }: { navigation: any }) => {
  const [selected, setSelected] = useState<ExercisePresetKey | null>(null);
  const { setPresetKey } = useProgress();
  
  // Animation values for each preset
  const animatedValues = useRef({
    running: new Animated.Value(0),
    strength: new Animated.Value(0),
    yoga: new Animated.Value(0),
  }).current;

  const getPresetIcon = (presetKey: ExercisePresetKey) => {
    switch (presetKey) {
      case 'running':
        return require('../../assets/running_mascot.png');
      case 'strength':
        return require('../../assets/strength_mascot.png');
      case 'yoga':
        return require('../../assets/yoga-mascot.png');
      default:
        return require('../../assets/mascot.png');
    }
  };

  const handlePresetSelect = (presetKey: ExercisePresetKey) => {
    setSelected(presetKey);
    
    // Reset all animations
    Object.values(animatedValues).forEach(value => value.setValue(0));
    
    // Animate the selected preset
    Animated.sequence([
      Animated.timing(animatedValues[presetKey], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[presetKey], {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = async () => {
    if (!selected) return;
    await AsyncStorage.setItem('selectedPreset', selected);
    setPresetKey(selected);
    navigation.replace('UserInfo');
  };

  const renderPreset = ({ item: [key, preset] }: { item: [string, any] }) => {
    const presetKey = key as ExercisePresetKey;
    const isSelected = selected === presetKey;
    const animatedValue = animatedValues[presetKey];

    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.02],
    });

    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.9],
    });

    const shadowOpacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, 0.3],
    });

    return (
      <Animated.View
        style={[
          styles.presetContainer,
          {
            transform: [{ scale }],
            opacity,
            shadowOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.preset, isSelected && styles.selectedPreset]}
          onPress={() => handlePresetSelect(presetKey)}
          activeOpacity={0.8}
        >
          <View style={styles.presetContent}>
            <View style={styles.iconContainer}>
              <Image 
                source={getPresetIcon(presetKey)} 
                style={styles.presetIcon}
                resizeMode="contain"
              />
              {isSelected && (
                <View style={styles.selectionGlow} />
              )}
            </View>
            <View style={styles.textContainer}>
              <AppText style={styles.presetTitle}>{preset.label}</AppText>
              <AppText style={styles.presetDesc}>{preset.description}</AppText>
            </View>
          </View>
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <AppText style={styles.checkmark}>✓</AppText>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>Choose your exercise type</AppText>
      <View style={styles.hintContainer}>
        <MaterialCommunityIcons name="information-outline" size={16} color="#888" />
        <AppText style={styles.hintText}>You can change this anytime from the top left icon on the home screen</AppText>
      </View>
      <FlatList
        data={Object.entries(EXERCISE_PRESETS)}
        keyExtractor={([key]) => key}
        renderItem={renderPreset}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
    color: '#1CB0F6',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  hintText: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Nunito-Regular',
    marginLeft: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
  listContent: {
    paddingBottom: 20,
    padding: 5,
  },
  presetContainer: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  preset: {
    borderWidth: 2,
    borderColor: '#E6F0FA',
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  selectedPreset: {
    borderColor: '#1CB0F6',
    backgroundColor: '#F8F9FB',
  },
  presetContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  presetIcon: {
    width: 50,
    height: 50,
  },
  selectionGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    backgroundColor: 'rgba(28, 176, 246, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(28, 176, 246, 0.3)',
  },
  textContainer: {
    flex: 1,
  },
  presetTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginBottom: 4,
    color: '#222',
  },
  presetDesc: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Nunito-Regular',
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1CB0F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },
  button: {
    backgroundColor: '#1CB0F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
});

export default PresetSelectionScreen; 