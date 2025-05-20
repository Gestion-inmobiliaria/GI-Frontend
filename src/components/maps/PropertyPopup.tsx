import { Property } from '@/models/property.model'
import { useNavigate } from 'react-router-dom'

interface Props {
    property: Property
    index: number
}

export default function PropertyPopup({ property, index }: Props) {
    const navigate = useNavigate()

    const mockImages = [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be'
    ]

    const imageUrl = mockImages[index % mockImages.length]

    return (
        <div className="w-[220px] text-sm">
            <img
                src={imageUrl}
                alt="Imagen propiedad"
                className="w-full h-24 object-cover rounded mb-2"
            />
            <strong className="text-base">{property.category?.name}</strong><br />
            {property.descripcion.slice(0, 60)}...<br />
            <span className="text-green-600 font-semibold">{property.precio} USD</span><br />
            <div className="text-xs text-gray-500 mb-1">
                {property.modality?.name} – {property.sector?.name}
            </div>
            <button
                onClick={() => navigate(`/inmueble/${property.id}`)}
                className="text-blue-600 underline"
            >
                Ver detalles
            </button>
        </div>
    )
}
