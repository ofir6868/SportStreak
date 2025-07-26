import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppText from './AppText';
import { useProgress } from './ProgressContext';
import { useNavigation } from '@react-navigation/native';
import { EXERCISE_PRESETS, ExercisePresetKey } from '../config/exercisePresets';

const ICON_SIZE = 20;
const ICON_CONTAINER_SIZE = 32;

const TopStatusBar = () => {
  const { streak, streakUpdatedToday, nickname, presetKey, setPresetKey, diamonds, isDarkMode } = useProgress();
  const navigation = useNavigation<any>();

  const [diamondModal, setDiamondModal] = React.useState(false);
  const [streakModal, setStreakModal] = React.useState(false);
  const [presetModal, setPresetModal] = React.useState(false);

  // Dark mode colors
  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#fff',
    cardBackground: isDarkMode ? '#2a2a2a' : '#fff',
    text: isDarkMode ? '#ffffff' : '#222',
    textSecondary: isDarkMode ? '#cccccc' : '#444',
    primary: '#1CB0F6',
    accent: '#FFA800',
    border: isDarkMode ? '#404040' : '#e0e0e0',
    modalOverlay: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
  };

  const handleStreakPress = () => {
    if (streakUpdatedToday) {
      navigation.navigate('StreakCelebration', { streak });
    } else {
      setStreakModal(true);
    }
  };

  const handlePresetSelect = (key: ExercisePresetKey) => {
    setPresetKey(key);
    setPresetModal(false);
  };

  const currentPreset = EXERCISE_PRESETS[presetKey];
  const currentPresetIcon = currentPreset.circles[0].icon;

  return (
    <View style={styles.wrapper}>
      <View style={styles.innerRow}>
        <View style={styles.greetingContainer}>
          <View style={styles.greetingRow}>
            <TouchableOpacity onPress={() => setPresetModal(true)} style={styles.presetIconContainer}>
              <MaterialCommunityIcons 
                name={currentPresetIcon as any} 
                size={24} 
                color="#fff" 
              />
            </TouchableOpacity>
            <AppText style={styles.greeting} numberOfLines={1}>
              {nickname ? `Hi, ${nickname}!` : 'Welcome!'}
            </AppText>
          </View>
        </View>
        <View style={styles.statsRow}>
          {/* Streak */}
          <TouchableOpacity onPress={handleStreakPress} activeOpacity={0.7}>
            <View style={[styles.statItem, { backgroundColor: '#FFA800', position: 'relative' }]}> {/* Orange */}
              <MaterialCommunityIcons name="fire" size={ICON_SIZE} color="#fff" style={styles.statIcon} />
              <AppText style={styles.statValue}>{streak}</AppText>
              {!streakUpdatedToday && (
                <MaterialCommunityIcons name="alert-circle" size={16} color="#fff" style={styles.streakAlertIcon} />
              )}
            </View>
          </TouchableOpacity>
          {/* Diamonds */}
          <TouchableOpacity onPress={() => setDiamondModal(true)} activeOpacity={0.7}>
            <View style={[styles.statItem, { backgroundColor: '#1CB0F6' }]}> {/* Blue */}
              <MaterialCommunityIcons name="diamond" size={ICON_SIZE} color="#fff" style={styles.statIcon} />
              <AppText style={styles.statValue}>{diamonds}</AppText>
            </View>
          </TouchableOpacity>
          
        </View>
      </View>

            {/* Preset Selection Modal */}
      <Modal
        visible={presetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setPresetModal(false)}
      >
        <View style={[styles.presetModalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.presetModalContent, { backgroundColor: colors.cardBackground }]}>
            <TouchableOpacity 
              style={[styles.presetCloseButton, { backgroundColor: isDarkMode ? '#404040' : '#f5f5f5' }]} 
              onPress={() => setPresetModal(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <AppText style={[styles.modalTitle, { color: colors.primary }]}>Choose Preset</AppText>
            {Object.entries(EXERCISE_PRESETS).map(([key, preset]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.presetOption,
                  presetKey === key && [styles.presetOptionActive, { backgroundColor: colors.primary }]
                ]}
                onPress={() => handlePresetSelect(key as ExercisePresetKey)}
              >
                <MaterialCommunityIcons 
                  name={preset.circles[0].icon as any} 
                  size={24} 
                  color={presetKey === key ? '#fff' : colors.primary} 
                />
                <AppText style={[
                  styles.presetOptionText,
                  { color: colors.text },
                  presetKey === key && styles.presetOptionTextActive
                ]}>
                  {preset.label}
                </AppText>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addCustomButton} disabled>
              <MaterialCommunityIcons name="plus-circle" size={24} color="#B0B0B0" />
              <AppText style={styles.addCustomText}>Add Custom Preset</AppText>
              <View style={styles.soonBadge}>
                <AppText style={styles.soonBadgeText}>SOON</AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Streak Modal (only if streak not updated today) */}
      <Modal
        visible={streakModal}
        transparent
        animationType="fade"
        onRequestClose={() => setStreakModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalContentSmall, { backgroundColor: colors.cardBackground }]}>
            <MaterialCommunityIcons name="fire" size={40} color="#FFA800" style={{ marginBottom: 10 }} />
            <AppText style={[styles.modalTitle, { color: colors.primary }]}>Streak</AppText>
            <AppText style={[styles.modalText, { color: colors.textSecondary }]}>You haven't extended your streak today. Complete a workout to keep your streak alive!</AppText>
            <TouchableOpacity style={styles.modalButton} onPress={() => setStreakModal(false)}>
              <AppText style={styles.modalButtonText}>Close</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Diamond Modal */}
      <Modal
        visible={diamondModal}
        transparent
        animationType="fade"
        onRequestClose={() => setDiamondModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalContentSmall, { backgroundColor: colors.cardBackground }]}>
            <MaterialCommunityIcons name="diamond" size={40} color="#1CB0F6" style={{ marginBottom: 10 }} />
            <AppText style={[styles.modalTitle, { color: colors.primary }]}>Diamonds</AppText>
            <AppText style={[styles.modalText, { color: colors.textSecondary }]}>Earn diamonds by completing workouts and challenges. Spend them in the shop!</AppText>
            <TouchableOpacity style={styles.modalButton} onPress={() => setDiamondModal(false)}>
              <AppText style={styles.modalButtonText}>Close</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FF8F00',
    paddingTop: 35,
    paddingBottom: 12,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
    paddingHorizontal: 10,
  },
  greetingContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  greeting: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    maxWidth: 120,
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ICON_CONTAINER_SIZE / 2,
    height: ICON_CONTAINER_SIZE,
    minWidth: ICON_CONTAINER_SIZE + 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    marginLeft: 4,
  },
  statIcon: {
    marginRight: 4,
  },
  statValue: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    textAlign: 'center',
    minWidth: 16,
  },
  streakAlertIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFA800',
    borderRadius: 8,
    padding: 0,
    zIndex: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentSmall: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 220,
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Nunito-Bold',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 18,
  },
  modalButton: {
    backgroundColor: '#1CB0F6',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 10,
    marginTop: 6,
  },
  modalButtonText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  presetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    width: '100%',
  },
  presetOptionActive: {
    // backgroundColor will be set dynamically
  },
  presetOptionText: {
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Nunito-Regular',
  },
  presetOptionTextActive: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    opacity: 0.6,
  },
  addCustomText: {
    fontSize: 16,
    color: '#B0B0B0',
    marginLeft: 12,
    fontFamily: 'Nunito-Regular',
  },
  soonBadge: {
    backgroundColor: '#FFA800',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 10,
  },
  soonBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Nunito-Bold',
  },
  presetModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetModalContent: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 220,
    maxWidth: 320,
    position: 'relative',
  },
  presetCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default TopStatusBar; 