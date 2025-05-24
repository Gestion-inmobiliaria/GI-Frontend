import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHeader } from '@/hooks'
import { PrivateRoutes } from '@/models'
import BasicMap from '@/components/maps/BasicMap'
import { Property } from '@/models/property.model'
import { RootState } from '@/redux/store'
import { getModalities, getProperties, getSectors } from '@/services/property.service'


export default function MapaPage() {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Mapa' }
  ])

  const user = useSelector((state: RootState) => state.user)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  // Estado para filtros
  const [precioMax, setPrecioMax] = useState(1000000)
  const [habitacionesMin, setHabitacionesMin] = useState(1)
  const [sector, setSector] = useState('')
  const [modalidad, setModalidad] = useState('')
  const [filtrosActivos, setFiltrosActivos] = useState(false)

  // Estados para listas de sectores y modalidades
  const [sectores, setSectores] = useState<{ id: string, name: string }[]>([])
  const [modalidades, setModalidades] = useState<{ id: string, name: string }[]>([])

  useEffect(() => {
    if (user) fetchProperties()
    fetchFiltros()
  }, [user])

  const fetchFiltros = async () => {
    try {
      const [resSectors, resModalities] = await Promise.all([getSectors(), getModalities()])

      if (resSectors.statusCode === 200) {
        setSectores(resSectors.data ?? [])
      } else {
        setSectores([])
      }

      if (resModalities.statusCode === 200) {
        setModalidades(resModalities.data ?? [])
      } else {
        setModalidades([])
      }

    } catch (error) {
      console.error('Error general al cargar filtros:', error)
      setSectores([])
      setModalidades([])
    }
  }


  const fetchProperties = async (aplicarFiltros = false) => {
    setLoading(true)
    const res = await getProperties()

    if (res.statusCode === 200 && res.data) {
      let filtered: Property[] = []

      if (user?.role?.name === 'Administrador TI') {
        filtered = res.data
      } else if (user?.sector?.id) {
        filtered = res.data.filter((p) => p.sector?.id === user.sector?.id)
      }

      if (aplicarFiltros) {
        filtered = filtered.filter(p =>
          Number(p.precio) <= precioMax &&
          p.NroHabitaciones >= habitacionesMin &&
          (!sector || p.sector?.id === sector) &&
          (!modalidad || p.modality?.id === modalidad)
        )
      }

      setProperties(filtered)
    }

    setLoading(false)
  }

  const aplicarFiltros = () => {
    setFiltrosActivos(true)
    fetchProperties(true)
  }

  const limpiarFiltros = () => {
    setPrecioMax(1000000)
    setHabitacionesMin(1)
    setSector('')
    setModalidad('')
    setFiltrosActivos(false)
    fetchProperties(false)
  }

  return (
    <section className="flex flex-col h-[calc(100vh-64px)] p-4 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Mapa de Propiedades</h1>
      </div>

      {/* Menú de filtros */}
      <div className="p-4 bg-gray-100 rounded-md space-y-2">
        <h2 className="font-bold text-lg">Filtros Avanzados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <div>
            <label>Precio máximo: ${precioMax}</label>
            <input type="range" min="10000" max="1000000" step="10000" value={precioMax} onChange={(e) => setPrecioMax(Number(e.target.value))} />
          </div>
          <div>
            <label>Habitaciones mínimas:</label>
            <input type="number" value={habitacionesMin} min="1" onChange={(e) => setHabitacionesMin(Number(e.target.value))} />
          </div>
          <div>
            <label>Sector:</label>
            <select value={sector} onChange={(e) => setSector(e.target.value)}>
              <option value="">Todos</option>
              {sectores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label>Modalidad:</label>
            <select value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
              <option value="">Todas</option>
              {modalidades.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={aplicarFiltros}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
          >
            Aplicar filtros
          </button>
          <button
            onClick={limpiarFiltros}
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <span className="text-lg text-muted-foreground">Cargando propiedades...</span>
        </div>
      ) : (
        <BasicMap properties={properties} />
      )}
    </section>
  )
}
