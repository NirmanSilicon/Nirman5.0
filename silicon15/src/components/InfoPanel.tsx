import { Thermometer, Wind, Activity, AlertCircle, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import type { Sensor, FireSource, ForestLocation } from '../App';

interface InfoPanelProps {
  sensors: Sensor[];
  fireSource: FireSource | null;
  detectedOrigin: { q: number; r: number } | null;
  isSimulating: boolean;
  selectedSensor: Sensor | null;
  currentLocation: ForestLocation;
}

export function InfoPanel({ sensors, fireSource, detectedOrigin, isSimulating, selectedSensor, currentLocation }: InfoPanelProps) {
  const activeSensors = sensors.filter((s) => s.isActive).length;
  const alertSensors = sensors.filter((s) => s.alertLevel !== 'none').length;
  const avgTemperature =
    sensors.reduce((sum, s) => sum + s.temperature, 0) / sensors.length || 0;
  const maxTemperature = Math.max(...sensors.map((s) => s.temperature), 0);

  return (
    <div className="space-y-4">
      {/* Current Location Info */}
      <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-green-600" />
          <h3 className="text-gray-900">Current Location</h3>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Forest Area</p>
            <p className="text-gray-900">{currentLocation.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">State</p>
            <p className="text-gray-900">{currentLocation.state}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Latitude</p>
              <p className="text-gray-900">{currentLocation.lat.toFixed(4)}°N</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Longitude</p>
              <p className="text-gray-900">{currentLocation.lng.toFixed(4)}°E</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Total Sensors</p>
            <p className="text-gray-900">{sensors.length} active sensors</p>
          </div>
        </div>
      </div>

      {/* Selected Sensor Info */}
      {selectedSensor && (
        <motion.div
          className="bg-white rounded-xl shadow-lg border border-blue-200 p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">Selected Sensor</h3>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sensor ID</p>
              <p className="text-gray-900">{selectedSensor.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Latitude</p>
                <p className="text-gray-900">{selectedSensor.lat.toFixed(6)}°</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Longitude</p>
                <p className="text-gray-900">{selectedSensor.lng.toFixed(6)}°</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Temperature</p>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-orange-600" />
                  <p className="text-gray-900">{selectedSensor.temperature.toFixed(1)}°C</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Smoke Level</p>
                <div className="flex items-center gap-1">
                  <Wind className="w-4 h-4 text-gray-600" />
                  <p className="text-gray-900">{selectedSensor.smokeLevel.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Alert Status</p>
              <div
                className={`inline-flex px-3 py-1 rounded-full text-sm ${
                  selectedSensor.alertLevel === 'high'
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : selectedSensor.alertLevel === 'medium'
                    ? 'bg-orange-100 text-orange-700 border border-orange-300'
                    : selectedSensor.alertLevel === 'low'
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    : 'bg-green-100 text-green-700 border border-green-300'
                }`}
              >
                {selectedSensor.alertLevel === 'none' ? 'Normal' : selectedSensor.alertLevel.toUpperCase()}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">System Status</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Active Sensors</span>
            </div>
            <span className="text-gray-900">{activeSensors}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="text-gray-700">Alert Sensors</span>
            </div>
            <span className="text-gray-900">{alertSensors}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Avg Temperature</span>
            </div>
            <span className="text-gray-900">{avgTemperature.toFixed(1)}°C</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-red-600" />
              <span className="text-gray-700">Max Temperature</span>
            </div>
            <span className="text-gray-900">{maxTemperature.toFixed(1)}°C</span>
          </div>
        </div>
      </div>

      {/* Detection Results */}
      {isSimulating && (
        <motion.div
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-gray-900 mb-4">Detection Results</h3>

          <div className="space-y-4">
            {fireSource && (
              <div>
                <p className="text-gray-600 text-sm mb-1">Actual Fire Location</p>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-red-100 border border-red-300 rounded-lg">
                    <span className="text-red-700">
                      Q: {fireSource.q}, R: {fireSource.r}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {detectedOrigin ? (
              <div>
                <p className="text-gray-600 text-sm mb-1">Detected Origin</p>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-blue-100 border border-blue-300 rounded-lg">
                    <span className="text-blue-700">
                      Q: {detectedOrigin.q}, R: {detectedOrigin.r}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-3 py-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-yellow-700 text-sm">
                  Analyzing sensor data... Need more readings for triangulation.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">How It Works</h3>

        <div className="space-y-3 text-gray-700 text-sm">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 border border-green-500 flex items-center justify-center text-green-700">
              1
            </div>
            <p>
              Sensors are deployed in a hexagonal pattern for optimal coverage and triangulation.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 border border-green-500 flex items-center justify-center text-green-700">
              2
            </div>
            <p>
              Each sensor monitors temperature and smoke levels in real-time.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 border border-green-500 flex items-center justify-center text-green-700">
              3
            </div>
            <p>
              When fire is detected, multiple sensors measure intensity based on distance.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 border border-green-500 flex items-center justify-center text-green-700">
              4
            </div>
            <p>
              The system uses triangulation to calculate the fire origin with high accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
