# Ambulance Booking Page - Visual Guide & Quick Reference

## 🚑 Page Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      NAVIGATION BAR                          │
│  Sanjeevani Live | Home | Hospital | Pharmacy | ... Ambulance│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              EMERGENCY AMBULANCE BOOKING                     │
│         Get emergency medical assistance instantly           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    BOOKING FORM                              │
│  • Emergency Type        | Critical, Accident, Cardiac, etc  │
│  • Pickup Location       | [Input Field] [Use Current Loc]   │
│  • Destination Hospital  | [Dropdown]                        │
│  • Patient Name          | [Input Field]                     │
│  • Contact Phone         | [Input Field]                     │
│  • Additional Info       | [Textarea]                        │
│  [REQUEST AMBULANCE NOW BUTTON]                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              HOSPITAL MAP WITH SIDEBAR                       │
│  ┌──────────────────────┬─────────────────────────────────┐ │
│  │                      │  NEARBY HOSPITALS               │ │
│  │      MAP             │  1. Hospital Name - 2km, ICU: 5│ │
│  │    (Leaflet)         │  2. Hospital Name - 3km, ICU: 3│ │
│  │                      │  3. Hospital Name - 5km, ICU: 2│ │
│  │                      │  [Click to view on map]         │ │
│  └──────────────────────┴─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│    ROUTE ANALYSIS - SHORTEST VS LONGEST TRAFFIC ROUTES      │
│                                                              │
│  From: [Location Input] | To: [Location Input]             │
│  [ANALYZE ROUTES] [TOGGLE TRAFFIC]                         │
│                                                              │
│  ┌──────────────────────┬──────────────────────────────┐   │
│  │       MAP            │ SHORTEST ROUTE      LONGEST  │   │
│  │   (with routes)      │ ┌───────────────┐ ┌──────┐  │   │
│  │                      │ │ 🟢 ROUTE      │ │🔴RTE │  │   │
│  │  Green: Shortest     │ │ 5.2 km        │ │8.7 km│  │   │
│  │  Red: Longest        │ │ 12 min        │ │25 min│  │   │
│  │  Blue: Start         │ │ 15 min ETA    │ │30 ETA│  │   │
│  │  Red: End            │ │ Light Traffic │ │Heavy │  │   │
│  │                      │ │[SELECT ROUTE] │ │[AVOID]│  │   │
│  │                      │ └───────────────┘ └──────┘  │   │
│  └──────────────────────┴──────────────────────────────┘   │
│                                                              │
│  ⚠️ TRAFFIC ADVISORY                                        │
│  Critical Time Difference: 15 more minutes on longest route!│
│  Always prioritize shortest route for emergency response.   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         AVAILABLE EMERGENCY DOCTORS DASHBOARD               │
│                                                              │
│  [ALL] [CARDIOLOGY ❤️] [NEUROLOGY 🧠] [TRAUMA 🚑] [RESP 🫁]│
│                                                              │
│  ┌─────────────────┬──────────────────┬──────────────────┐ │
│  │ Total: 8        │ On Duty: 6       │ Avg Rating: 4.8 │ │
│  └─────────────────┴──────────────────┴──────────────────┘ │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  👨‍⚕️  Dr. Raj │  │  👩‍⚕️ Dr. Priya │  │  👨‍⚕️ Dr. Amit │     │
│  │  Cardiology  │  │  Neurology   │  │  Trauma      │     │
│  │  15 yrs      │  │  12 yrs      │  │  18 yrs      │     │
│  │  ⭐ 4.8/5.0  │  │  ⭐ 4.9/5.0  │  │  ⭐ 4.7/5.0 │     │
│  │  City Gen    │  │  Metro Med   │  │  Regional    │     │
│  │  🟢 On Duty  │  │  🟢 On Duty  │  │  🟡 Off Duty│     │
│  │[CALL][VIDEO] │  │[CALL][VIDEO] │  │[CALL][VIDEO]│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  [More Doctor Cards...]                                     │
└─────────────────────────────────────────────────────────────┘

                          FOOTER
```

---

## 📍 Color Scheme

| Element | Color | Meaning |
|---------|-------|---------|
| Shortest Route | 🟢 Green (#4caf50) | Fast, Recommended |
| Longest Route | 🔴 Red (#f44336) | Slow, Avoid |
| Ambulance Start | 🔵 Blue (#1976d2) | Pickup Location |
| Hospital End | 🟠 Orange (#ff5722) | Destination |
| Available Doctor | 🟢 Green | On Duty |
| Off Duty Doctor | 🟡 Orange | Not Available |
| Traffic Light | 🟡 Amber | Caution |

---

## 🎯 Key Interactions

### Route Analysis Flow:
```
1. Enter Locations
   ↓
2. Click "Analyze Routes"
   ↓
3. Wait for Map Load (2-5 sec)
   ↓
4. See Two Routes:
   • Shortest (Green, Solid)
   • Longest (Red, Dashed)
   ↓
5. Compare Metrics
   • Distance (km)
   • Duration (min)
   • ETA (min)
   • Traffic Level
   ↓
6. Select Route
   • "Select This Route" → Use Shortest
   • "Avoid This Route" → Skip Longest
```

### Doctor Dashboard Flow:
```
1. Scroll to Doctor Section
   ↓
