import { useState, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { InfoPanel } from './components/InfoPanel';
import { MapView } from './components/MapView';
import { LocationSelector } from './components/LocationSelector';
import { Flame, AlertTriangle } from 'lucide-react';

export interface Sensor {
  id: string;
  q: number; // axial coordinate
  r: number; // axial coordinate
  lat: number; // latitude
  lng: number; // longitude
  temperature: number;
  smokeLevel: number;
  isActive: boolean;
  alertLevel: 'none' | 'low' | 'medium' | 'high';
}

export interface FireSource {
  q: number;
  r: number;
  intensity: number;
}

export interface ForestLocation {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export const FOREST_LOCATIONS: ForestLocation[] = [
  {
    id: 'kanha',
    name: 'Kanha National Park',
    state: 'Madhya Pradesh',
    lat: 22.3351,
    lng: 80.6119,
  },
  {
    id: 'corbett',
    name: 'Jim Corbett National Park',
    state: 'Uttarakhand',
    lat: 29.5308,
    lng: 78.7739,
  },
  {
    id: 'bandipur',
    name: 'Bandipur National Park',
    state: 'Karnataka',
    lat: 11.6643,
    lng: 76.5764,
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans National Park',
    state: 'West Bengal',
    lat: 21.9497,
    lng: 89.1833,
  },
  {
    id: 'kaziranga',
    name: 'Kaziranga National Park',
    state: 'Assam',
    lat: 26.5775,
    lng: 93.1711,
  },
  {
    id: 'periyar',
    name: 'Periyar National Park',
    state: 'Kerala',
    lat: 9.4647,
    lng: 77.2350,
  },
  {
    id: 'ranthambore',
    name: 'Ranthambore National Park',
    state: 'Rajasthan',
    lat: 26.0173,
    lng: 76.5026,
  },
  {
    id: 'gir',
    name: 'Gir National Park',
    state: 'Gujarat',
    lat: 21.1258,
    lng: 70.7972,
  },
  {
    id: 'simlipal',
    name: 'Simlipal National Park',
    state: 'Odisha',
    lat: 21.7326,
    lng: 86.2586,
  },
  {
    id: 'betla',
    name: 'Betla National Park',
    state: 'Jharkhand',
    lat: 23.8788,
    lng: 84.1919,
  },
];

export default function App() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [fireSource, setFireSource] = useState<FireSource | null>(null);
  const [detectedOrigin, setDetectedOrigin] = useState<{ q: number; r: number } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [currentLocation, setCurrentLocation] = useState<ForestLocation>(FOREST_LOCATIONS[0]);

  const latSpacing = 0.002; // approximately 220 meters
  const lngSpacing = 0.0023; // approximately 220 meters

  // Convert hex coordinates to lat/lng based on current location
  const hexToLatLng = (q: number, r: number) => {
    const x = lngSpacing * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
    const y = latSpacing * ((3 / 2) * r);
    return {
      lat: currentLocation.lat + y,
      lng: currentLocation.lng + x,
    };
  };

  // Initialize hexagonal grid of sensors
  const initializeSensors = () => {
    const gridRadius = 4;
    const newSensors: Sensor[] = [];

    for (let q = -gridRadius; q <= gridRadius; q++) {
      const r1 = Math.max(-gridRadius, -q - gridRadius);
      const r2 = Math.min(gridRadius, -q + gridRadius);
      for (let r = r1; r <= r2; r++) {
        const { lat, lng } = hexToLatLng(q, r);
        newSensors.push({
          id: `sensor-${q}-${r}`,
          q,
          r,
          lat,
          lng,
          temperature: 20 + Math.random() * 5, // Normal temperature
          smokeLevel: 0,
          isActive: true,
          alertLevel: 'none',
        });
      }
    }

    setSensors(newSensors);
  };

  // Initialize sensors on mount and when location changes
  useEffect(() => {
    initializeSensors();
    // Reset simulation state when changing location
    setIsSimulating(false);
    setFireSource(null);
    setDetectedOrigin(null);
    setSelectedSensor(null);
  }, [currentLocation]);

  // Calculate distance between two hexagonal coordinates
  const hexDistance = (q1: number, r1: number, q2: number, r2: number) => {
    return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
  };

  // Update sensor readings based on fire source
  useEffect(() => {
    if (!fireSource || !isSimulating) return;

    const interval = setInterval(() => {
      setSensors((prevSensors) =>
        prevSensors.map((sensor) => {
          const distance = hexDistance(sensor.q, sensor.r, fireSource.q, fireSource.r);
          const maxDistance = 6;

          if (distance <= maxDistance) {
            // Calculate temperature and smoke based on distance
            const falloff = 1 - distance / maxDistance;
            const temperature = 20 + (fireSource.intensity * 80 * falloff) + Math.random() * 10;
            const smokeLevel = fireSource.intensity * falloff * 100 + Math.random() * 10;

            let alertLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
            if (temperature > 40 || smokeLevel > 30) alertLevel = 'low';
            if (temperature > 60 || smokeLevel > 60) alertLevel = 'medium';
            if (temperature > 80 || smokeLevel > 80) alertLevel = 'high';

            return {
              ...sensor,
              temperature,
              smokeLevel,
              alertLevel,
            };
          }

          return {
            ...sensor,
            temperature: 20 + Math.random() * 5,
            smokeLevel: Math.max(0, sensor.smokeLevel - 5),
            alertLevel: 'none',
          };
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [fireSource, isSimulating]);

  // Detect fire origin using triangulation
  useEffect(() => {
    if (!isSimulating) return;

    const highAlertSensors = sensors.filter(
      (s) => s.alertLevel === 'high' || s.alertLevel === 'medium'
    );

    if (highAlertSensors.length >= 3) {
      // Use weighted average based on alert levels
      let totalWeight = 0;
      let weightedQ = 0;
      let weightedR = 0;

      highAlertSensors.forEach((sensor) => {
        const weight = sensor.alertLevel === 'high' ? 3 : sensor.alertLevel === 'medium' ? 2 : 1;
        totalWeight += weight;
        weightedQ += sensor.q * weight;
        weightedR += sensor.r * weight;
      });

      setDetectedOrigin({
        q: Math.round(weightedQ / totalWeight),
        r: Math.round(weightedR / totalWeight),
      });
    } else {
      setDetectedOrigin(null);
    }
  }, [sensors, isSimulating]);

  const startFireSimulation = (q: number, r: number) => {
    setFireSource({ q, r, intensity: 1 });
    setIsSimulating(true);
    setSelectedSensor(null);
  };

  const handleSensorSelect = (sensor: Sensor) => {
    if (!isSimulating) {
      setSelectedSensor(sensor);
    }
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    setFireSource(null);
    setDetectedOrigin(null);
    setSensors((prevSensors) =>
      prevSensors.map((sensor) => ({
        ...sensor,
        temperature: 20 + Math.random() * 5,
        smokeLevel: 0,
        alertLevel: 'none',
      }))
    );
  };

  const randomFire = () => {
    const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
    startFireSimulation(randomSensor.q, randomSensor.r);
  };

  const handleLocationChange = (locationId: string) => {
    const location = FOREST_LOCATIONS.find(loc => loc.id === locationId);
    if (location) {
      setCurrentLocation(location);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-orange-600" />
              <div>
                <h1 className="text-gray-900">Forest Fire Detection System</h1>
                <p className="text-gray-600 text-sm">Real-time Sensor Network Monitoring - India</p>
              </div>
            </div>
            <LocationSelector
              locations={FOREST_LOCATIONS}
              currentLocation={currentLocation}
              onLocationChange={handleLocationChange}
              disabled={isSimulating}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Info */}
          <div className="lg:col-span-1 space-y-6">
            <InfoPanel
              sensors={sensors}
              fireSource={fireSource}
              detectedOrigin={detectedOrigin}
              isSimulating={isSimulating}
              selectedSensor={selectedSensor}
              currentLocation={currentLocation}
            />
          </div>

          {/* Right - Map and Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Geographic Map View */}
            <MapView
              sensors={sensors}
              selectedSensor={selectedSensor}
              fireSource={fireSource}
              detectedOrigin={detectedOrigin}
              onSensorSelect={handleSensorSelect}
              currentLocation={currentLocation}
            />

            {/* Control Panel */}
            <ControlPanel
              isSimulating={isSimulating}
              onRandomFire={randomFire}
              onStop={stopSimulation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
