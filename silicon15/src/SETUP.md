# Forest Fire Detection System - Setup Guide

## Google Maps Integration Setup

This application uses Google Maps to display sensor locations geographically. To enable the map view, you need to set up a Google Maps API key.

### Steps to Get Your API Key:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/google/maps-apis

2. **Create a New Project** (if you don't have one)
   - Click "Select a project" → "New Project"
   - Give it a name (e.g., "Fire Detection System")
   - Click "Create"

3. **Enable Required APIs**
   - In the search bar, search for "Maps JavaScript API"
   - Click on it and press "Enable"
   - Also search for and enable "Maps SDK for Android" if you want to use advanced markers

4. **Create API Credentials**
   - Go to "Credentials" in the left menu
   - Click "Create Credentials" → "API Key"
   - Copy your new API key

5. **Restrict Your API Key** (Recommended for security)
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:*` for local development)
   - Under "API restrictions", select "Restrict key"
   - Choose "Maps JavaScript API"
   - Click "Save"

6. **Add API Key to Your Application**
   - Open the file: `/components/useGoogleMaps.ts`
   - Find the line: `const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';`
   - Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key
   - Save the file

### Example:

```typescript
// Before
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// After
const GOOGLE_MAPS_API_KEY = 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

### Features Used:

This application uses:
- **Maps JavaScript API** - For displaying the map and markers
- **Advanced Marker Element** (Recommended) - Modern marker implementation
- **Legacy Marker** (Fallback) - For compatibility if Advanced Markers aren't available

The code automatically detects which marker API is available and uses the best option.

### Important Notes:

- **Billing**: Google Maps requires a billing account, but offers $200 free credit per month
- **Security**: Always restrict your API key to prevent unauthorized use
- **Testing**: For local development, you can use `localhost` restrictions
- **Production**: Update restrictions to match your production domain

### Troubleshooting:

If the map doesn't load:
1. Check browser console for errors
2. Verify your API key is correct
3. Ensure Maps JavaScript API is enabled in Google Cloud Console
4. Check that your domain is whitelisted in API key restrictions
5. Verify billing is set up in Google Cloud Console

## Features Overview

### Hexagonal Sensor Grid
- 61 sensors arranged in a hexagonal pattern
- Click any sensor to view its details including latitude and longitude
- Color-coded alert levels (green, yellow, orange, red)

### Fire Detection Simulation
- Click "Simulate Random Fire" to start a fire event
- Sensors detect fire based on distance and display heat/smoke readings
- System triangulates fire origin using multiple sensor readings
- Accuracy percentage shows how close the detection is to actual fire location

### Geographic Map View
- Shows real sensor locations on Google Maps (Yosemite National Park area)
- Satellite view for better context
- Interactive markers that sync with sensor selection
- Fire source and detected origin visualization

### Sensor Information
- Real-time temperature and smoke level readings
- GPS coordinates (latitude/longitude)
- Alert status for each sensor
- System-wide statistics

## Location Details

The sensors are positioned in the Yosemite National Park area:
- **Center coordinates**: 37.8651° N, 119.5383° W
- **Coverage area**: Approximately 2.5 km² hexagonal grid
- **Sensor spacing**: ~220 meters between adjacent sensors
