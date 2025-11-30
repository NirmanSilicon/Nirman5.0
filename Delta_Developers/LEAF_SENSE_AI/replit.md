# LeafSense AI

A mobile-first AI crop doctor application that helps farmers identify plant diseases through leaf image analysis and provides treatment recommendations.

## Overview

LeafSense AI is designed to empower farmers with technology that helps protect crops and improve yields. The app allows users to:
- Capture or upload images of plant leaves
- Get instant disease detection with confidence scores
- Receive treatment recommendations and prevention tips
- Chat with an AI assistant for follow-up questions

## Project Structure

```
├── App.tsx                    # Root application component
├── app.json                   # Expo configuration
├── components/                # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── ErrorBoundary.tsx
│   ├── ErrorFallback.tsx
│   ├── HeaderTitle.tsx
│   ├── ScreenScrollView.tsx
│   ├── ScreenKeyboardAwareScrollView.tsx
│   ├── ScreenFlatList.tsx
│   ├── Spacer.tsx
│   ├── ThemedText.tsx
│   └── ThemedView.tsx
├── constants/
│   └── theme.ts               # Design system (colors, spacing, typography)
├── hooks/                     # Custom React hooks
│   ├── useColorScheme.ts
│   ├── useScreenInsets.ts
│   └── useTheme.ts
├── navigation/                # Navigation configuration
│   ├── MainTabNavigator.tsx
│   ├── HomeStackNavigator.tsx
│   ├── DiagnoseStackNavigator.tsx
│   ├── ChatStackNavigator.tsx
│   ├── ProfileStackNavigator.tsx
│   └── screenOptions.ts
├── screens/                   # Screen components
│   ├── HomeScreen.tsx
│   ├── DiagnoseScreen.tsx
│   ├── ChatScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── CommonDiseasesScreen.tsx
│   └── PhotoTipsScreen.tsx
└── utils/                     # Utilities and data
    ├── diseaseData.ts         # Disease information database
    ├── chatResponses.ts       # AI chat logic
    └── storage.ts             # AsyncStorage persistence
```

## Features

### 1. Disease Diagnosis
- Camera and gallery image selection
- AI-powered disease detection
- Confidence percentage display
- Treatment recommendations
- Prevention tips

### 2. AI Chat Assistant
- Rule-based conversational AI
- Context-aware responses based on last detected disease
- Information about causes, treatments, and prevention
- Persistent chat history

### 3. Disease Library
- Information on 4 common plant diseases:
  - Healthy (no disease)
  - Early Blight
  - Late Blight
  - Rust Disease
- Symptoms, treatments, and prevention for each

### 4. Photo Tips
- Guidelines for capturing quality leaf images
- Tips for better AI detection results

## Design System

The app uses a custom green-themed design system:
- **Primary Green**: #388E3C
- **Light Green**: #66BB6A
- **Background**: #F5F5F5 (light) / #1F2123 (dark)

Typography is optimized for farmer-friendly readability with large touch targets and clear visual hierarchy.

## Technology Stack

- **React Native** with Expo SDK 54
- **React Navigation 7** for navigation
- **Expo Image Picker** for camera/gallery access
- **AsyncStorage** for local data persistence
- **Reanimated** for smooth animations

## Running the App

The app runs automatically via the Expo development server. Users can:
1. Test in web browser (desktop)
2. Scan QR code with Expo Go app (mobile)

## Recent Changes

- Initial implementation of LeafSense AI mobile app
- Created 4-tab navigation structure (Home, Diagnose, Chat, Profile)
- Implemented disease prediction simulation
- Added rule-based AI chat assistant
- Created disease information database
- Added photo tips screen
- Implemented AsyncStorage persistence for user data

## User Preferences

- Mobile-first design approach
- Farmer-friendly UI with large touch targets
- Green color scheme for agricultural context
- No authentication required (utility-focused app)
