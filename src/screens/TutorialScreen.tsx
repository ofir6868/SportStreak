import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '../components/AppText';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const TutorialScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Fire badge visual */}
      <View style={styles.visualBox}>
        <View style={styles.fireBadge}>
          <FontAwesome5 name="fire" size={48} color="#fff" />
        </View>
      </View>
      <AppText style={styles.title}>How <AppText style={styles.appName}>sportstreak</AppText> Works?</AppText>
      {/* Main flow as vertical progression */}
      <View style={styles.verticalFlowBox}>
        <View style={styles.verticalLine} />
        <View style={styles.flowStep}>
          <FontAwesome5 name="layer-group" size={24} color="#1CB0F6" style={styles.icon} />
          <AppText style={styles.featureText}>Progress level by level</AppText>
        </View>
        <View style={styles.flowStep}>
          <FontAwesome5 name="check-circle" size={24} color="#58CC02" style={styles.icon} />
          <AppText style={styles.featureText}>Complete your workouts</AppText>
        </View>
        <View style={styles.flowStep}>
          <FontAwesome5 name="fire" size={24} color="#FF9200" style={styles.icon} />
          <AppText style={styles.featureText}>Keep your streak alive</AppText>
        </View>
      </View>
      {/* Coming soon section */}
      {/* <AppText style={styles.comingSoonTitle}>Coming soon</AppText>
      <View style={styles.comingSoonBox}>
        <View style={styles.featureRow}>
          <MaterialCommunityIcons name="chart-line" size={24} color="#1CB0F6" style={styles.icon} />
          <AppText style={styles.featureText}>Advanced exercise review
            <View style={styles.badge}><AppText style={styles.badgeText}>Coming soon</AppText></View>
          </AppText>
        </View>
        <View style={styles.featureRow}>
          <MaterialCommunityIcons name="robot-outline" size={24} color="#FF9200" style={styles.icon} />
          <AppText style={styles.featureText}>Personalized GPT chat
            <View style={[styles.badge, styles.badgeBlue]}><AppText style={styles.badgeText}>Coming soon</AppText></View>
          </AppText> */}
        {/* </View> */}
      {/* </View> */}
      <View style={{ height: 32 }} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Home')}>
        <AppText style={styles.buttonText}>Got it – Let's go!</AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 30,
    fontFamily: 'Nunito-SemiBold',
    color: '#FF9200',
  },
  visualBox: {
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 12,
  },
  fireBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF9200',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF9200',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito-Regular',
    marginBottom: 18,
    textAlign: 'center',
  },
  verticalFlowBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
    position: 'relative',
    minHeight: 180,
    justifyContent: 'center',
  },
  verticalLine: {
    position: 'absolute',
    left: 32,
    top: 24,
    bottom: 24,
    width: 2,
    backgroundColor: '#CDE2F6',
    zIndex: 0,
  },
  flowStep: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 12,
    width: '90%',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    zIndex: 1,
  },
  icon: {
    marginRight: 16,
    width: 26,
    height: 26,
    alignSelf: 'center',
    zIndex: 2,
  },
  featureText: {
    fontSize: 17,
    color: '#222',
    flex: 1,
    fontFamily: 'Nunito-Regular',
  },
  comingSoonTitle: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Nunito-Bold',
    marginTop: 10,
    marginBottom: 6,
    alignSelf: 'flex-start',
    marginLeft: 12,
    letterSpacing: 1,
  },
  comingSoonBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#FF9200',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 1,
    marginLeft: 8,
    alignSelf: 'baseline',
    marginTop: 2,
  },
  badgeBlue: {
    backgroundColor: '#1CB0F6',
  },
  badgeText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 11,
  },
  button: {
    backgroundColor: '#1CB0F6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  }
});

export default TutorialScreen; 