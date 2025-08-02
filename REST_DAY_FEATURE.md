# Rest Day Feature

## Overview
The Rest Day feature automatically detects when it's a rest day based on the user's workout schedule and shows an engaging screen that allows them to acknowledge their rest day and maintain their streak.

## How It Works

### 1. Rest Day Detection
- The app checks the user's selected workout days (`selectedWorkoutDays`) from their schedule
- If the current day is not in their workout schedule, it's considered a rest day
- The app only shows the rest day screen if the streak hasn't been updated today (`streakUpdatedToday`)

### 2. Rest Day Screen Features
- **Engaging Visuals**: Large rest emoji (😴) with smooth animations
- **Streak Information**: Shows current streak with motivational messages
- **Educational Content**: Explains why rest days are important
- **Streak Maintenance**: Acknowledging a rest day keeps the streak alive

### 3. Motivational Messages
The screen adapts its messaging based on the user's current streak:
- **0 days**: "Your body deserves a break"
- **1-2 days**: "You've been crushing it for X day(s)!"
- **3-6 days**: "You're building an amazing habit!"
- **7+ days**: "You're a fitness champion! Keep it up!"

### 4. Rest Day Benefits
The screen educates users about rest day benefits:
- 💪 Muscles grow stronger during recovery
- ⚡ Prevents burnout and injury  
- 🎯 Come back stronger tomorrow

## Technical Implementation

### Files Created/Modified:
1. **`src/screens/RestDayScreen.tsx`** - New rest day screen component
2. **`src/components/ProgressContext.tsx`** - Added rest day functionality
3. **`App.tsx`** - Added rest day detection logic and navigation route

### Key Functions:
- `acknowledgeRestDay()` - Handles rest day acknowledgment and streak updates
- `setStreakUpdatedToday()` - Manages daily streak status
- Rest day detection logic in App.tsx initial route determination

### Navigation Flow:
1. User opens app on rest day
2. App.tsx detects rest day during initial route determination
3. App navigates directly to RestDayScreen
4. User acknowledges rest day
5. If streak is updated, shows StreakCelebration screen
6. Otherwise, returns to Home screen

## User Experience

### Visual Design:
- Clean, modern interface with smooth animations
- Green color scheme to represent rest/recovery
- Dark mode support
- Responsive layout with proper spacing

### Interactions:
- **Primary Action**: "Acknowledge Rest Day" button
- **Secondary Action**: "Skip for now" option
- Smooth fade-in and scale animations on screen load

### Accessibility:
- High contrast colors
- Clear typography with Nunito font family
- Touch-friendly button sizes
- Proper semantic structure

## Future Enhancements
- Add rest day statistics tracking
- Include rest day activity suggestions (stretching, walking, etc.)
- Personalized rest day recommendations based on workout intensity
- Rest day streak achievements
- Integration with health/fitness tracking apps 