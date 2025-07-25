/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import StreakCelebrationScreen from './src/screens/StreakCelebrationScreen';
import { ProgressProvider, PresetProvider } from './src/components/ProgressContext';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import PresetSelectionScreen from './src/screens/PresetSelectionScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = React.useState<string | null>(null);
  React.useEffect(() => {
    (async () => {
      const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
      const onboardingDone = await AsyncStorage.getItem('onboardingDone');
      if (!onboardingDone) {
        setInitialRoute('Welcome');
      } else if (!isAuthenticated) {
        setInitialRoute('Signup');
      } else {
        setInitialRoute('Home');
      }
    })();
  }, []);
  if (!initialRoute) return null;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProgressProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
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
