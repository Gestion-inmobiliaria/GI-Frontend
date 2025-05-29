import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHeader } from '@/hooks'
import { PrivateRoutes } from '@/models'
import BasicMap from '@/components/maps/BasicMap'
import { Property } from '@/models/property.model'
import { RootState } from '@/redux/store'
import { getModalities, getProperties, getSectors } from '@/services/property.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
//import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

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
  const [habitacionesMin, setHabitacionesMin] = useState(0)
  const [sector, setSector] = useState('')
  const [modalidad, setModalidad] = useState('')
  const [, setFiltrosActivos] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [estado, setEstado] = useState('');  // Estado del inmueble
  const [categoria, setCategoria] = useState('');  // Categoría
  const [areaMin, setAreaMin] = useState(0);  // Área mínima
  const [banosMin, setBanosMin] = useState(0);  // Baños mínimos
  const [estacionamientosMin, setEstacionamientosMin] = useState(0);  // Estacionamientos mínimos

  const [sectores, setSectores] = useState<{ id: string, name: string }[]>([])
  const [modalidades, setModalidades] = useState<{ id: string, name: string }[]>([])

  useEffect(() => {
    if (user) fetchProperties()
    fetchFiltros()
  }, [user])

  const fetchFiltros = async () => {
    try {
      const [resSectors, resModalities] = await Promise.all([getSectors(), getModalities()])
      setSectores(resSectors.statusCode === 200 ? resSectors.data ?? [] : [])
      setModalidades(resModalities.statusCode === 200 ? resModalities.data ?? [] : [])
    } catch (error) {
      console.error('Error al cargar filtros:', error)
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
        filtered = res.data.filter(p => p.sector?.id === user.sector?.id)
      }

      if (aplicarFiltros) {
        filtered = filtered.filter(p =>
          Number(p.precio) <= precioMax &&
          p.NroHabitaciones >= habitacionesMin &&
          p.NroBanos >= banosMin &&
          p.NroEstacionamientos >= estacionamientosMin &&
          Number(p.area) >= areaMin &&
          (!sector || p.sector?.id === sector) &&
          (!modalidad || p.modality?.id === modalidad) &&
          (!estado || p.estado.toLowerCase() === estado.toLowerCase()) &&
          (!categoria || p.category?.name.toLowerCase() === categoria.toLowerCase())
        );
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
    setHabitacionesMin(0)
    setSector('')
    setModalidad('')
    setFiltrosActivos(false)

    // Nuevos filtros:
    setAreaMin(0)
    setBanosMin(0)
    setEstacionamientosMin(0)
    setEstado('')
    setCategoria('')

    fetchProperties(false)
  }


  return (
    <section className="flex flex-col h-[calc(100vh-64px)] p-4 gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Filtros Avanzados</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Precio máximo: ${precioMax}</label>
            <Input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={precioMax}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Habitaciones mínimas</label>
            <Input
              type="number"
              min="1"
              value={habitacionesMin}
              onChange={(e) => setHabitacionesMin(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Sector</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full h-10 border rounded px-3"
            >
              <option value="">Todos</option>
              {sectores.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Modalidad</label>
            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              className="w-full h-10 border rounded px-3"
            >
              <option value="">Todas</option>
              {modalidades.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Área mínima (m²)</label>
            <Input
              type="number"
              min="0"
              value={areaMin}
              onChange={(e) => setAreaMin(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Baños mínimos</label>
            <Input
              type="number"
              min="1"
              value={banosMin}
              onChange={(e) => setBanosMin(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Estacionamientos mínimos</label>
            <Input
              type="number"
              min="1"
              value={estacionamientosMin}
              onChange={(e) => setEstacionamientosMin(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full h-10 border rounded px-3"
            >
              <option value="">Todos</option>
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full h-10 border rounded px-3"
            >
              <option value="">Todas</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              {/* Puedes cargar dinámicamente desde backend */}
            </select>
          </div>

        </CardContent>

        <CardFooter className="flex gap-2">
          <Button onClick={aplicarFiltros}>Aplicar</Button>
          <Button variant="outline" onClick={limpiarFiltros}>Limpiar</Button>
        </CardFooter>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <span className="text-lg text-muted-foreground">Cargando propiedades...</span>
        </div>
      ) : (
        <BasicMap properties={properties} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />

      )}
    </section>
  )
}
