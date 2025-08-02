import { Platform } from 'react-native';

// Polyfill for gesture handler to avoid topGestureHandlerEvent errors
if (Platform.OS !== 'web') {
  try {
    // Import gesture handler to ensure proper initialization
    require('react-native-gesture-handler');
    
    // Patch the event system if needed
    const { UIManager } = require('react-native');
    
    // Ensure gesture handler events are properly registered
    if (UIManager && UIManager.getConstants) {
      const constants = UIManager.getConstants();
      if (constants && !constants.topGestureHandlerEvent) {
        // Add the missing event type if it doesn't exist
        constants.topGestureHandlerEvent = {
          registrationName: 'onGestureHandlerEvent',
        };
        constants.topGestureHandlerStateChange = {
          registrationName: 'onGestureHandlerStateChange',
        };
      }
    }
  } catch (error) {
    console.warn('Gesture handler polyfill failed:', error);
  }
}

export {}; 