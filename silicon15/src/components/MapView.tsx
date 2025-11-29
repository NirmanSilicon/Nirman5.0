import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import L from 'leaflet@1.9.4';
import type { Sensor, FireSource, ForestLocation } from '../App';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  sensors: Sensor[];
  selectedSensor: Sensor | null;
  fireSource: FireSource | null;
  detectedOrigin: { q: number; r: number } | null;
  onSensorSelect: (sensor: Sensor) => void;
  currentLocation: ForestLocation;
}

export function MapView({
  sensors,
  selectedSensor,
  fireSource,
  detectedOrigin,
  onSensorSelect,
  currentLocation,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const fireMarkerRef = useRef<L.CircleMarker | null>(null);
  const detectedMarkerRef = useRef<L.CircleMarker | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map instance centered on current location
    const map = L.map(mapRef.current).setView([currentLocation.lat, currentLocation.lng], 14);

    // Add OpenStreetMap tile layer (satellite-style alternative)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    }).addTo(map);

    // Add optional labels overlay
    L.tileLayer('https://{s}.basemaps.cartocdn.com/only_labels/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
      maxZoom: 19,
      opacity: 0.7,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update sensor markers
  useEffect(() => {
    if (!mapInstanceRef.current || sensors.length === 0) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current = [];

    // Create new markers
    const newMarkers = sensors.map((sensor) => {
      const color =
        sensor.alertLevel === 'high'
          ? '#dc2626'
          : sensor.alertLevel === 'medium'
          ? '#f97316'
          : sensor.alertLevel === 'low'
          ? '#eab308'
          : '#22c55e';

      const radius = sensor.id === selectedSensor?.id ? 10 : 7;
      const weight = sensor.id === selectedSensor?.id ? 3 : 2;
      const strokeColor = sensor.id === selectedSensor?.id ? '#3b82f6' : '#ffffff';

      const marker = L.circleMarker([sensor.lat, sensor.lng], {
        radius: radius,
        fillColor: color,
        color: strokeColor,
        weight: weight,
        opacity: 1,
        fillOpacity: 1,
      }).addTo(map);

      marker.on('click', () => {
        onSensorSelect(sensor);
      });

      marker.bindTooltip(sensor.id, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
      });

      return marker;
    });

    markersRef.current = newMarkers;

    return () => {
      markersRef.current.forEach((marker) => {
        marker.remove();
      });
      markersRef.current = [];
    };
  }, [sensors, selectedSensor]);

  // Update map center when location changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    mapInstanceRef.current.setView([currentLocation.lat, currentLocation.lng], 14);
  }, [currentLocation]);

  // Update fire marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove existing fire marker
    if (fireMarkerRef.current) {
      fireMarkerRef.current.remove();
      fireMarkerRef.current = null;
    }

    if (fireSource) {
      const fireSensor = sensors.find((s) => s.q === fireSource.q && s.r === fireSource.r);
      if (fireSensor) {
        const marker = L.circleMarker([fireSensor.lat, fireSensor.lng], {
          radius: 15,
          fillColor: '#ff0000',
          color: '#ff6b00',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map);

        marker.bindTooltip('Fire Source', {
          permanent: false,
          direction: 'top',
          offset: [0, -15],
        });

        // Add pulsing effect
        let radius = 15;
        let growing = true;
        const pulseInterval = setInterval(() => {
          if (growing) {
            radius += 0.5;
            if (radius >= 18) growing = false;
          } else {
            radius -= 0.5;
            if (radius <= 15) growing = true;
          }
          marker.setRadius(radius);
        }, 100);

        fireMarkerRef.current = marker;
        (fireMarkerRef.current as any)._pulseInterval = pulseInterval;
      }
    }

    return () => {
      if (fireMarkerRef.current) {
        clearInterval((fireMarkerRef.current as any)._pulseInterval);
      }
    };
  }, [fireSource, sensors]);

  // Update detected origin marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove existing detected marker
    if (detectedMarkerRef.current) {
      detectedMarkerRef.current.remove();
      detectedMarkerRef.current = null;
    }

    if (detectedOrigin) {
      const detectedSensor = sensors.find(
        (s) => s.q === detectedOrigin.q && s.r === detectedOrigin.r
      );
      if (detectedSensor) {
        const marker = L.circleMarker([detectedSensor.lat, detectedSensor.lng], {
          radius: 12,
          fillColor: '#3b82f6',
          color: '#1d4ed8',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.6,
        }).addTo(map);

        marker.bindTooltip('Detected Fire Origin', {
          permanent: false,
          direction: 'top',
          offset: [0, -12],
        });

        detectedMarkerRef.current = marker;
      }
    }
  }, [detectedOrigin, sensors]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900">Geographic View - Satellite Map</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{currentLocation.name}, {currentLocation.state}</span>
        </div>
      </div>

      <div className="relative">
        <div ref={mapRef} className="w-full h-[500px] rounded-lg overflow-hidden bg-gray-100 z-0" />
      </div>

      {/* Map Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
          <span>Normal Sensor</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-white"></div>
          <span>Low Alert</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-orange-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span>Fire Source</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-800 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span>Detected Origin</span>
        </div>
      </div>
    </div>
  );
}