2. Choose Filter:
   • All Doctors
   • Cardiology
   • Neurology
   • Trauma
   • Respiratory
   ↓
3. View Doctor Cards:
   • Name & Avatar
   • Specialty
   • Experience
   • Rating
   • Hospital
   • Status
   ↓
4. Take Action:
   • [CALL] → Contact Doctor
   • [VIDEO] → Request Consultation
```

---

## 🗺️ Map Features

### Shortest Route Visualization
```
    Hospital (🏥)
        ↑
        | 5.2 km (Green)
        | 12 min
        |
    [Starting Point]

Legend:
━━━━━━ = Shortest Route (4px, solid, 80% opacity)
- - - - = Longest Route (4px, dashed, 60% opacity)
```

### Route Comparison
```
SHORTEST ROUTE        |    LONGEST ROUTE
─────────────────────────────────────────
5.2 km                |    8.7 km
12 min                |    25 min
15 min ETA            |    30 min ETA
Light Traffic         |    Heavy Traffic
✓ RECOMMENDED         |    ✗ AVOID
```

---

## 📊 Doctor Card Components

```
┌─────────────────────────────────────┐
│  [👨‍⚕️]  Dr. Name                    │
│         Experience: 15 years        │
│         Rating: ⭐⭐⭐⭐⭐ 4.8/5.0  │
├─────────────────────────────────────┤
│  Specialty: Cardiology              │
│  Hospital: City General             │
│  Status: 🟢 On Duty                 │
├─────────────────────────────────────┤
│  [CALL]  [REQUEST VIDEO CONSULT]   │
└─────────────────────────────────────┘
```

---

## 🎨 Button States

### Primary Buttons
```
Normal:    [ANALYZE ROUTES]  (Blue background)
Hover:     [ANALYZE ROUTES]  (Darker blue, shadow)
Active:    [ANALYZING...]    (Loading state)
```

### Secondary Buttons
```
Normal:    [TOGGLE TRAFFIC]  (Gray background)
Hover:     [TOGGLE TRAFFIC]  (Darker gray, shadow)
Active:    [TRAFFIC ON]      (Green background)
```

### Specialty Filters
```
Normal:    [CARDIOLOGY]      (Gray)
Active:    [CARDIOLOGY]      (Blue)
```

---

## 📱 Responsive Breakpoints

### Desktop (1200px+)
- 4-column doctor grid
- Side-by-side route cards
- Full-size map

### Tablet (768px - 1199px)
- 2-column doctor grid
- Stacked route cards
- Medium map

### Mobile (< 768px)
- 1-column doctor grid
- Full-width cards
- Mobile-optimized map

---

## ⚡ Performance Tips

1. **Map Loading**: Takes 1-2 seconds initially
2. **Route Calculation**: Expect 3-5 second delay
3. **Doctor Rendering**: Instant filter switching
4. **API Calls**: Asynchronous, non-blocking

---

## 🔧 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Map not showing | Refresh page, check internet |
| Routes not calculated | Verify address format |
| Doctors not displayed | Clear cache, reload page |
| Buttons not responding | Check browser console |
| Traffic layer not working | OSRM service may be down |

---

## 📋 Statistics Panel

```
┌────────────────┬────────────────┬────────────────┐
│ TOTAL DOCTORS  │ ON DUTY NOW    │ AVG RATING     │
│     8          │      6         │    4.8/5.0     │
└────────────────┴────────────────┴────────────────┘
```

Updates automatically when filters applied.

---

## 🚨 Traffic Advisory Levels

### Critical Difference (>10 min)
```
⚠️  CRITICAL TIME DIFFERENCE
The longest route takes 15 minutes MORE.
ACTION: Always select shortest route for emergencies!
```

### Significant Difference (5-10 min)
```
⚠️  SIGNIFICANT TIME DIFFERENCE  
The longest route takes 8 minutes MORE.
RECOMMENDATION: Use shortest route for faster arrival.
```

### Similar Routes (<5 min)
```
✓   SIMILAR ROUTES
Both routes take approximately the same time.
NOTE: Choose based on current traffic conditions.
```

---

## 🎓 Feature Usage Examples

### Example 1: Emergency Route Analysis
```
User: "I need ambulance from 123 Main St to City Hospital"
1. Enters "123 Main St" in From field
2. Enters "City Hospital" in To field
3. Clicks "Analyze Routes"
4. Map shows two routes:
   - Shortest: 5.2 km, 15 min ETA (Recommended)
   - Longest: 8.7 km, 30 min ETA (Avoid)
5. Traffic advisory warns: "15 min difference!"
6. Clicks "Select This Route" on shortest
7. System confirms: "Shortest route selected for ambulance"
```

### Example 2: Doctor Selection
```
User: "I need an emergency cardiologist"
1. Scrolls to "Available Emergency Doctors"
2. Clicks "[CARDIOLOGY ❤️]" filter button
3. Dashboard updates showing 2 cardiology doctors:
   - Dr. Rajesh Kumar (15 yrs, 4.8★, On Duty) ✓
   - Dr. Vikram Gupta (20 yrs, 4.9★, On Duty) ✓
4. Clicks [CALL] on Dr. Vikram Gupta
5. System: "Calling Dr. Vikram Gupta at 9876543214..."
6. Doctor assignment confirmed to ambulance
```

---

**Last Updated**: November 30, 2025
**Version**: 1.0
**Status**: Complete ✓
