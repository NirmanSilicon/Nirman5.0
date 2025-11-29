# Fin-Forge — Gamified Finance Learning Platform

A production-quality, interactive finance education application that uses gamification to teach budgeting, investing, and digital finance concepts through immersive simulators.

## 🎮 Overview

Fin-Forge transforms financial education into an engaging, game-like experience. Users progress through three specialized "Forges" (Budgeting, Market, and Digital), earning XP, unlocking achievements, and building real-world financial skills through interactive scenarios.

## ✨ Key Features

### Core Application Screens
- **Landing Page**: Hero section with mission statement and "Start Learning" CTA
- **Onboarding Flow**: 3-step personalization (learning goals, experience level, risk tolerance)
- **Forge Selection**: Three specialized learning paths with progress tracking
- **Simulator Hub**: Browse and select from 50+ interactive financial scenarios
- **Simulator Experience**: Left pane (scenarios), center (charts), right pane (live metrics)
- **Dashboard**: Analytics, risk profile, compound interest visualizer, financial news
- **Profile & Achievements**: Badge collection, progress tracking, statistics
- **Settings**: Accessibility options, theme toggle, notifications, privacy controls

### Simulators Included
#### Budgeting Forge
- Cash Flow Runner
- Debt Trap Escape
- Life Planner
- Passive Power
- Emergency Fund Builder
- Tax Optimizer

#### Market Forge
- The Behavioral Trap
- Portfolio Architect
- Market Timing Challenge
- Dividend Dynasty

#### Digital Forge
- DeFi Detective
- Tokenomics Tussle
- Wallet Security Master
- NFT Valuation Game

## 🎨 Design System

### Color Palette
**Primary Colors:**
- Navy: `#0B2545` - Headers and primary text
- Teal: `#17A2B8` - Primary actions and accents
- Gold: `#FFC857` - XP highlights and rewards
- Neutral: `#F7FAFC` - Background

**Semantic Colors:**
- Success: `#10b981` - Positive outcomes
- Risk: `#f97316` - High-risk indicators
- Destructive: `#ef4444` - Errors and warnings

**Dark Mode Variants:**
All colors have dark mode equivalents that maintain WCAG AA contrast ratios.

### Typography
- **Font Family**: Inter or Poppins
- **H1**: 36-48px, Medium (500)
- **H2**: 28px, Medium (500)
- **H3**: 20px, Medium (500)
- **Body**: 16px, Regular (400)
- **Caption**: 12px, Regular (400)

### Spacing & Layout
- **Grid System**: 8px base unit with 4px baseline
- **Border Radius**: 8-12px for cards, 4-6px for buttons
- **Shadows**: Subtle elevation for cards and modals
- **Responsive Breakpoints**: Mobile-first with tablet and desktop variants

## 🧩 Component Library

### Custom Components
1. **XPBar**: Progress bar with level display and animated fill
2. **RiskMeter**: Visual risk indicator (0-100%) with color-coded zones
3. **ForgeCard**: Interactive card for Forge selection with hover effects
4. **SimulatorCard**: Displays simulator info, difficulty, time, and XP rewards
5. **BadgeIcon**: Achievement badge with locked/unlocked states
6. **SparklineChart**: Compact trend visualization
7. **CompoundInterestVisualizer**: Interactive calculator with sliders and area chart
8. **Navbar**: Responsive navigation with XP display and user menu

### Shadcn/UI Components Used
- Buttons, Badges, Cards, Progress Bars
- Dialogs, Sheets, Tabs, Tooltips
- Form Controls (Input, Select, Slider, Switch)
- Dropdowns, Menus, Navigation
- Toast notifications (Sonner)

## 📊 Data Visualization

All charts use **Recharts** library:
- **Line Charts**: Balance tracking over time
- **Area Charts**: Compound interest visualization
- **Radar Charts**: Skills assessment and risk profile
- **Sparklines**: Compact trend indicators

