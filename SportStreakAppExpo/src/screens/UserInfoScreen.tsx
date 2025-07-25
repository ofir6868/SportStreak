import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import AppText from '../components/AppText';
import { Slider } from '@miblanchard/react-native-slider';

const fitnessLevels = ['Not active', 'Beginner', 'Intermediate', 'Advanced'];
const goals = ['Lose weight', 'Gain muscle', 'General strength', 'Flexibility', 'Other'];
const equipmentOptions = [
  { label: 'Dumbbells', key: 'dumbbells' },
  { label: 'Yoga Mat', key: 'yogaMat' },
  { label: 'TRX', key: 'trx' },
  { label: 'None', key: 'none' },
];

const UserInfoScreen = ({ navigation }: { navigation: any }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('other');
  const [fitnessLevel, setFitnessLevel] = useState('Not active');
  const [equipment, setEquipment] = useState<{ [key: string]: boolean }>({});
  const [goal, setGoal] = useState('Lose weight');
  const [days, setDays] = useState(3);

  const handleNext = () => {
    navigation.replace('Tutorial');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F8F9FB' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContainer}>
          <Image source={require('../../assets/mascot.png')} style={styles.mascot} />
          <AppText style={styles.title}>Tell us about yourself</AppText>
          <AppText style={styles.subtitle}>This helps us personalize your experience</AppText>

          <View style={styles.card}>
            <AppText style={styles.question}>How old are you?</AppText>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              placeholderTextColor="#B0B0B0"
            />
          </View>

          <View style={styles.card}>
            <AppText style={styles.question}>Gender</AppText>
            <View style={styles.optionsRow}>
              {['male', 'female', 'other'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.optionCard, gender === g && styles.optionCardActive]}
                  onPress={() => setGender(g)}
                  activeOpacity={0.8}
                >
                  <AppText style={gender === g ? styles.optionTextActive : styles.optionText}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <AppText style={styles.question}>Current fitness level</AppText>
            <View style={styles.optionsRow}>
              {fitnessLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[styles.optionCard, fitnessLevel === level && styles.optionCardActive]}
                  onPress={() => setFitnessLevel(level)}
                  activeOpacity={0.8}
                >
                  <AppText style={fitnessLevel === level ? styles.optionTextActive : styles.optionText}>{level}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <AppText style={styles.question}>Equipment at home</AppText>
            <View style={styles.optionsRow}>
              {equipmentOptions.map((eq) => (
                <TouchableOpacity
                  key={eq.key}
                  style={[styles.optionCard, equipment[eq.key] && styles.optionCardActive]}
                  onPress={() => setEquipment((prev) => ({ ...prev, [eq.key]: !prev[eq.key] }))}
                  activeOpacity={0.8}
                >
                  <AppText style={equipment[eq.key] ? styles.optionTextActive : styles.optionText}>{eq.label}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <AppText style={styles.question}>Main fitness goal</AppText>
            <View style={styles.optionsRow}>
              {goals.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.optionCard, goal === g && styles.optionCardActive]}
                  onPress={() => setGoal(g)}
                  activeOpacity={0.8}
                >
                  <AppText style={goal === g ? styles.optionTextActive : styles.optionText}>{g}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <AppText style={styles.question}>Workout days per week</AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Slider
                value={days}
                onValueChange={value => setDays(Array.isArray(value) ? value[0] : value)}
                minimumValue={1}
                maximumValue={7}
                step={1}
                containerStyle={{ flex: 1 }}
                thumbTintColor="#1CB0F6"
                minimumTrackTintColor="#1CB0F6"
                maximumTrackTintColor="#E6F0FA"
              />
              <AppText style={styles.sliderValue}>{days} days</AppText>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <AppText style={styles.buttonText}>Next</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skip} onPress={() => navigation.replace('Tutorial')}>
            <AppText style={styles.skipText}>Skip</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 0,
    backgroundColor: '#F8F9FB',
  },
  innerContainer: {
    marginHorizontal: 18,
    paddingBottom: 32,
  },
  mascot: {
    width: 72,
    height: 72,
    alignSelf: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Nunito-Bold',
    color: '#1CB0F6',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  question: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
    color: '#222',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6F0FA',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FB',
    color: '#222',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  optionCard: {
    backgroundColor: '#F8F9FB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6F0FA',
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    marginBottom: 10,
  },
  optionCardActive: {
    backgroundColor: '#1CB0F6',
    borderColor: '#1CB0F6',
  },
  optionText: {
    color: '#1CB0F6',
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
  },
  optionTextActive: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  sliderValue: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1CB0F6',
    fontFamily: 'Nunito-Bold',
    minWidth: 60,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#1CB0F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
    elevation: 1,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
  },
  skip: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  skipText: {
    color: '#1CB0F6',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default UserInfoScreen; 