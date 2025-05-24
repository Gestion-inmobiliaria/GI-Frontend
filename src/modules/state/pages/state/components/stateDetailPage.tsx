import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import {
  DollarSign,LandPlot, BedDouble, Bath, CarFront,
  User2, PercentCircle, Layers3, MapPin,ClipboardList,
  Users, FileText, CircleDot,Building2,
  Globe
} from "lucide-react"
import { ImageGallery } from './state-imagen';
import { useGetState } from '@/modules/state/hooks/useState';
import L from 'leaflet';
import { Mapa } from './state-maps';
import { EstadoBadge } from './estadoBadge'



const stateDetailPage = () => {
   const { id } = useParams()
  const { state: data, isLoading } = useGetState(id)

if (isLoading || !data) return <div className="p-6">Cargando...</div>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Detalles de la propiedad</h1>

      <ImageGallery images={data.imagenes} />

      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-sm">
          {/* Descripción */}
          <div className="md:col-span-2">
            <h4 className="text-muted-foreground font-medium mb-1">Descripción</h4>
            <p>{data.descripcion}</p>
          </div>

          {/* Precio */}
          <InfoRow icon={<DollarSign />} label="Precio" value={`$${data.precio.toLocaleString()}`} />

           {/* Área */}
          <InfoRow icon={<LandPlot/>} label="Área" value={`${data.area} m²`} />

          {/* Habitaciones */}
          <InfoRow icon={<BedDouble />} label="Habitaciones" value={data.NroHabitaciones} />

          {/* Baños */}
          <InfoRow icon={<Bath />} label="Baños" value={data.NroBanos} />

          {/* Estacionamientos */}
          <InfoRow icon={<CarFront />} label="Garajes" value={data.NroEstacionamientos} />

          {/* Estado */}
<InfoRow
  icon={<CircleDot />}
  label="Estado"
  value={<EstadoBadge estado={data.estado} />}
/>          {/* Agente y comisión */}
          <div className="space-y-2">
            <InfoRow icon={<User2 />} label="Agente" value={data.user?.name || 'No asignado'} />
            <InfoRow icon={<PercentCircle />} label="Comisión" value={`${data.comision * 100}%`} />
          </div>
               {/* Categoría */}
          <InfoRow icon={<Layers3 />} label="Categoría" value={data.category?.name || 'Sin categoría'} />

          {/* Modalidad */}
          <InfoRow icon={<ClipboardList />} label="Modalidad" value={data.modality?.name || 'Sin modalidad'} />

          {/* Sector */}
          <InfoRow icon={<Building2/>} label="Sector" value={data.sector?.name || 'Sin sector'} />

{/* Dueños */}
<div className="md:col-span-2">
  <div className="flex items-center gap-2 mb-1">
    <Users className="w-4 h-4 text-muted-foreground" />
    <h4 className="text-muted-foreground font-medium">Dueño(s)</h4>
  </div>
  {Array.isArray(data.property_owner) && data.property_owner.length > 0 ? (
    <ul className="list-disc list-inside space-y-1">
      {data.property_owner.map((po, idx) => (
        <li key={idx}>
          {po.owner?.name ?? 'Sin nombre'} — CI: {po.owner?.ci ?? 'N/A'}, Tel: {po.owner?.phone ?? 'N/A'}
        </li>
      ))}
    </ul>
  ) : (
    <p>No hay dueños registrados</p>
  )}
</div>

{/* Condiciones de compra */}
<div className="md:col-span-2">
  <div className="flex items-center gap-2 mb-1">
    <FileText className="w-4 h-4 text-muted-foreground" />
    <h4 className="text-muted-foreground font-medium">Condiciones de compra</h4>
  </div>
  <p>{data.condicion_Compra}</p>
</div>
          </CardContent>
      </Card>
<div className="space-y-4">
  <h2 className="text-base sm:text-lg font-semibold">Ubicación</h2>

  {data.ubicacion ? (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <InfoRow
          icon={<MapPin />}
          label="Dirección"
          value={data.ubicacion.direccion || 'No disponible'}
        />
        <InfoRow
          icon={<Globe />}
          label="País"
          value={data.ubicacion.pais || 'No disponible'}
        />
        <InfoRow
          icon={<Building2 />}
          label="Ciudad"
          value={data.ubicacion.ciudad || 'No disponible'}
        />
      </div>

      <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] rounded-lg overflow-hidden shadow">
        <Mapa
          latitud={data.ubicacion.latitud}
          longitud={data.ubicacion.longitud}
        />
      </div>
    </>
  ) : (
    <p className="text-sm text-muted-foreground">No hay datos de ubicación.</p>
  )}
</div>
</div>
);
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <div className="text-muted-foreground">{icon}</div>
    <div><span className="font-medium">{label}:</span> {value}</div>
  </div>
)

// Arregla los íconos de Leaflet (por defecto no se ven en React)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

export default stateDetailPage