import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import '../../../../../utils/leafletSetup';
import { useEffect, useState } from 'react';
import { useMap } from "react-leaflet";

interface MapaProps {
  latitud: number;
  longitud: number;
  direccion?: string;
  ciudad?: string;
  pais?: string;
}

export function Mapa({ latitud, longitud, direccion, ciudad, pais }: MapaProps) {
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
        <Popup>
          <div>
            <strong>Dirección:</strong> {direccion || 'No disponible'}<br />
            <strong>Ciudad:</strong> {ciudad || 'No disponible'}<br />
            <strong>País:</strong> {pais || 'No disponible'}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

interface CoordinatePickerProps {
  initialPosition?: [number, number];
  onCoordinateChange: (lat: number, lng: number) => void;
  searchLocation?: { pais: string; ciudad: string };
}

const LocationMarker = ({
  initialPosition,
  onCoordinateChange,
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

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  return position ? <Marker position={position} /> : null;
};

const FlyToLocation = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(coords, 15);
  }, [coords, map]);

  return null;
};

export const CoordinatePicker = ({
  initialPosition,
  onCoordinateChange,
  searchLocation,
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

  useEffect(() => {
    const buscarUbicacion = async () => {
      if (searchLocation?.pais && searchLocation?.ciudad) {
        const query = `${searchLocation.ciudad}, ${searchLocation.pais}`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            const coords: [number, number] = [parseFloat(lat), parseFloat(lon)];
            setCurrentCoords(coords);
            onCoordinateChange(coords[0], coords[1]);
          }
        } catch (error) {
          console.error("Error buscando ubicación:", error);
        }
      }
    };

    buscarUbicacion();
  }, [searchLocation]);

  if (!mapReady) {
    return <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>;
  }

  return (
    <div className="space-y-4">
      <div className="h-64 rounded-lg overflow-hidden border">
        <MapContainer
          center={currentCoords || [-17.7833, -63.1821]}
          zoom={currentCoords ? 15 : 13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <LocationMarker
            initialPosition={currentCoords || initialPosition}
            onCoordinateChange={handleCoordinateChange}
          />

          {currentCoords && <FlyToLocation coords={currentCoords} />}
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
            value={currentCoords?.[0]?.toFixed(6) || ""}
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
            value={currentCoords?.[1]?.toFixed(6) || ""}
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