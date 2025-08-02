import React from 'react';
import { Platform } from 'react-native';

// Web-compatible gesture handler wrapper
export const GestureHandlerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (Platform.OS === 'web') {
    // On web, just render children without gesture handler wrapper
    return <>{children}</>;
  }

  // On native platforms, use the actual gesture handler root
  try {
    const { GestureHandlerRootView } = require('react-native-gesture-handler');
    return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
  } catch (error) {
    // Fallback if gesture handler is not available
    console.warn('GestureHandlerRootView not available, using fallback');
    return <>{children}</>;
  }
};

// Web-compatible gesture components
export const createWebCompatibleGestureHandler = () => {
  if (Platform.OS === 'web') {
    // Return web-compatible components that don't use gesture handler
    return {
      PanGestureHandler: ({ children, onGestureEvent, onHandlerStateChange, ...props }: any) => {
        // For web, we'll create a simple wrapper that handles basic touch events
        const handleTouchStart = (event: any) => {
          if (onGestureEvent) {
            onGestureEvent({ nativeEvent: { translationY: 0, state: 2 } });
          }
        };
        
        const handleTouchEnd = (event: any) => {
          if (onHandlerStateChange) {
            onHandlerStateChange({ nativeEvent: { state: 5, translationY: 0 } });
          }
        };

        return React.cloneElement(children, {
          onTouchStart: handleTouchStart,
          onTouchEnd: handleTouchEnd,
          ...props
        });
      },
      TapGestureHandler: ({ children, onGestureEvent, ...props }: any) => {
        return React.cloneElement(children, {
          onPress: onGestureEvent,
          ...props
        });
      },
      LongPressGestureHandler: ({ children, onGestureEvent, ...props }: any) => {
        return React.cloneElement(children, {
          onLongPress: onGestureEvent,
          ...props
        });
      },
      PinchGestureHandler: ({ children }: any) => children,
      RotationGestureHandler: ({ children }: any) => children,
      FlingGestureHandler: ({ children }: any) => children,
      ForceTouchGestureHandler: ({ children }: any) => children,
      NativeViewGestureHandler: ({ children }: any) => children,
      GestureDetector: ({ children }: any) => children,
      Gesture: {
        Pan: () => ({}),
        Tap: () => ({}),
        LongPress: () => ({}),
        Pinch: () => ({}),
        Rotation: () => ({}),
        Fling: () => ({}),
        ForceTouch: () => ({}),
      },
      State: {
        UNDETERMINED: 0,
        FAILED: 1,
        BEGAN: 2,
        CANCELLED: 3,
        ACTIVE: 4,
        END: 5
      }
    };
  }

  // On native platforms, use the actual gesture handler
  try {
    const gestureHandler = require('react-native-gesture-handler');
    return gestureHandler;
  } catch (error) {
    console.warn('react-native-gesture-handler not available, using web fallback');
    return createWebCompatibleGestureHandler();
  }
};

// Export gesture handler components with proper error handling
let gestureHandlerComponents: any;

try {
  gestureHandlerComponents = createWebCompatibleGestureHandler();
} catch (error) {
  console.warn('Failed to create gesture handler components:', error);
  // Provide fallback components
  gestureHandlerComponents = {
    PanGestureHandler: ({ children }: any) => children,
    TapGestureHandler: ({ children }: any) => children,
    LongPressGestureHandler: ({ children }: any) => children,
    PinchGestureHandler: ({ children }: any) => children,
    RotationGestureHandler: ({ children }: any) => children,
    FlingGestureHandler: ({ children }: any) => children,
    ForceTouchGestureHandler: ({ children }: any) => children,
    NativeViewGestureHandler: ({ children }: any) => children,
    GestureDetector: ({ children }: any) => children,
    Gesture: {
      Pan: () => ({}),
      Tap: () => ({}),
      LongPress: () => ({}),
      Pinch: () => ({}),
      Rotation: () => ({}),
      Fling: () => ({}),
      ForceTouch: () => ({}),
    },
    State: {
      UNDETERMINED: 0,
      FAILED: 1,
      BEGAN: 2,
      CANCELLED: 3,
      ACTIVE: 4,
      END: 5
    }
  };
}

export const {
  PanGestureHandler,
  TapGestureHandler,
  LongPressGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  FlingGestureHandler,
  ForceTouchGestureHandler,
  NativeViewGestureHandler,
  GestureDetector,
  Gesture,
  State
} = gestureHandlerComponents; 