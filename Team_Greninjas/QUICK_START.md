# 🚑 Ambulance Booking Page - Quick Start Guide

## Getting Started

### 1. Access the Page
- Navigate to `.vscode/ambulancebooking.html` in your browser
- Page loads with full functionality
- Map initializes automatically with default location

### 2. Main Sections

#### A. Ambulance Booking Form (Top)
- Select emergency type
- Enter pickup location or use GPS
- Choose destination hospital (optional)
- Enter patient details
- Click "REQUEST AMBULANCE NOW"

#### B. Hospital Map & Nearby List (Middle)
- Interactive map showing nearby hospitals
- Hospital information sidebar
- Real-time availability (beds, ICU)
- Click hospital to view details

#### C. Route Analysis Section
- **NEW**: Enter two locations
- **NEW**: See shortest (green) vs longest (red) routes
- **NEW**: Compare time and distance
- **NEW**: Read traffic advisory
- Select best route for ambulance

#### D. Emergency Doctor Dashboard (Bottom)
- **NEW**: Browse available doctors
- **NEW**: Filter by specialty
- **NEW**: See ratings and experience
- **NEW**: Call or request consultation

---

## Step-by-Step Usage

### To Analyze Routes:
```
1. Scroll to "Route Analysis" section
2. Enter starting location (or auto-filled from form)
3. Enter hospital destination
4. Click [ANALYZE ROUTES]
5. Wait 3-5 seconds for calculation
6. View both routes on interactive map
7. Compare metrics in colored cards
8. Click [SELECT THIS ROUTE] for shortest
```

### To Find Emergency Doctor:
```
1. Scroll to "Available Emergency Doctors"
2. Click specialty filter:
   • [CARDIOLOGY ❤️] - Heart emergencies
   • [NEUROLOGY 🧠] - Brain/stroke emergencies
   • [TRAUMA 🚑] - Accident emergencies
   • [RESPIRATORY 🫁] - Breathing emergencies
3. Review doctor cards
4. Check rating, experience, status
5. Click [CALL] to contact
6. Click [VIDEO] for consultation
```

---

## Key Features at a Glance

| Feature | Location | Action |
|---------|----------|--------|
| 🚑 Book Ambulance | Top Form | Fill form + Click button |
| 🗺️ View Map | Middle | Shows hospitals within 8km |
| 🛣️ Analyze Routes | Below map | Enter 2 addresses + Analyze |
| 👨‍⚕️ Find Doctors | Bottom | Browse or filter by specialty |
| ⭐ Doctor Rating | Cards | Shows 0-5.0 rating |
| 📞 Call Doctor | Cards | Direct contact button |
| 📹 Consult Doctor | Cards | Video call request |

---

## Understanding Route Comparison

### Shortest Route (Green)
- ✓ **Recommended for emergencies**
- Solid green line on map
- Quickest time to hospital
- Example: 5.2 km, 15 min ETA

### Longest Route (Red)
- ✗ **Route to avoid**
- Dashed red line on map
- Takes significantly longer
- Example: 8.7 km, 30 min ETA

### Comparison Card
```
Shortest: 5.2 km | 15 min ETA | Light Traffic
Longest:  8.7 km | 30 min ETA | Heavy Traffic
Difference: +15 minutes on longest route!
```

---

## Doctor Status Indicators

### 🟢 On Duty
- Available for emergency response
- Can be called immediately
- Recommended for urgent cases

### 🟡 Off Duty
- Not currently available
- Check for on-duty doctors in same specialty
- May accept consultation requests

---

## Traffic Advisory Meanings

### ⚠️ Critical (>10 min difference)
```
Red alert - Massive time difference
ACTION: Always use shortest route
EXAMPLE: "15 more minutes on longest route"
```

### ⚠️ Warning (5-10 min difference)
```
Orange alert - Significant time difference
ACTION: Recommend shortest route
EXAMPLE: "8 more minutes on longest route"
```

### ✓ Info (<5 min difference)
```
Green info - Similar times
ACTION: Choose based on conditions
EXAMPLE: "Both routes similar in time"
```

---

## Interactive Map Controls

### Zoom
- **+** Button: Zoom in
- **-** Button: Zoom out
- **Scroll**: Wheel to zoom

### Pan
- **Click & Drag**: Move map around
- **Double Click**: Center on that point

### Markers
- **Shortest Route**: Green solid line
- **Longest Route**: Red dashed line
- **Pickup Location**: Blue circle marker
- **Hospital**: Red circle marker
- **Click marker**: View location details

---

## Color Legend

