import { useHeader } from '@/hooks'
import { PrivateRoutes } from '@/models'
import BasicMap from '@/components/maps/BasicMap'

export default function MapaPage() {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Mapa' }
  ])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Vista del Mapa</h1>
      <BasicMap />
    </div>
  )
}
