/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import StreakCelebrationScreen from './src/screens/StreakCelebrationScreen';
import { ProgressProvider } from './src/components/ProgressContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProgressProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
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
