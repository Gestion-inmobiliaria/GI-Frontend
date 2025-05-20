import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHeader } from '@/hooks'
import { PrivateRoutes } from '@/models'
import BasicMap from '@/components/maps/BasicMap'
import { Property } from '@/models/property.model' // crea este modelo si aún no existe
import { RootState } from '@/redux/store'
import { getProperties } from '@/services/property.service'

export default function MapaPage() {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Mapa' }
  ])

  const user = useSelector((state: RootState) => state.user)
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    const fetchProperties = async () => {
      const res = await getProperties()
      if (res.statusCode === 200 && res.data) {
        const filtered = res.data.filter(
          (p) => p.sector?.id === user?.sector?.id
        )
        setProperties(filtered)
      }
    }

    if (user?.sector?.id) fetchProperties()
  }, [user])

  return (
    <section className="flex flex-col h-[calc(100vh-64px)] p-4 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Mapa de Propiedades</h1>
      </div>
      <BasicMap properties={properties} />
    </section>
  )
}