**Integration Notes:**
- Colors use CSS variables for theme compatibility
- Responsive containers adapt to screen size
- Tooltips match card styling
- 800ms animations on data load

## 🎯 Gamification Features

### XP System
- Earn XP by completing simulators
- Level up when reaching XP milestones
- Visual progress bar always visible in navbar

### Achievement Badges
- 30+ unlockable badges
- Rarity tiers: Common, Rare, Epic, Legendary
- Unlock conditions based on progress and behavior

### Risk Profile
- Dynamic assessment based on simulator decisions
- Radar chart visualization of skills
- Personalized feedback and recommendations

### Progress Tracking
- Completion percentage per Forge
- Activity timeline
- Streak counting
- Recommended next steps

## 🚀 Getting Started

### Installation
This is a React + TypeScript application using Vite and Tailwind CSS 4.0.

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Key Dependencies
- React 18+ with TypeScript
- Motion (motion/react) for animations
- Recharts for data visualization
- Lucide React for icons
- Shadcn/UI component library
- Sonner for toast notifications

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: Single column layouts, hamburger menu, touch-optimized
- **Tablet**: Two-column grids, adapted navigation
- **Desktop**: Full multi-column layouts with sidebar

## ♿ Accessibility

- **Contrast Ratios**: WCAG AA compliant (4.5:1 minimum)
- **Keyboard Navigation**: Full keyboard support
- **Focus States**: Clear focus indicators on all interactive elements
- **Screen Readers**: Semantic HTML and ARIA labels
- **Adjustable Settings**: Font size, contrast modes, reduced motion

## 🔧 Customization

### Design Tokens
All colors and spacing values are defined in `/styles/globals.css`:

```css
:root {
  --navy: #0B2545;
  --teal: #17A2B8;
  --gold: #FFC857;
  /* ... more tokens */
}
```

### Component Variants
Most components accept variant props for styling flexibility:
```tsx
<Button variant="primary" | "secondary" | "outline" | "ghost" />
<Badge variant="default" | "secondary" | "outline" | "destructive" />
```

## 📂 Project Structure

```
/components/
  ├── ui/              # Shadcn components
  ├── XPBar.tsx
  ├── RiskMeter.tsx
  ├── ForgeCard.tsx
  ├── SimulatorCard.tsx
  ├── BadgeIcon.tsx
  ├── Navbar.tsx
  ├── LandingPage.tsx
  ├── Onboarding.tsx
  ├── ForgeSelection.tsx
  ├── SimulatorHub.tsx
  ├── SimulatorExperience.tsx
  ├── Dashboard.tsx
  ├── Profile.tsx
  ├── Settings.tsx
  ├── CompoundInterestVisualizer.tsx
  └── DesignSystem.tsx
/styles/
  └── globals.css      # Design tokens and base styles
App.tsx               # Main application router
```

## 🎓 Educational Philosophy

Fin-Forge follows these principles:
1. **Learn by Doing**: Interactive scenarios over passive reading
2. **Safe Environment**: Make mistakes without real consequences
3. **Immediate Feedback**: See results of financial decisions instantly
4. **Personalized Path**: Content adapts to user goals and experience
5. **Progress Visibility**: Clear metrics and achievement tracking

## 🔒 Privacy & Data

- **No PII Collection**: Figma Make is not meant for sensitive personal data
- **Local Storage**: Progress saved locally when possible
- **Mock Data**: All financial scenarios use example data
- **Educational Purpose**: Not a substitute for professional financial advice

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Future Enhancements

- Multiplayer challenges and leaderboards
- More advanced simulators (derivatives, options trading)
- Social features (share achievements, compare progress)
- Integration with real market data APIs
- Mobile native apps (iOS/Android)
- Certification programs

## 🤝 Contributing

This is a demo/educational project. Feedback and suggestions welcome!

## 📄 License

Educational use and demonstration purposes.

---

**Built with ❤️ for financial education**

For questions or feedback about the design system, refer to the DesignSystem component (`/components/DesignSystem.tsx`) which showcases all components and tokens in an interactive format.
