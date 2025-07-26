import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../components/AppText';

const StreakCelebrationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { streak } = route.params || { streak: 1 };

  return (
    <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
      <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Image source={require('../../assets/flame.gif')} style={{ width: 100, height: 100 }} contentFit="contain" />
      </View>
      <AppText style={{ fontSize: 32, fontFamily: 'Nunito-Bold', color: '#FFA500', marginBottom: 12, textAlign: 'center' }}>Streak Up!</AppText>
      <AppText style={{ fontSize: 20, color: '#444', marginBottom: 24, textAlign: 'center' }}>You're on a {streak}-day streak!</AppText>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <AppText style={styles.buttonText}>Keep it burning!</AppText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: '#1CB0F6',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
  },
});

export default StreakCelebrationScreen; 