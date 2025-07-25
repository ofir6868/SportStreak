import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProgress, } from './ProgressContext';
import { EXERCISE_PRESETS, ExercisePresetKey } from '../config/exercisePresets';

const TopStatusBar = () => {
  const { streak, streakUpdatedToday, presetKey, setPresetKey } = useProgress();
  const navigation = useNavigation<any>();
  const [diamondModalVisible, setDiamondModalVisible] = React.useState(false);
  const [heartModalVisible, setHeartModalVisible] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const presetKeys: ExercisePresetKey[] = ['strength', 'running', 'yoga'];

  const handleStreakPress = () => {
    navigation.navigate('StreakCelebration', { streak });
  };
  const handleDiamondsPress = () => {
    setDiamondModalVisible(true);
  };
  const handleHeartsPress = () => {
    setHeartModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Streak, diamonds, hearts */}
      <TouchableOpacity style={styles.item} onPress={handleStreakPress} activeOpacity={0.7}>
        <View style={[styles.fireIconWrapper, streakUpdatedToday && styles.glow]}>
          <FontAwesome5 name="fire" size={22} color={streak > 0 ? (streakUpdatedToday ? '#FFA500' : '#FF9900') : '#888'} style={styles.icon} />
        </View>
        <Text style={styles.value}>{streak}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={handleDiamondsPress} activeOpacity={0.7}>
        <MaterialCommunityIcons name="diamond-stone" size={22} color="#1CB0F6" style={styles.icon} />
        <Text style={styles.value}>500</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={handleHeartsPress} activeOpacity={0.7}>
        <FontAwesome5 name="heart" size={22} color="#FF4B4B" style={styles.icon} />
        <Text style={styles.value}>5</Text>
      </TouchableOpacity>
      {/* Preset selector icon at top right */}
      <View style={styles.presetIconContainer}>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.presetIconButton}>
          {presetKey === 'strength' ? (
            <MaterialCommunityIcons name="dumbbell" size={28} color="#58CC02" />
          ) : presetKey === 'running' ? (
            <MaterialCommunityIcons name="run" size={28} color="#58CC02" />
          ) : (
            <MaterialCommunityIcons name="yoga" size={28} color="#58CC02" />
          )}
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.presetDropdownMenu}>
            {presetKeys.map((key) => (
              <TouchableOpacity key={key} style={styles.presetDropdownItem} onPress={() => { setPresetKey(key); setMenuVisible(false); }}>
                {key === 'strength' ? (
                  <MaterialCommunityIcons name="dumbbell" size={22} color={presetKey === key ? '#58CC02' : '#888'} />
                ) : key === 'running' ? (
                  <MaterialCommunityIcons name="run" size={22} color={presetKey === key ? '#58CC02' : '#888'} />
                ) : (
                  <MaterialCommunityIcons name="yoga" size={22} color={presetKey === key ? '#58CC02' : '#888'} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {/* Diamonds Modal */}
      <Modal
        visible={diamondModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDiamondModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons name="diamond-stone" size={48} color="#1CB0F6" style={{ marginBottom: 12 }} />
            <Text style={styles.modalTitle}>Diamonds</Text>
            <Text style={styles.modalText}>You have 500 diamonds. Earn more by completing workouts and challenges!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setDiamondModalVisible(false)}>
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Hearts Modal */}
      <Modal
        visible={heartModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setHeartModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FontAwesome5 name="heart" size={48} color="#FF4B4B" style={{ marginBottom: 12 }} />
            <Text style={styles.modalTitle}>Hearts</Text>
            <Text style={styles.modalText}>You have 5 hearts. Hearts represent your lives. Complete exercises to keep your hearts full!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setHeartModalVisible(false)}>
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 15,
    marginTop: 20,
    position: 'relative',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  fireIconWrapper: {
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    shadowColor: '#FFA500',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 260,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1CB0F6',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#444',
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  presetIconContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 100,
  },
  presetIconButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#E6F0FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetDropdownMenu: {
    position: 'absolute',
    top: 38,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 4,
    minWidth: 44,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 101,
  },
  presetDropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default TopStatusBar; 