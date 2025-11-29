import { Play, Square, Shuffle } from 'lucide-react';

interface ControlPanelProps {
  isSimulating: boolean;
  onRandomFire: () => void;
  onStop: () => void;
}

export function ControlPanel({ isSimulating, onRandomFire, onStop }: ControlPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-gray-900 mb-4">Simulation Controls</h3>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRandomFire}
          disabled={isSimulating}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            isSimulating
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300'
          }`}
        >
          <Shuffle className="w-4 h-4" />
          Simulate Random Fire
        </button>

        {isSimulating && (
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 transition-all"
          >
            <Square className="w-4 h-4" />
            Stop Simulation
          </button>
        )}
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Tip:</strong> Click any sensor on the grid to view details, or use
          the "Simulate Random Fire" button to start a fire detection simulation.
        </p>
      </div>
    </div>
  );
}
