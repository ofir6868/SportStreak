import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import AppText from '../components/AppText';
import { useProgress } from '../components/ProgressContext';

const NicknameScreen = ({ navigation }: { navigation: any }) => {
  const [nickname, setNicknameInput] = useState('');
  const [error, setError] = useState('');
  const { setNickname } = useProgress();

  const handleNext = () => {
    if (!nickname.trim()) {
      setError('Please enter a nickname.');
      return;
    }
    setNickname(nickname.trim());
    navigation.replace('PresetSelection');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <AppText style={styles.title}>Choose a nickname</AppText>
        <AppText style={styles.subtitle}>This will be used to greet you in the app</AppText>
        <TextInput
          style={styles.input}
          placeholder="Enter your nickname"
          value={nickname}
          onChangeText={setNicknameInput}
          autoCapitalize="words"
          maxLength={18}
          placeholderTextColor="#B0B0B0"
        />
        {error ? <AppText style={styles.error}>{error}</AppText> : null}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <AppText style={styles.buttonText}>Next</AppText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F9FB',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Nunito-Bold',
    color: '#1CB0F6',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6F0FA',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    backgroundColor: '#fff',
    color: '#222',
    width: 260,
    marginBottom: 10,
    textAlign: 'center',
  },
  error: {
    color: '#FF4B4B',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1CB0F6',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
  },
});

export default NicknameScreen; 