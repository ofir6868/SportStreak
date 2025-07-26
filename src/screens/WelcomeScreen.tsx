import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppText from '../components/AppText';

const WelcomeScreen = ({ navigation }: { navigation: any }) => {
  const handleGetStarted = async () => {
    navigation.replace('PlanSelection');
  };

  return (
    <View style={styles.container}>
      {/* Mascot and app name at the top */}
      <View style={styles.header}>
        <Image source={require('../../assets/mascot.png')} style={styles.mascot} />
        <AppText style={[styles.appName, { fontFamily: 'Nunito-SemiBold' }]}>sportstreak</AppText>
      </View>
      {/* Central welcome image */}
      <Image source={require('../../assets/welcome.png')} style={styles.welcomeImage} />
      {/* Motivational pitch */}
      <AppText style={styles.pitch}>
        Build healthy habits, stay motivated, and crush your fitness goals — one streak at a time!
      </AppText>
      {/* Get Started button */}
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <AppText style={styles.buttonText}>Get Started</AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  mascot: {
    width: 44,
    height: 44,
    marginBottom: 2,
  },
  appName: {
    fontSize: 30,
    color: '#FF9200',
    letterSpacing: 1.5,
    textTransform: 'lowercase',
  },
  welcomeImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 18,
  },
  pitch: {
    fontSize: 20,
    color: '#222',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Nunito-SemiBold',
    lineHeight: 30,
  },
  button: {
    backgroundColor: '#1CB0F6',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
});

export default WelcomeScreen; 