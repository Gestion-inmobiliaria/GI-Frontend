import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { PrivateRoutes } from '@/models/routes.model'
import { getSectors, deleteSector, getRealStates } from '@/services/sector.service'
import { Sector } from '@/models/sector.model'
import { useAuthorization } from '@/hooks/useAuthorization'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { Skeleton } from '@/components/ui/skeleton'

export default function SectorsPage() {
  const navigate = useNavigate()
  const { verifyPermission } = useAuthorization()
  const [sectors, setSectors] = useState<Sector[]>([])
  const [realStates, setRealStates] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const canCreate = verifyPermission([PERMISSION.SECTOR_CREATE, PERMISSION.SECTOR])
  const canUpdate = verifyPermission([PERMISSION.SECTOR_UPDATE, PERMISSION.SECTOR])
  const canDelete = verifyPermission([PERMISSION.SECTOR_DELETE, PERMISSION.SECTOR])

  // Cargar las inmobiliarias
  const fetchRealStates = async () => {
    try {
      console.log('Obteniendo lista de inmobiliarias...')
      const response = await getRealStates()
      console.log('Respuesta de inmobiliarias:', response)
      if (response.statusCode === 200 && response.data) {
        const realStatesMap: Record<string, string> = {}
        response.data.forEach((realState: any) => {
          realStatesMap[realState.id] = realState.name
        })
        setRealStates(realStatesMap)
        console.log('Mapa de inmobiliarias creado:', realStatesMap)
      }
    } catch (error) {
      console.error('Error al cargar las inmobiliarias:', error)
    }
  }

  const fetchSectors = async () => {
    setLoading(true)
    try {
      const params: Record<string, any> = {}
      if (searchTerm) {
        params.attr = 'name'
        params.value = searchTerm
      }
      console.log('Obteniendo sectores...')
      const response = await getSectors(params)
      console.log('Respuesta de sectores:', response)
      if (response.statusCode === 200 && response.data) {
        // Debuggear la estructura de cada sector
        response.data.forEach((sector: Sector, index: number) => {
          console.log(`Sector ${index}:`, sector)
          console.log(`- realState:`, sector.realState)
          console.log(`- realStateId:`, sector.realStateId)
        })
        setSectors(response.data)
      } else {
        toast.error('Error al cargar los sectores')
        console.error('Respuesta del servidor:', response)
      }
    } catch (error) {
      toast.error('Error al cargar los sectores')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRealStates().then(() => fetchSectors())
  }, [])

  const handleSearch = () => {
    fetchSectors()
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteSector(id)
      if (response.statusCode === 200) {
        toast.success('Sector eliminado correctamente')
        fetchSectors()
      } else {
        toast.error('Error al eliminar el sector')
        console.error('Respuesta del servidor:', response)
      }
    } catch (error) {
      toast.error('Error al eliminar el sector')
      console.error(error)
    }
  }

  // Función para obtener el nombre de la inmobiliaria
  const getRealStateName = (sector: Sector): string => {
    console.log('Obteniendo nombre para sector:', sector.id)
    
    // Primero intentamos con el objeto anidado realState
    if (sector.realState?.name) {
      console.log('- Usando sector.realState.name:', sector.realState.name)
      return sector.realState.name
    }
    
    // Si no está disponible, intentamos con realStateId y nuestro mapa
    if (sector.realStateId && realStates[sector.realStateId]) {
      console.log('- Usando realStates[sector.realStateId]:', realStates[sector.realStateId])
      return realStates[sector.realStateId]
    }
    
    // Si nada funciona, mostramos un guión
    console.log('- No se encontró nombre de inmobiliaria, usando "-"')
    return '-'
  }

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Sectores</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex">
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button 
            variant="outline" 
            className="ml-2" 
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {canCreate && (
          <Button 
            onClick={() => navigate(PrivateRoutes.SECTOR_CREATE)}
          >
            <Plus className="h-4 w-4 mr-2" /> Nuevo Sector
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Inmobiliaria</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : sectors.length > 0 ? (
              sectors.map((sector) => (
                <TableRow key={sector.id}>
                  <TableCell className="font-medium">{sector.name}</TableCell>
                  <TableCell>{sector.adress || '-'}</TableCell>
                  <TableCell>{sector.phone || '-'}</TableCell>
                  <TableCell>{getRealStateName(sector)}</TableCell>
                  <TableCell className="flex space-x-2">
                    {canUpdate && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => navigate(`${PrivateRoutes.SECTORS}/${sector.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(sector.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron sectores
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 