import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'   //PaRA FORMATEAR FECHAS instalarlo si no hay
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { getModalities } from '@/services/modality.service'
import { Modality } from '@/models/modality.model'

export default function ModalitiesPage() {
  const [modalities, setModalities] = useState<Modality[]>([])
  const [loading, setLoading] = useState(true)

  const fetchModalities = async () => {
    setLoading(true)
    try {
      const response = await getModalities()
      if (response.statusCode === 200 && response.data) {
        setModalities(response.data)
      } else {
        toast.error('Error al cargar las modalidades')
      }
    } catch (error) {
      toast.error('Error inesperado al cargar las modalidades')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModalities()
  }, [])

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-6">Modalidades Registradas</h1>
      <div className="rounded-md border">
     

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>        
              <TableHead>Creado el</TableHead> {/* ← nueva columna */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                 
                  <TableCell><Skeleton className="h-5 w-60" /></TableCell>
                </TableRow>
              ))
              : modalities.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.name}</TableCell>
                
                  <TableCell>{format(new Date(m.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

      </div>
    </div>
  )
}
