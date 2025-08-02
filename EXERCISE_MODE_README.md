# Exercise Mode System

This document describes the new generic exercise mode system that allows switching between camera and details modes for exercise sessions.

## Overview

The exercise mode system provides a flexible, pluggable architecture for displaying exercise content. Users can switch between different modes through the settings, and developers can easily add new modes or modify existing ones.

## Architecture

### Core Components

1. **ProgressContext** - Manages the exercise mode setting (`camera` or `details`)
2. **ProfileScreen** - Provides UI for users to switch between modes
3. **ExerciseScreen** - Uses the generic mode system to render the appropriate component
4. **Mode Components** - Individual implementations for each mode

### Mode Components

#### CameraMode (`src/components/exercise-modes/CameraMode.tsx`)
- Displays camera feed with recording controls
- Shows countdown, recording status, and timer
- Handles camera permissions
- Provides recording start/stop functionality

#### DetailsMode (`src/components/exercise-modes/DetailsMode.tsx`)
- Displays exercise information in a details-focused layout
- Features a circular timer with progress indicator
- Shows workout stages in a bottom sheet
- Provides session information and controls

## Usage

### For Users

1. Go to Profile screen
2. Find "Exercise mode" setting
3. Choose between "Camera" or "Details"
4. The setting is automatically saved and applied

### For Developers

#### Adding a New Mode

1. Create a new component in `src/components/exercise-modes/`
2. Implement the required interface:
   ```typescript
   interface ExerciseModeProps {
     exercise: any;
     duration: number;
     onDone: () => void;
     onBack: () => void;
     colors: any;
     recordingState: 'idle' | 'countdown' | 'recording';
     setRecordingState: (state: 'idle' | 'countdown' | 'recording') => void;
     countdown: number;
     timer: number | null;
     showDone: boolean;
     blinkAnim: Animated.Value;
     // Additional props as needed
   }
   ```

3. Export the component from `src/components/exercise-modes/index.ts`
4. Add the new mode to the ProgressContext type definition
5. Update the ExerciseScreen to handle the new mode

#### Modifying Existing Modes

Each mode component is self-contained and can be modified independently. The interface ensures that all modes receive the same core props, making them interchangeable.

## Features

### Camera Mode
- Real-time camera feed
- Recording controls with countdown
- Visual recording indicators
- Permission handling

### Details Mode
- Clean, information-focused layout
- **Proper circular progress timer** using SVG with smooth animation
- **Multiple sets support** with set-by-set progression
- **Workout stage breakdown** showing all sets and rest periods
- **Session information display** with set counts and durations
- **Responsive design** that adapts to different exercise configurations

## Settings Integration

The exercise mode setting is:
- Stored in AsyncStorage
- Managed through ProgressContext
- Accessible via `useProgress()` hook
- Automatically loaded on app start

## Benefits

1. **User Choice** - Users can choose their preferred exercise experience
2. **Developer Flexibility** - Easy to add new modes or modify existing ones
3. **Maintainability** - Each mode is isolated and can be developed independently
4. **Consistency** - All modes share the same interface and behavior patterns
5. **Performance** - Only the selected mode is rendered
6. **Advanced Features** - Proper timer synchronization and multiple sets support

## Technical Improvements

### Circular Progress Timer
- **SVG-based implementation** using `react-native-svg`
- **Smooth progress animation** that accurately reflects timer state
- **Customizable appearance** with configurable colors, sizes, and stroke widths
- **Proper synchronization** between timer display and progress indicator

### Multiple Sets Support
- **Set-by-set progression** for exercises with multiple sets
- **Automatic set advancement** when current set is completed
- **Rest period tracking** between sets
- **Visual set indicators** in the workout stage breakdown
- **Session information** showing current set and total sets

### Workout Stage Breakdown
- **Dynamic stage generation** based on exercise configuration
- **Active stage highlighting** to show current progress
- **Duration display** for each stage (work, rest, preparation)
- **Set-specific information** for multi-set exercises 