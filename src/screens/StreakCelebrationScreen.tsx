import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation, useRoute } from '@react-navigation/native';

const StreakCelebrationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { streak } = route.params || { streak: 1 };

  return (
    <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }]}> 
      <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Image source={require('../../assets/flame.gif')} style={{ width: 100, height: 100 }} contentFit="contain" />
      </View>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FFA500', marginBottom: 12, textAlign: 'center' }}>Streak Up!</Text>
      <Text style={{ fontSize: 20, color: '#444', marginBottom: 24, textAlign: 'center' }}>You're on a {streak}-day streak!</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Keep it burning!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default StreakCelebrationScreen; 