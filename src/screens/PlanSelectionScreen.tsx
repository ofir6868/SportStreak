import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppText from '../components/AppText';

interface PlanFeature {
  name: string;
  free: boolean;
  virtualCoach: boolean;
  realCoach: boolean;
}

const planFeatures: PlanFeature[] = [
  { name: 'Basic workout routines', free: true, virtualCoach: true, realCoach: true },
  { name: 'Progress tracking', free: true, virtualCoach: true, realCoach: true },
  { name: 'Streak system', free: true, virtualCoach: true, realCoach: true },
  { name: 'Exercise library', free: true, virtualCoach: true, realCoach: true },
  { name: 'AI-powered workout plans', free: false, virtualCoach: true, realCoach: true },
  { name: 'Personalized form feedback', free: false, virtualCoach: true, realCoach: true },
  { name: 'Nutrition guidance', free: false, virtualCoach: true, realCoach: true },
  { name: 'Real-time coaching', free: false, virtualCoach: false, realCoach: true },
  { name: 'Video call sessions', free: false, virtualCoach: false, realCoach: true },
  { name: 'Custom meal plans', free: false, virtualCoach: false, realCoach: true },
  { name: 'Weekly check-ins', free: false, virtualCoach: false, realCoach: true },
];

const PlanSelectionScreen = ({ navigation }: { navigation: any }) => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'virtualCoach' | 'realCoach'>('free');

  const handleContinue = async () => {
    // Store the selected plan (could be used later for premium features)
    await AsyncStorage.setItem('selectedPlan', selectedPlan);
    await AsyncStorage.setItem('onboardingDone', 'true');
    navigation.replace('Nickname');
  };

  const renderFeatureRow = (feature: PlanFeature) => (
    <View key={feature.name} style={styles.featureRow}>
      <AppText style={styles.featureName}>{feature.name}</AppText>
      <View style={styles.featureChecks}>
        <View style={styles.checkContainer}>
          {feature.free ? (
            <AppText style={styles.checkmark}>✓</AppText>
          ) : (
            <AppText style={styles.xmark}>✗</AppText>
          )}
        </View>
        <View style={styles.checkContainer}>
          {feature.virtualCoach ? (
            <AppText style={styles.checkmark}>✓</AppText>
          ) : (
            <AppText style={styles.xmark}>✗</AppText>
          )}
        </View>
        <View style={styles.checkContainer}>
          {feature.realCoach ? (
            <AppText style={styles.checkmark}>✓</AppText>
          ) : (
            <AppText style={styles.xmark}>✗</AppText>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Image source={require('../../assets/mascot.png')} style={styles.mascot} />
        <AppText style={styles.title}>Choose Your Plan</AppText>
        <AppText style={styles.subtitle}>Start your fitness journey with the perfect plan for you</AppText>
      </View>

      <View style={styles.plansContainer}>
        {/* Free Plan */}
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'free' && styles.selectedPlan]}
          onPress={() => setSelectedPlan('free')}
          activeOpacity={0.8}
        >
          <View style={styles.planHeader}>
            <AppText style={styles.planTitle}>Free Plan</AppText>
            <AppText style={styles.planPrice}>$0/month</AppText>
          </View>
          <AppText style={styles.planDescription}>
            Perfect for getting started with your fitness journey
          </AppText>
          {selectedPlan === 'free' && <View style={styles.selectedIndicator} />}
        </TouchableOpacity>

        {/* Virtual Coach */}
        <TouchableOpacity
          style={[styles.planCard, styles.disabledPlan]}
          activeOpacity={0.8}
          disabled={true}
        >
          <View style={styles.planHeader}>
            <AppText style={styles.planTitle}>Virtual Coach</AppText>
            <AppText style={styles.planPrice}>$9.99/month</AppText>
            <View style={styles.comingSoonBadge}>
              <AppText style={styles.comingSoonText}>Coming Soon</AppText>
            </View>
          </View>
          <AppText style={styles.planDescription}>
            AI-powered personalized coaching and guidance
          </AppText>
        </TouchableOpacity>

        {/* Real Coach */}
        <TouchableOpacity
          style={[styles.planCard, styles.disabledPlan]}
          activeOpacity={0.8}
          disabled={true}
        >
          <View style={styles.planHeader}>
            <AppText style={styles.planTitle}>Real Coach</AppText>
            <AppText style={styles.planPrice}>$49.99/month</AppText>
            <View style={styles.comingSoonBadge}>
              <AppText style={styles.comingSoonText}>Coming Soon</AppText>
            </View>
          </View>
          <AppText style={styles.planDescription}>
            One-on-one coaching with certified personal trainers
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Feature Comparison */}
      <View style={styles.comparisonContainer}>
        <AppText style={styles.comparisonTitle}>Feature Comparison</AppText>
        
        {/* Header row with plan names */}
        <View style={styles.comparisonHeader}>
          <View style={styles.featureNameHeader} />
          <View style={styles.planHeaders}>
            <AppText style={styles.planHeaderText}>Free</AppText>
            <AppText style={styles.planHeaderText}>Virtual</AppText>
            <AppText style={styles.planHeaderText}>Real</AppText>
          </View>
        </View>

        {/* Feature rows */}
        {planFeatures.map(renderFeatureRow)}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <AppText style={styles.buttonText}>Continue with Free Plan</AppText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mascot: {
    width: 44,
    height: 44,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    color: '#1CB0F6',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
  },
  plansContainer: {
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E6F0FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPlan: {
    borderColor: '#1CB0F6',
    backgroundColor: '#F0F9FF',
  },
  disabledPlan: {
    opacity: 0.6,
    borderColor: '#E0E0E0',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  planTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#222',
  },
  planPrice: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#1CB0F6',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Nunito-Regular',
  },
  comingSoonBadge: {
    backgroundColor: '#FF9200',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Nunito-Bold',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1CB0F6',
  },
  comparisonContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comparisonTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 20,
  },
  comparisonHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12,
  },
  featureNameHeader: {
    flex: 2,
  },
  planHeaders: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  planHeaderText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#666',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  featureName: {
    flex: 2,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Nunito-Regular',
  },
  featureChecks: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  checkContainer: {
    width: 20,
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 16,
    color: '#4CAF50',
    fontFamily: 'Nunito-Bold',
  },
  xmark: {
    fontSize: 16,
    color: '#F44336',
    fontFamily: 'Nunito-Bold',
  },
  button: {
    backgroundColor: '#1CB0F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
});

export default PlanSelectionScreen; 