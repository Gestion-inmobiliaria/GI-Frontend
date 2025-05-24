import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';


interface MapaProps {
  latitud: number;
  longitud: number;
}

export function Mapa({ latitud, longitud }: MapaProps) {
  return (
    <MapContainer
       center={[latitud, longitud]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={[latitud, longitud]}>
        <Popup>Ubicación de prueba</Popup>
      </Marker>
    </MapContainer>
  );
}

// Configuración del icono del marcador
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface CoordinatePickerProps {
  initialPosition?: [number, number];
  onCoordinateChange: (lat: number, lng: number) => void;
}

const LocationMarker = ({ 
  initialPosition,
  onCoordinateChange 
}: {
  initialPosition?: [number, number];
  onCoordinateChange: (lat: number, lng: number) => void;
}) => {
  const [position, setPosition] = useState<[number, number] | null>(initialPosition || null);

  useMapEvents({
    click(e) {
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      onCoordinateChange(newPosition[0], newPosition[1]);
    },
  });

  // Actualizar posición cuando cambia initialPosition
  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  return position ? <Marker position={position} /> : null;
};

export const CoordinatePicker = ({ 
  initialPosition, 
  onCoordinateChange 
}: CoordinatePickerProps) => {
  const [mapReady, setMapReady] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    setMapReady(true);
    if (initialPosition) {
      setCurrentCoords(initialPosition);
    }
  }, [initialPosition]);

  const handleCoordinateChange = (lat: number, lng: number) => {
    setCurrentCoords([lat, lng]);
    onCoordinateChange(lat, lng);
  };

  if (!mapReady) {
    return <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>;
  }

  return (
    <div className="space-y-4">
      <div className="h-64 rounded-lg overflow-hidden border">
        <MapContainer
          center={currentCoords || [-17.7833, -63.1821]}
          zoom={currentCoords ? 15 : 13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker 
            initialPosition={initialPosition}
            onCoordinateChange={handleCoordinateChange} 
          />
        </MapContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitud
          </label>
          <input
            type="number"
            readOnly
            value={currentCoords?.[0]?.toFixed(6) || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitud
          </label>
          <input
            type="number"
            readOnly
            value={currentCoords?.[1]?.toFixed(6) || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        Haz clic en el mapa para seleccionar la ubicación
      </p>
    </div>
  );
};