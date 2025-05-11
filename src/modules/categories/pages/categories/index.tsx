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
  TableRow
} from '@/components/ui/table'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { PrivateRoutes } from '@/models/routes.model'
import { getCategories, deleteCategory } from '@/services/category.service'
import { type Category } from '@/models/category.model'
import { useAuthorization } from '@/hooks/useAuthorization'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { Skeleton } from '@/components/ui/skeleton'

export default function CategoriesPage() {
  const navigate = useNavigate()
  const { verifyPermission } = useAuthorization()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const canCreate = verifyPermission([PERMISSION.CATEGORY_CREATE, PERMISSION.CATEGORY])
  const canUpdate = verifyPermission([PERMISSION.CATEGORY_UPDATE, PERMISSION.CATEGORY])
  const canDelete = verifyPermission([PERMISSION.CATEGORY_DELETE, PERMISSION.CATEGORY])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const params: Record<string, any> = {}
      if (searchTerm) {
        params.attr = 'name'
        params.value = searchTerm
      }
      const response = await getCategories(params)
      if (response.statusCode === 200 && response.data) {
        setCategories(response.data)
      } else {
        toast.error('Error al cargar las categorías')
        console.error('Respuesta del servidor:', response)
      }
    } catch (error) {
      toast.error('Error al cargar las categorías')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchCategories()
  }, [searchTerm])

  const handleSearch = () => {
    void fetchCategories()
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteCategory(id)
      if (response.statusCode === 200) {
        toast.success('Categoría eliminada correctamente')
        void fetchCategories()
      } else {
        toast.error('Error al eliminar la categoría')
        console.error('Respuesta del servidor:', response)
      }
    } catch (error) {
      toast.error('Error al eliminar la categoría')
      console.error(error)
    }
  }

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Categorías</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex">
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value) }}
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
            onClick={() => { navigate(PrivateRoutes.CATEGORY_CREATE) }}
          >
            <Plus className="h-4 w-4 mr-2" /> Nueva Categoría
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>

              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? (Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>

                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>

                  <TableCell className="flex space-x-2">
                    {canUpdate && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => navigate(`${PrivateRoutes.CATEGORIES}/${category.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No se encontraron categorías
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
