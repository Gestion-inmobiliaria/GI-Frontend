import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Button } from '@/components/ui/button'
import 'leaflet/dist/leaflet.css'
import type { LatLngTuple } from 'leaflet'
// Importar íconos correctamente
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { HomeIcon } from 'lucide-react'
import { Property } from '@/models/property.model'
import PropertyPopup from './PropertyPopup'
// Corregir íconos rotos
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
  return (
    <div className="h-full w-full rounded-md overflow-hidden border">
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
        {properties.map((property, index) => (
          <Marker
            key={property.id}
            position={[
              parseFloat(property.ubicacion.latitud),
              parseFloat(property.ubicacion.longitud)
            ]}
            icon={customMarkerIcon}
          >
            <Popup>
              <PropertyPopup property={property} index={index} />
            </Popup>
          </Marker>
        ))}
        <RecenterButton /> {/* 👈 Añadir aquí */}
      </MapContainer>
    </div>
  )
}
