import { useEffect, useState } from 'react'
//import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { getModalities } from '@/services/modality.service'
import { Modality } from '@/models/modality.model'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Skeleton from '@/components/shared/skeleton'
import { PrivateRoutes } from '@/models'

export default function ModalitiesPage() {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Modalidades' }
  ])

 // const navigate = useNavigate()
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
    <section className="grid gap-4 overflow-hidden w-full relative">
     

      <Card>
        <CardHeader>
          <CardTitle>Modalidades Registradas</CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden relative w-full">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? <Skeleton rows={5} columns={2} />
                  : modalities.map((modality) => (
                      <TableRow key={modality.id}>
                        <TableCell>{modality.name}</TableCell>
                        <TableCell>{format(new Date(modality.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                      </TableRow>
                    ))
                }
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
