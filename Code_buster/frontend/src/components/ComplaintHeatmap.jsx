import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HeatmapOverlay = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !points || points.length === 0) return;

        map.invalidateSize();

        const heatData = points.map(p => [p.latitude, p.longitude, p.weight || 1]); // Default weight to 1 if not present

        if (L.heatLayer) {
            const heatLayer = L.heatLayer(heatData, { radius: 25, blur: 15, maxZoom: 17 });
            heatLayer.addTo(map);
            return () => {
                map.removeLayer(heatLayer);
            };
        } else {
            console.error("L.heatLayer is not defined");
        }
    }, [map, points]);

    return null;
};

const ComplaintHeatmap = ({ complaints, height = '400px' }) => {
    // Transform complaints to heatmap points if needed
    // If complaints already have weight, use it. Otherwise assume raw complaints.
    const points = complaints.map(c => ({
        latitude: parseFloat(c.latitude),
        longitude: parseFloat(c.longitude),
        weight: c.weight || 1
    })).filter(p => !isNaN(p.latitude) && !isNaN(p.longitude));

    if (points.length === 0) {
        return (
            <div className="bg-gray-100 rounded-lg flex items-center justify-center text-gray-500" style={{ height }}>
                No location data available for heatmap
            </div>
        );
    }

    return (
        <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
            <MapContainer
                center={[28.6139, 77.2090]} // Default to Delhi
                zoom={11}
                style={{ height, width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <HeatmapOverlay points={points} />
            </MapContainer>
        </div>
    );
};

export default ComplaintHeatmap;
