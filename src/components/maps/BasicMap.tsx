import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet'
import L from 'leaflet'
import { Button } from '@/components/ui/button'
import 'leaflet/dist/leaflet.css'
import type { LatLngTuple } from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { HomeIcon } from 'lucide-react'
import { Property } from '@/models/property.model'
import PropertyPopup from './PropertyPopup'
import { useState } from 'react'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const customMarkerIcon = new L.Icon({
  iconUrl: '/icons/property-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

interface BasicMapProps {
  properties: Property[]
  selectedFilters: string[]
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>
}

const zonaNortePoints: LatLngTuple[] = [
  [-17.725219243373026, -63.16481006425453],
  [-17.74917133972358, -63.174596136965135],
  [-17.755548399918535, -63.15536889626856],
  [-17.73633666983866, -63.14283818638278],
  [-17.725219243373026, -63.16481006425453],
];

const zonaCentroPoints: LatLngTuple[] = [
  [-17.776062873377217, -63.18872072983995],
  [-17.79478731071668, -63.187324713287985],
  [-17.79085668823516, -63.17033020621482],
  [-17.77398160103255, -63.17288091658793],
];

const zonaUV1Points: LatLngTuple[] = [
  [-17.77068135911697, -63.18234028578617],
  [-17.774617798991528, -63.181829964285754],
  [-17.774326162391223, -63.177287964735996],
  [-17.775152262206905, -63.17514451589296],
  [-17.776804505198935, -63.173103073385974],
  [-17.774325569440876, -63.1664176297629],
  [-17.772381713785773, -63.16738743290804],
  [-17.77136122647832, -63.168408187078164],
  [-17.770632408893544, -63.170653720286865],
  [-17.770389506497118, -63.17213370318055],
  [-17.770632761534575, -63.18218718731848],
  [-17.77068135911697, -63.18234028578617], // Cierra el polígono
];

const zonaVilla1roPoints: LatLngTuple[] = [
  [-17.79043675943438, -63.14396124607573],
  [-17.800263710785746, -63.14194049680904],
  [-17.80589871976224, -63.14071351192108],
  [-17.807066956833307, -63.14071350854716],
  [-17.809219500280502, -63.14109591800874],
  [-17.81138510458248, -63.14234054948928],
  [-17.8134235921451, -63.110164855348245],
  [-17.777263447750915, -63.10780866560903],
  [-17.78995675684004, -63.14233959626163],
  [-17.79043675943438, -63.14396124607573], // Cierra el polígono
];

function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1], yi = polygon[i][0];
    const xj = polygon[j][1], yj = polygon[j][0];
    const intersect = ((yi > point[0]) !== (yj > point[0])) &&
      (point[1] < (xj - xi) * (point[0] - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function RecenterButton() {
  const map = useMap()
  const center: LatLngTuple = [-17.7863, -63.1812]
  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <Button
        onClick={() => map.setView(center, 13)}
        variant="outline"
        size="sm"
        className="shadow-md bg-white/80 backdrop-blur hover:bg-white"
      >
        <HomeIcon className="h-4 w-4 mr-1" />
        Centrar
      </Button>
    </div>
  )
}

export default function BasicMap({ properties }: BasicMapProps) {
  const availableFilters = ['Zona Norte', 'Zona Centro', 'Zona UV-1', 'Zona Villa-1ro'];

  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  function toggleFilter(filter: string) {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  }
  return (
    <div className="h-full w-full rounded-md overflow-hidden border relative"> {/* relative para posición absoluta */}
      <MapContainer
        center={[-17.7863, -63.1812]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedFilters.includes('Zona Norte') && (
          <Polygon positions={zonaNortePoints} pathOptions={{ color: 'blue', fillOpacity: 0.2 }} />
        )}
        {selectedFilters.includes('Zona Centro') && (
          <Polygon positions={zonaCentroPoints} pathOptions={{ color: 'green', fillOpacity: 0.2 }} />
        )}
        {selectedFilters.includes('Zona UV-1') && (
          <Polygon positions={zonaUV1Points} pathOptions={{ color: 'orange', fillOpacity: 0.2 }} />
        )}
        {selectedFilters.includes('Zona Villa-1ro') && (
          <Polygon positions={zonaVilla1roPoints} pathOptions={{ color: 'purple', fillOpacity: 0.2 }} />
        )}

        {properties
          .filter(p => {
            const point: [number, number] = [
              parseFloat(p.ubicacion.latitud),
              parseFloat(p.ubicacion.longitud),
            ];
            if (selectedFilters.length === 0) return true;
            if (selectedFilters.includes('Zona Norte') && isPointInPolygon(point, zonaNortePoints.map(p => [p[0], p[1]])))
              return true;
            if (selectedFilters.includes('Zona Centro') && isPointInPolygon(point, zonaCentroPoints.map(p => [p[0], p[1]])))
              return true;
            if (
              selectedFilters.includes('Zona UV-1') &&
              isPointInPolygon(point, zonaUV1Points.map(p => [p[0], p[1]]))
            ) return true;
            if (
              selectedFilters.includes('Zona Villa-1ro') &&
              isPointInPolygon(point, zonaVilla1roPoints.map(p => [p[0], p[1]]))
            ) return true;
            return false;
          })
          .map((property, index) => (
            <Marker
              key={property.id}
              position={[parseFloat(property.ubicacion.latitud), parseFloat(property.ubicacion.longitud)]}
              icon={customMarkerIcon}
            >
              <Popup>
                <PropertyPopup property={property} index={index} />
              </Popup>
            </Marker>
          ))}
        <RecenterButton />
      </MapContainer>

      {/* Filtros posicionados encima del mapa */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded shadow-md flex space-x-2">
        {availableFilters.map(filter => (
          <Button
            key={filter}
            variant={selectedFilters.includes(filter) ? "default" : "outline"}
            onClick={() => toggleFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>
    </div>
  );
}
