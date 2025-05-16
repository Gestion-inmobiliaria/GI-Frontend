import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Importar íconos de Leaflet correctamente con Vite/Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Arreglar íconos rotos en Leaflet para TypeScript
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export default function BasicMap() {
  return (
    <MapContainer
      center={[-17.7863, -63.1812]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[-17.7863, -63.1812]}>
        <Popup>
          Ubicación inicial: Santa Cruz, Bolivia
        </Popup>
      </Marker>
    </MapContainer>
  )
}
