import { Property } from '@/models/property.model'
import { useNavigate } from 'react-router-dom'
import { BedDouble, Bath, CarFront, LandPlot, CircleDot } from 'lucide-react'
import { Eye } from 'lucide-react';
interface Props {
    property: Property
    index: number
}

export default function PropertyPopup({ property }: Props) {
    const navigate = useNavigate()

    // Usar la imagen real del inmueble (o placeholder si no tiene)
    const imageUrl = property.imagenes?.[0]?.url ?? 'https://via.placeholder.com/300x200?text=Sin+imagen'

    return (
        <div className="w-[250px] text-sm space-y-1">
            <img
                src={imageUrl}
                alt="Imagen propiedad"
                className="w-full h-24 object-cover rounded mb-2"
            />
            <strong className="text-base">{property.category?.name || 'Sin categoría'}</strong><br />
            <span className="text-muted-foreground">{property.descripcion.slice(0, 60)}...</span><br />
            <span className="text-green-600 font-semibold">{property.precio} USD</span><br />
            <div className="text-xs text-gray-500">
                {property.modality?.name || 'Sin modalidad'} – {property.sector?.name || 'Sin sector'}
            </div>

            {/* Nueva información añadida */}
            <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center gap-1"><LandPlot className="w-3 h-3" /> {property.area} m²</div>
                <div className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> {property.NroHabitaciones} Habitaciones</div>
                <div className="flex items-center gap-1"><Bath className="w-3 h-3" /> {property.NroBanos} baños</div>
                <div className="flex items-center gap-1"><CarFront className="w-3 h-3" /> {property.NroEstacionamientos} garaje</div>
                <div className="flex items-center gap-1"><CircleDot className="w-3 h-3" /> {property.estado || 'Sin estado'}</div>
            </div>

            {/* Mostrar agente si existe 
      <div className="text-xs text-gray-500">
        Agente: {property.user?.name || 'No asignado'}
      </div>
      */}

            <button
                onClick={() => navigate(`/state/detalle/${property.id}`)}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded transition-colors duration-200 w-full text-center"
            >
                <Eye className="w-4 h-4" /> Ver detalles
            </button>
        </div>
    )
}
