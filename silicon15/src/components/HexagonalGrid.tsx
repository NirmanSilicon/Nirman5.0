import { motion } from 'motion/react';
import { Flame, MapPin } from 'lucide-react';
import type { Sensor, FireSource } from '../App';

interface HexagonalGridProps {
  sensors: Sensor[];
  fireSource: FireSource | null;
  detectedOrigin: { q: number; r: number } | null;
  onHexClick: (q: number, r: number) => void;
  onSensorSelect: (sensor: Sensor) => void;
  selectedSensor: Sensor | null;
  isSimulating: boolean;
}

export function HexagonalGrid({
  sensors,
  fireSource,
  detectedOrigin,
  onHexClick,
  onSensorSelect,
  selectedSensor,
  isSimulating,
}: HexagonalGridProps) {
  // Convert axial coordinates to pixel coordinates
  const hexToPixel = (q: number, r: number, size: number) => {
    const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
    const y = size * ((3 / 2) * r);
    return { x, y };
  };

  const hexSize = 30;
  const centerX = 300;
  const centerY = 300;

  // Get color based on alert level
  const getHexColor = (sensor: Sensor) => {
    if (!isSimulating) return '#22c55e'; // green-500

    switch (sensor.alertLevel) {
      case 'high':
        return '#dc2626'; // red-600
      case 'medium':
        return '#f97316'; // orange-500
      case 'low':
        return '#eab308'; // yellow-500
      default:
        return '#22c55e'; // green-500
    }
  };

  const handleHexClick = (sensor: Sensor) => {
    if (isSimulating) return;
    onSensorSelect(sensor);
  };

  // Create hexagon path
  const createHexagonPath = (size: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const x = size * Math.cos(angle);
      const y = size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')} Z`;
  };

  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto bg-green-50 rounded-xl overflow-hidden border border-gray-200">
      <svg
        viewBox="0 0 600 600"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05))' }}
      >
        {/* Render sensors */}
        {sensors.map((sensor) => {
          const { x, y } = hexToPixel(sensor.q, sensor.r, hexSize);
          const pixelX = centerX + x;
          const pixelY = centerY + y;
          const color = getHexColor(sensor);

          return (
            <g key={sensor.id}>
              <motion.path
                d={createHexagonPath(hexSize - 2)}
                transform={`translate(${pixelX}, ${pixelY})`}
                fill={color}
                stroke={
                  selectedSensor?.id === sensor.id
                    ? '#3b82f6'
                    : 'rgba(0, 0, 0, 0.15)'
                }
                strokeWidth={selectedSensor?.id === sensor.id ? '3' : '1.5'}
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  opacity: sensor.alertLevel === 'high' ? [1, 0.7, 1] : 1,
                }}
                transition={{
                  scale: { duration: 0.3 },
                  opacity: {
                    duration: 0.8,
                    repeat: sensor.alertLevel === 'high' ? Infinity : 0,
                  },
                }}
                className="cursor-pointer hover:opacity-80 transition-all"
                onClick={() => handleHexClick(sensor)}
                style={{ pointerEvents: 'auto' }}
              />

              {/* Temperature indicator for high alert */}
              {sensor.alertLevel === 'high' && (
                <motion.circle
                  cx={pixelX}
                  cy={pixelY}
                  r="8"
                  fill="#ff6b00"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </g>
          );
        })}

        {/* Render actual fire source */}
        {fireSource && (
          <g>
            {(() => {
              const { x, y } = hexToPixel(fireSource.q, fireSource.r, hexSize);
              const pixelX = centerX + x;
              const pixelY = centerY + y;

              return (
                <>
                  {/* Outer glow */}
                  <motion.circle
                    cx={pixelX}
                    cy={pixelY}
                    r="40"
                    fill="url(#fireGradient)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Fire icon */}
                  <motion.g
                    transform={`translate(${pixelX - 12}, ${pixelY - 12})`}
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <foreignObject width="24" height="24">
                      <Flame className="w-6 h-6 text-red-600" />
                    </foreignObject>
                  </motion.g>
                </>
              );
            })()}
          </g>
        )}

        {/* Render detected origin */}
        {detectedOrigin && (
          <g>
            {(() => {
              const { x, y } = hexToPixel(detectedOrigin.q, detectedOrigin.r, hexSize);
              const pixelX = centerX + x;
              const pixelY = centerY + y;

              return (
                <>
                  {/* Pulsing ring */}
                  <motion.circle
                    cx={pixelX}
                    cy={pixelY}
                    r="35"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />

                  {/* Pin icon */}
                  <motion.g
                    transform={`translate(${pixelX - 10}, ${pixelY - 10})`}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <foreignObject width="20" height="20">
                      <MapPin className="w-5 h-5 text-blue-400 fill-blue-400" />
                    </foreignObject>
                  </motion.g>
                </>
              );
            })()}
          </g>
        )}

        {/* Gradients */}
        <defs>
          <radialGradient id="fireGradient">
            <stop offset="0%" stopColor="#ff0000" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ff6b00" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffaa00" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Instructions overlay */}
      {!isSimulating && !selectedSensor && sensors.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="bg-gray-900/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white text-sm">Click any hexagon to view sensor details</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
