# Plan Selection Feature

## Overview
The Plan Selection screen is a new onboarding page that allows users to choose between different subscription plans before starting their fitness journey.

## Features

### Available Plans
1. **Free Plan** ($0/month)
   - Basic workout routines
   - Progress tracking
   - Streak system
   - Exercise library

2. **Virtual Coach** ($9.99/month) - Coming Soon
   - All Free Plan features
   - AI-powered workout plans
   - Personalized form feedback
   - Nutrition guidance

3. **Real Coach** ($49.99/month) - Coming Soon
   - All Virtual Coach features
   - Real-time coaching
   - Video call sessions
   - Custom meal plans
   - Weekly check-ins

### UI Components
- **Plan Cards**: Visual cards for each plan with pricing and descriptions
- **Feature Comparison Table**: Side-by-side comparison with checkmarks (✓) and X marks (✗)
- **Selection Indicator**: Visual feedback for the selected plan
- **Coming Soon Badges**: Orange badges for disabled plans
- **Continue Button**: Proceeds to the next onboarding step

### Navigation Flow
```
WelcomeScreen → PlanSelectionScreen → NicknameScreen → PresetSelectionScreen → UserInfoScreen → TutorialScreen → HomeScreen
```

### Technical Implementation
- **File**: `src/screens/PlanSelectionScreen.tsx`
- **Navigation**: Integrated into App.tsx navigation stack
- **State Management**: Uses React useState for plan selection
- **Storage**: Saves selected plan to AsyncStorage for future use
- **Styling**: Consistent with app's design system using Nunito fonts and brand colors

### Key Features
- Default selection of Free Plan
- Disabled state for Virtual Coach and Real Coach plans
- Responsive design with ScrollView for smaller screens
- Visual comparison table showing feature availability
- Consistent styling with the rest of the app

### Future Enhancements
- Integration with payment processing for premium plans
- Dynamic plan pricing and features
- A/B testing for different plan presentations
- Analytics tracking for plan selection behavior 