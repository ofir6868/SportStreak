import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Animated, Easing, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Camera, CameraView } from 'expo-camera';
import { FontAwesome5 } from '@expo/vector-icons';
import { useProgress } from '../components/ProgressContext';

const steps = ['explanation', 'privacy', 'camera'] as const;
type Step = typeof steps[number];

const ExerciseScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { exercise, idx } = route.params;
  const [step, setStep] = useState<Step>('explanation');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);
  const { markExerciseComplete, streak, streakUpdatedToday } = useProgress();
  const flameAnim = useRef(new Animated.Value(0)).current;

  // Request camera permission on camera step
  React.useEffect(() => {
    if (step === 'camera' && hasPermission === null) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, [step, hasPermission]);

  const goNext = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };
  const goBack = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
    else navigation.goBack();
  };

  const handleDone = async () => {
    const { streaked, newStreak } = await markExerciseComplete(idx);
    if (streaked) {
      navigation.navigate('StreakCelebration', { streak: newStreak });
      return;
    }
    Alert.alert('Great job!', `You completed: ${exercise.title}`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {step === 'explanation' && (
        <View style={styles.centered}>
          <Text style={styles.title}>{exercise.title}</Text>
          <View style={styles.iconBox}>{exercise.icon}</View>
          <Text style={styles.desc}>Instructions: Do as many {exercise.title.toLowerCase()} as you can in 30 seconds. {exercise.subtitle}</Text>
          <TouchableOpacity style={styles.button} onPress={goNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 'privacy' && (
        <View style={styles.centered}>
          <FontAwesome5 name="user-shield" size={48} color="#1CB0F6" style={{ marginBottom: 24 }} />
          <Text style={styles.title}>Your privacy is protected</Text>
          <Text style={styles.desc}>Your exercise video is only stored on your device and never uploaded.</Text>
          <TouchableOpacity style={styles.button} onPress={goNext}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={goBack}>
            <Text style={styles.linkText}>Back</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 'camera' && (
        <View style={styles.cameraContainer}>
          {hasPermission === null ? (
            <Text style={styles.desc}>Requesting camera permission...</Text>
          ) : hasPermission === false ? (
            <Text style={styles.desc}>No access to camera</Text>
          ) : (
            <CameraView style={styles.camera} ref={cameraRef} facing={"front"}>
              <View style={styles.cameraOverlay}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: isRecording ? '#FF4B4B' : '#1CB0F6' }]}
                  onPress={() => setIsRecording((r) => !r)}
                >
                  <Text style={styles.buttonText}>{isRecording ? 'Stop' : 'Record'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleDone}>
                  <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.link} onPress={goBack}>
                  <Text style={styles.linkText}>Back</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1CB0F6',
    textAlign: 'center',
  },
  desc: {
    fontSize: 18,
    color: '#444',
    marginBottom: 24,
    textAlign: 'center',
  },
  iconBox: {
    marginBottom: 24,
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
  link: {
    marginTop: 8,
  },
  linkText: {
    color: '#1CB0F6',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default ExerciseScreen; 