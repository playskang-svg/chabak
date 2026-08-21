import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CheckCircle } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Marker Component
const createCustomIcon = (point, isVisited, isActive) => {
  const iconHtml = renderToString(
    <div style={{
      background: isActive ? '#FF5A5A' : (isVisited ? '#03C75A' : '#3B82F6'),
      color: 'white',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      border: '3px solid white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
      fontSize: '12px'
    }}>
      {point.day}
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Map controller to handle auto-panning
const MapController = ({ activePoint }) => {
  const map = useMap();
  
  useEffect(() => {
    if (activePoint) {
      map.flyTo(activePoint.coords, 14, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [activePoint, map]);

  return null;
};

const Map = ({ itinerary, activePoint, setActivePoint, visitedPoints, selectedRoutePoints, showMobileMap }) => {
  // Use VWorld or CartoDB for better Korean labels if OSM isn't enough, but standard OSM is usually fine in Korea.
  // Standard OSM: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  // CartoDB Voyager (Beautiful, good localization): 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

  // Extract selected points coordinates for the polyline
  const allPoints = itinerary.flatMap(day => day.points);
  const polylineCoords = allPoints
    .filter(p => selectedRoutePoints.includes(p.id))
    .map(p => p.coords);

  return (
    <div className={`map-container ${showMobileMap ? 'mobile-visible' : ''}`} style={{ zIndex: 1 }}>
      <MapContainer 
        center={[36.5, 127.5]} 
        zoom={7} 
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Draw route lines only for selected points */}
        {polylineCoords.length > 1 && (
          <Polyline 
            positions={polylineCoords} 
            color="#FF5A5A" 
            weight={4} 
            opacity={0.8} 
            dashArray="10, 10" 
          />
        )}

        {allPoints.map((point) => {
          const isVisited = visitedPoints.includes(point.id);
          const isActive = activePoint?.id === point.id;
          const isSelected = selectedRoutePoints.includes(point.id);

          return (
            <Marker 
              key={point.id} 
              position={point.coords}
              icon={createCustomIcon(point, isVisited, isActive)}
              eventHandlers={{
                click: () => setActivePoint(point)
              }}
              opacity={isSelected ? 1 : 0.4}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{point.name}</h4>
                  {isVisited && (
                    <div style={{ color: '#03C75A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px' }}>
                      <CheckCircle size={12} /> 방문 완료
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
        <MapController activePoint={activePoint} />
      </MapContainer>
    </div>
  );
};

export default Map;
