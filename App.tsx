/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import React from 'react';
import { Platform, SafeAreaView, View, StyleSheet, LogBox } from 'react-native';

// Suppress the specific warning about text strings
LogBox.ignoreLogs(['Text strings must be rendered within a <Text> component.']);
import { ProgressProvider, useProgress } from './src/components/ProgressContext';
import ExerciseScreen from './src/screens/ExerciseScreen';
import ExerciseCompletionScreen from './src/screens/ExerciseCompletionScreen';
import HomeScreen from './src/screens/HomeScreen';
import PlanSelectionScreen from './src/screens/PlanSelectionScreen';
import PresetSelectionScreen from './src/screens/PresetSelectionScreen';
import StreakCelebrationScreen from './src/screens/StreakCelebrationScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import UserInfoScreen from './src/screens/UserInfoScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import NicknameScreen from './src/screens/NicknameScreen';
import QuestsScreen from './src/screens/QuestsScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import WorkoutSessionScreen from './src/screens/WorkoutSessionScreen';
import WorkoutCompletionScreen from './src/screens/WorkoutCompletionScreen';
import ShopScreen from './src/screens/ShopScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import QuestToast from './src/components/QuestToast';

const isWeb = Platform.OS === 'web';
const customFonts = {
  'Nunito-Regular': isWeb
    ? '/Nunito-Regular.ttf'
    : require('./assets/fonts/Nunito-Regular.ttf'),
  'Nunito-Bold': isWeb
    ? '/Nunito-Bold.ttf'
    : require('./assets/fonts/Nunito-Bold.ttf'),
  'Nunito-SemiBold': isWeb
    ? '/Nunito-SemiBold.ttf'
    : require('./assets/fonts/Nunito-SemiBold.ttf'),
};

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { completedQuestToast, hideQuestToast } = useProgress();
  const [initialRoute, setInitialRoute] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
      const onboardingDone = await AsyncStorage.getItem('onboardingDone');
      if (!onboardingDone) {
        setInitialRoute('Welcome');
      } else {
        setInitialRoute('Home');
      }
    })();
  }, []);
  
  if (!initialRoute) return null;
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          <Stack.Navigator 
            id={undefined} 
            screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: '#FDFCF9' }
            }} 
            initialRouteName={initialRoute}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="PlanSelection" component={PlanSelectionScreen} />
            <Stack.Screen name="UserInfo" component={UserInfoScreen} />
            <Stack.Screen name="Tutorial" component={TutorialScreen} />
            <Stack.Screen name="Nickname" component={NicknameScreen} />
            {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
            <Stack.Screen name="PresetSelection" component={PresetSelectionScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Quests" component={QuestsScreen} />
            <Stack.Screen name="Workouts" component={WorkoutsScreen} />
            <Stack.Screen name="WorkoutSession" component={WorkoutSessionScreen} />
            <Stack.Screen name="WorkoutCompletion" component={WorkoutCompletionScreen} />
            <Stack.Screen name="Shop" component={ShopScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Exercise" component={ExerciseScreen} />
            <Stack.Screen name="ExerciseCompletion" component={ExerciseCompletionScreen} />
            <Stack.Screen name="StreakCelebration" component={StreakCelebrationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <QuestToast
          visible={completedQuestToast.visible}
          questTitle={completedQuestToast.title}
          reward={completedQuestToast.reward}
          onHide={hideQuestToast}
        />
      </SafeAreaView>
    </View>
  );
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync(customFonts);
        setFontsLoaded(true);
      } catch (e) {
        console.error('Font loading error:', e);
        setFontsLoaded(true); // allow app to load even if fonts fail
      }
    })();
  }, []);
  
  if (!fontsLoaded) return null;
  
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCF9',
  },
  safeArea: {
    flex: 1,
  },
});

export default App;
