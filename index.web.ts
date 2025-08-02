import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

// Import gesture handler only on native platforms to avoid web compatibility issues
if (Platform.OS !== 'web') {
  try {
    require('react-native-gesture-handler');
  } catch (error) {
    console.warn('react-native-gesture-handler not available');
  }
}

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App); 