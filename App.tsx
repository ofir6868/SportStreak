/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Platform, SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import StreakCelebrationScreen from './src/screens/StreakCelebrationScreen';
import { ProgressProvider } from './src/components/ProgressContext';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import PresetSelectionScreen from './src/screens/PresetSelectionScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserInfoScreen from './src/screens/UserInfoScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

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

const App = () => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [initialRoute, setInitialRoute] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync(customFonts);
        setFontsLoaded(true);
      } catch (e) {
        console.error('Font loading error:', e);
        setFontsLoaded(true); // allow app to load even if fonts fail
      }
      const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
      const onboardingDone = await AsyncStorage.getItem('onboardingDone');
      if (!onboardingDone) {
        setInitialRoute('Welcome');
      } else {
        setInitialRoute('Home');
      }
    })();
  }, []);
  if (!fontsLoaded || !initialRoute) return null;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProgressProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="UserInfo" component={UserInfoScreen} />
            <Stack.Screen name="Tutorial" component={TutorialScreen} />
            {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
            <Stack.Screen name="PresetSelection" component={PresetSelectionScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Exercise" component={ExerciseScreen} />
            <Stack.Screen name="StreakCelebration" component={StreakCelebrationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ProgressProvider>
    </SafeAreaView>
  );
};

export default App;