```
🟢 GREEN
  ├─ Shortest route
  ├─ Available/Light traffic
  └─ Recommended action

🟡 ORANGE
  ├─ Longest route alternative
  ├─ Off-duty doctor
  ├─ Moderate traffic
  └─ Caution needed

🔴 RED
  ├─ Longest route to avoid
  ├─ Heavy traffic
  └─ Not recommended

🔵 BLUE
  ├─ Pickup location
  └─ Your location

🟠 ORANGE/RED
  ├─ Hospital destination
  └─ Final destination
```

---

## Common Scenarios

### Scenario 1: Cardiac Emergency
```
Action Flow:
1. Fill emergency type: "Cardiac Emergency"
2. Enter pickup location
3. Select hospital
4. Click "Analyze Routes"
5. Review fastest route (critical!)
6. Filter doctors: "CARDIOLOGY"
7. Select highly-rated cardiologist
8. Request ambulance with doctor assignment
```

### Scenario 2: Traffic Jam Situation
```
Action Flow:
1. Analyze routes normally
2. See 20+ minute difference between routes
3. Read traffic advisory: "Critical difference!"
4. Choose shortest route despite congestion
5. Ambulance knows to use sirens/lights
6. Updates hospital via system
```

### Scenario 3: Multiple Specialists Available
```
Action Flow:
1. Open ambulance booking
2. Scroll to doctor section
3. Click [ALL DOCTORS] filter
4. Browse all 8 available doctors
5. Check ratings and experience
6. Select doctor with highest rating
7. Request consultation while ambulance en route
```

---

## Troubleshooting Tips

### Map Won't Load?
- ✓ Check internet connection
- ✓ Refresh page (Ctrl+R)
- ✓ Clear cache (Ctrl+Shift+Delete)
- ✓ Try different browser

### Routes Not Calculating?
- ✓ Check address format (try street + city)
- ✓ Use well-known landmarks
- ✓ Try addresses in same city
- ✓ Verify internet speed

### Doctors Not Showing?
- ✓ Refresh page
- ✓ Clear browser cache
- ✓ Check browser console (F12)
- ✓ Try different browser

### Buttons Not Working?
- ✓ Enable JavaScript in browser
- ✓ Check browser compatibility (Chrome/Firefox)
- ✓ Disable ad blockers
- ✓ Hard refresh (Ctrl+Shift+R)

---

## Performance Tips

- **First load**: 4-8 seconds (API initialization)
- **Route analysis**: 3-5 seconds (routing calculation)
- **Subsequent loads**: 1-2 seconds (cached data)
- **Mobile**: May take longer on slow networks

---

## Browser Requirements

✓ Chrome/Chromium 90+
✓ Firefox 88+
✓ Safari 14+
✓ Edge 90+
✓ Mobile browsers (iOS/Android)

---

## API Services

The page uses these free services:

1. **OpenStreetMap** - Maps
2. **OSRM** - Route calculation
3. **Nominatim** - Address to coordinates
4. **Leaflet.js** - Interactive mapping

All free, no API keys needed!

---

## Statistics Available

### Doctor Dashboard Stats
- **Total Available**: Count of doctors available
- **On Duty Now**: Doctors actively working
- **Average Rating**: All doctors' rating average

### Route Stats
- **Distance**: In kilometers
- **Duration**: Base time without traffic
- **ETA**: Time with traffic factor
- **Speed**: Average km/h

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Ctrl+R | Refresh page |
| F12 | Developer tools |
| Ctrl+F | Find on page |
| Tab | Navigate between fields |
| Enter | Submit form |
| Esc | Close popups |

---

## Mobile Optimization

✓ Responsive design for all screen sizes
✓ Touch-friendly buttons
✓ Mobile-optimized maps
✓ Vertical layout on small screens
✓ Optimized for landscape/portrait

---

## Support

- Check `AMBULANCE_FEATURES.md` for detailed docs
- See `VISUAL_GUIDE.md` for UI breakdown
- Review `IMPLEMENTATION_SUMMARY.md` for tech details

---

## Quick Reference Card

```
╔════════════════════════════════════════╗
║  AMBULANCE BOOKING QUICK REFERENCE     ║
╠════════════════════════════════════════╣
║ 🚑 Book Ambulance: Top Form Section   ║
║ 🗺️ View Map: Middle Interactive Map   ║
║ 🛣️ Routes: Route Analysis Section     ║
║ 👨‍⚕️ Doctors: Bottom Dashboard         ║
║                                        ║
║ Green = Recommended ✓                 ║
║ Red = Avoid ✗                         ║
║ Orange = Off-duty/Caution ⚠️           ║
║                                        ║
║ Load time: 4-8 sec (first)            ║
║ Route time: 3-5 sec                   ║
║ Doctor load: <1 sec                   ║
╚════════════════════════════════════════╝
```

---

**Version**: 1.0 (November 30, 2025)
**Status**: Ready to Use ✓
**Support**: Full documentation provided
