import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = ({ navigation }: any) => {
  const handleGetStarted = async () => {
    await AsyncStorage.setItem('onboardingDone', 'true');
    navigation.replace('Signup');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🏆</Text>
      <Text style={styles.title}>Welcome to SportStreak!</Text>
      <Text style={styles.subtitle}>Your journey to a healthier, stronger you starts here.</Text>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}> 
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  logo: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1CB0F6',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen; 