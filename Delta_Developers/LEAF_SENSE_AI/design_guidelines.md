# LeafSense AI - Design Guidelines

## Architecture Decisions

### Authentication
**No Auth Required** - The app is a utility-focused tool for farmers with local-first functionality.
- Include a Profile/Settings screen with:
  - User-customizable name field (labeled "Farmer Name")
  - App preferences (Preferred Language: English)
  - App version display (1.0.0)
  - About section with app information

### Navigation
**Bottom Tab Navigation** (4 tabs)
- **Home** - Dashboard with quick actions
- **Diagnose** - Core action for leaf disease detection
- **Chat** - AI assistant for follow-up questions
- **Profile** - User settings and app information

Use a **Floating Action Button** approach for the core "Diagnose" action if needed, or emphasize it prominently in the Home screen.

### Information Architecture
1. Home (Dashboard)
2. Diagnose (Upload & Results)
3. Chat (Conversational AI Assistant)
4. Profile (Settings & About)

## Screen Specifications

### Home Screen
**Purpose:** Provide quick access to core features and educational content for farmers.

**Layout:**
- **Header:** Transparent, no navigation buttons
  - Large greeting: "Hello, Farmer! 👋"
  - Subtext: "What do you want to do today?"
- **Main Content:** Scrollable view
  - Primary action card (large, prominent):
    - Title: "Diagnose Leaf Disease"
    - Subtitle: "Upload a leaf photo and let LeafSense AI analyze it"
    - Tap navigates to Diagnose tab
  - Secondary action cards (2-4 smaller cards):
    - "View Last Scan"
    - "Common Diseases"
    - "How to take good leaf photos"
- **Safe Area Insets:** 
  - Top: transparent header + Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl

### Diagnose Screen
**Purpose:** Allow farmers to upload leaf images and receive disease predictions.

**Layout:**
- **Header:** Default navigation header
  - Title: "Diagnose Leaf Disease"
- **Main Content:** Scrollable form
  - File input section for image selection (camera or gallery)
  - Large "Predict Disease" button
  - Loading state: "Predicting..." with spinner during API call
  - Result card (after prediction):
    - Disease name (large, bold text)
    - Confidence percentage
    - "Suggested Actions" section with treatments/remedies
- **Safe Area Insets:**
  - Top: Spacing.xl (with opaque header)
  - Bottom: tabBarHeight + Spacing.xl

### Chat Screen
**Purpose:** Enable farmers to ask follow-up questions about detected diseases.

**Layout:**
- **Header:** Default navigation header
  - Title: "Ask LeafSense"
- **Main Content:** Scrollable chat view
  - Chat messages in bubbles:
    - AI messages: left-aligned, green background (#66BB6A)
    - User messages: right-aligned, light grey background
  - Temporary "LeafSense is thinking..." indicator during API calls
- **Footer:** Fixed input section
  - Text input box
  - Send button (right-aligned)
- **Safe Area Insets:**
  - Top: Spacing.xl (with opaque header)
  - Bottom: tabBarHeight + Spacing.xl for scrollable area; input box sits above tab bar

### Profile Screen
**Purpose:** Display user information and app settings.

**Layout:**
- **Header:** Default navigation header
  - Title: "Your Profile"
- **Main Content:** Scrollable view
  - Section: Farmer Name (editable field)
  - Settings items:
    - Preferred Language: English
    - App Version: 1.0.0
  - About section with descriptive paragraph
- **Safe Area Insets:**
  - Top: Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl

## Design System

### Color Palette
**Primary Colors:**
- Primary Green: `#388E3C`
- Light Green: `#66BB6A`
- Background Grey: `#F5F5F5`
- White: `#FFFFFF`

**Semantic Colors:**
- Text Primary: `#212121`
- Text Secondary: `#757575`
- Border/Divider: `#E0E0E0`

### Typography
**Large, Readable Fonts for Farmers:**
- Greeting/Hero: 28-32px, Bold
- Card Titles: 20-24px, Semi-Bold
- Body Text: 16-18px, Regular
- Button Text: 18px, Semi-Bold
- Tab Labels: 12px, Medium

### Visual Design

**Icons:**
- Use standard system icons or Feather icons from @expo/vector-icons
- DO NOT use emojis in production UI (the 👋 in the brief is acceptable for demo purposes only)

**Cards:**
- Rounded corners: 12-16px border radius
- Subtle shadows for elevation
- White background on light grey base
- Padding: 16-20px

**Buttons:**
- Primary action buttons: Green background (#388E3C), white text, 48px height
- Rounded: 8-12px border radius
- Visual feedback: Slight opacity change (0.8) on press
- Large touch targets (minimum 48x48px)

**Floating Elements:**
If using floating action buttons, apply subtle shadow:
- shadowOffset: { width: 0, height: 2 }
- shadowOpacity: 0.10
- shadowRadius: 2

**Chat Bubbles:**
- AI bubbles: Green (#66BB6A), white text, left-aligned
- User bubbles: Light grey (#E0E0E0), dark text, right-aligned
- Border radius: 16px
- Padding: 12-16px

### Interaction Design
- All touchable components must have visual feedback (opacity or background color change on press)
- Loading states: Show spinners with "Predicting..." or "LeafSense is thinking..." text
- Smooth transitions between tabs
- Image upload should support both camera capture and gallery selection
- Form submit button should be prominently placed below the image input

### Assets Required
**Critical Assets:**
1. **Bottom Tab Icons:**
   - Home icon (house)
   - Diagnose icon (camera or leaf with magnifying glass)
   - Chat icon (message bubble)
   - Profile icon (person)

2. **Placeholder Leaf Images:**
   - Sample healthy leaf
   - Sample diseased leaf (for demo/tutorial purposes)

3. **App Icon:**
   - Leaf with AI/tech element
   - Predominantly green color scheme

**DO NOT overuse custom assets.** Use system icons for common actions. Focus custom graphics only on the app icon and any tutorial/onboarding imagery.

### Accessibility
- Minimum touch target size: 48x48px
- High contrast text (dark on light backgrounds)
- Large, readable fonts suitable for outdoor use and users with varying literacy levels
- Clear visual hierarchy with prominent primary actions
- Loading indicators for all async operations
- Error messages should be farmer-friendly and actionable