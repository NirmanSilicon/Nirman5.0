import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { MapPin, Filter, Layers, AlertTriangle } from 'lucide-react';
import { dashboardService, handleApiError } from '../services/api';
import Loader from '../components/Loader';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Heatmap overlay component using leaflet.heat
const HeatmapOverlay = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    map.invalidateSize();

    const heatData = points.map(p => [p.latitude, p.longitude, p.weight]);

    // Check if L.heatLayer is available
    if (L.heatLayer) {
      const heatLayer = L.heatLayer(heatData, { radius: 25, blur: 15, maxZoom: 17 });
      heatLayer.addTo(map);
      return () => {
        map.removeLayer(heatLayer);
      };
    } else {
      console.error("L.heatLayer is not defined. Make sure leaflet.heat is imported correctly.");
    }
  }, [map, points]);

  return null;
};

const Heatmap = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [heatmapData, setHeatmapData] = useState([]);
  const [filters, setFilters] = useState({
    days: 30,
    category: 'all',
    status: 'all'
  });

  const categories = ['all', 'road', 'water', 'electricity', 'garbage', 'safety', 'health'];
  const statuses = ['all', 'pending', 'in_progress', 'resolved', 'rejected'];

  useEffect(() => {
    loadHeatmapData();
  }, [filters]);

  const loadHeatmapData = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.status !== 'all') params.status = filters.status;
      params.days = filters.days;

      const data = await dashboardService.getHeatmapData(params);
      setHeatmapData(data);

    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const getColorByWeight = (weight) => {
    // Color gradient from green (low) to red (high)
    if (weight <= 2) return '#22c55e';  // green
    if (weight <= 5) return '#eab308';  // yellow
    if (weight <= 10) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getRadiusByWeight = (weight) => {
    // Radius based on weight (complaint count)
    return Math.max(5, Math.min(30, weight * 3));
  };

  const getCategoryColor = (category) => {
    const colors = {
      road: '#3b82f6',
      water: '#06b6d4',
      electricity: '#f59e0b',
      garbage: '#10b981',
      safety: '#ef4444',
      health: '#8b5cf6'
    };
    return colors[category] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader size="large" text="Loading heatmap data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Complaint Heatmap</h1>
          <p className="text-gray-600 mt-1">Geographic distribution of complaints</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <select
              value={filters.days}
              onChange={(e) => setFilters(prev => ({ ...prev, days: parseInt(e.target.value) }))}
              className="input-field"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="input-field"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="input-field"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map and Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="card p-0 overflow-hidden" style={{ height: '500px' }}>
            <div style={{ height: '400px' }}>
              <MapContainer
                center={[28.6139, 77.2090]} // Default to Delhi
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <HeatmapOverlay points={heatmapData} />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Legend and Stats */}
        <div className="space-y-4">
          {/* Weight Legend */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-3">
              <Layers className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Intensity</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Low (1-2)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Medium (3-5)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">High (6-10)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Critical (10+)</span>
              </div>
            </div>
          </div>

          {/* Category Legend */}
          {filters.category === 'all' && (
            <div className="card">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Categories</span>
              </div>

              <div className="space-y-2">
                {categories.filter(cat => cat !== 'all').map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getCategoryColor(category) }}
                    ></div>
                    <span className="text-sm text-gray-600 capitalize">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Statistics</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Hotspots:</span>
                <span className="font-medium">{heatmapData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Complaints:</span>
                <span className="font-medium">
                  {heatmapData.reduce((sum, point) => sum + point.weight, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg per Hotspot:</span>
                <span className="font-medium">
                  {heatmapData.length > 0
                    ? (heatmapData.reduce((sum, point) => sum + point.weight, 0) / heatmapData.length).toFixed(1)
                    : 0
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No Data Message */}
      {heatmapData.length === 0 && !loading && !error && (
        <div className="card text-center py-12">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">
            No complaints found matching the selected filters. Try adjusting the filters or time period.
          </p>
        </div>
      )}
    </div>
  );
};

export default Heatmap;
