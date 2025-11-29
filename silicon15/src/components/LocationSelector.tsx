import { MapPin } from 'lucide-react';
import { ForestLocation } from '../App';

interface LocationSelectorProps {
  locations: ForestLocation[];
  currentLocation: ForestLocation;
  onLocationChange: (locationId: string) => void;
  disabled?: boolean;
}

export function LocationSelector({
  locations,
  currentLocation,
  onLocationChange,
  disabled = false,
}: LocationSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <MapPin className="w-5 h-5 text-green-600" />
      <select
        value={currentLocation.id}
        onChange={(e) => onLocationChange(e.target.value)}
        disabled={disabled}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}, {location.state}
          </option>
        ))}
      </select>
    </div>
  );
}
