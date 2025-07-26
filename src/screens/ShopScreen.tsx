import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '../components/AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { useProgress } from '../components/ProgressContext';

type ShopIcon = 'snowflake' | 'star' | 'account-circle';

const items: { id: number; name: string; icon: ShopIcon; price: number }[] = [
  { id: 1, name: 'Streak Freeze', icon: 'snowflake', price: 50 },
  { id: 2, name: 'Bonus XP', icon: 'star', price: 30 },
  { id: 3, name: 'Custom Avatar', icon: 'account-circle', price: 100 },
];
const diamondBalance = 500;

const ShopScreen = () => {
  const { isDarkMode } = useProgress();

  // Dark mode colors
  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#fff',
    cardBackground: isDarkMode ? '#2a2a2a' : '#fff',
    text: isDarkMode ? '#ffffff' : '#222',
    textSecondary: isDarkMode ? '#cccccc' : '#888',
    primary: '#1CB0F6',
    accent: '#FFA800',
    border: isDarkMode ? '#404040' : '#e0e0e0',
    overlayBackground: isDarkMode ? 'rgba(26, 26, 26, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    overlayCard: isDarkMode ? 'rgba(42, 42, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.header}>
          <AppText style={[styles.headerTitle, { color: colors.primary }]}>Shop</AppText>
          <AppText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Spend your diamonds on rewards and boosts!</AppText>
        </View>
        <View style={[styles.balanceCard, { backgroundColor: colors.cardBackground, shadowColor: isDarkMode ? '#000' : '#000' }]}>
          <MaterialCommunityIcons name="diamond" size={28} color={colors.primary} style={{ marginRight: 8 }} />
          <AppText style={[styles.balanceText, { color: colors.primary }]}>{diamondBalance} Diamonds</AppText>
        </View>
        <AppText style={[styles.sectionTitle, { color: colors.text }]}>Shop Items</AppText>
        {items.map(item => (
          <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.cardBackground, shadowColor: isDarkMode ? '#000' : '#000' }]}>
            <View style={[styles.itemIconCircle, { backgroundColor: isDarkMode ? '#1a1a1a' : '#E6F7FF' }]}>
              <MaterialCommunityIcons name={item.icon} size={28} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={[styles.itemName, { color: colors.text }]}>{item.name}</AppText>
              <View style={styles.priceRow}>
                <MaterialCommunityIcons name="diamond" size={16} color={colors.primary} />
                <AppText style={[styles.priceText, { color: colors.primary }]}>{item.price}</AppText>
              </View>
            </View>
            <TouchableOpacity style={styles.buyBtn}>
              <AppText style={styles.buyBtnText}>Buy</AppText>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      {/* Coming Soon Watermark Overlay */}
      <View style={[styles.comingSoonOverlay, { backgroundColor: colors.overlayBackground }]}>
        <View style={[styles.comingSoonContainer, { backgroundColor: colors.overlayCard, borderColor: colors.primary }]}>
          <MaterialCommunityIcons name="clock-outline" size={48} color={colors.primary} />
          <AppText style={[styles.comingSoonTitle, { color: colors.primary }]}>Coming Soon</AppText>
          <AppText style={[styles.comingSoonSubtitle, { color: colors.textSecondary }]}>Shop features are under development</AppText>
        </View>
      </View>
      
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 0,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
  },
  balanceCard: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    margin: 18,
    marginBottom: 8,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  balanceText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 8,
  },
  itemCard: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 14,
    padding: 16,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  itemIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    marginLeft: 4,
  },
  buyBtn: {
    backgroundColor: '#FFA800',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginLeft: 10,
  },
  buyBtnText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
  },
  comingSoonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 80, // Leave space for bottom nav bar
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  comingSoonContainer: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 2,
  },
  comingSoonTitle: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  comingSoonSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ShopScreen; 