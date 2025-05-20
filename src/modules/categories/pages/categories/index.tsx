import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Pencil, PlusCircle, Search, Trash2 } from 'lucide-react'

import { useAuthorization } from '@/hooks/useAuthorization'
import { useHeader } from '@/hooks'
import { getCategories, deleteCategory } from '@/services/category.service'
import { type Category } from '@/models/category.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { PrivateRoutes } from '@/models/routes.model'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CategoriesPage() {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Categorías' }
  ])

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
      }
    } catch (error) {
      toast.error('Error al cargar las categorías')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteCategory(id)
      if (response.statusCode === 200) {
        toast.success('Categoría eliminada correctamente')
        void fetchCategories()
      } else {
        toast.error('Error al eliminar la categoría')
      }
    } catch (error) {
      toast.error('Error al eliminar la categoría')
      console.error(error)
    }
  }

  useEffect(() => {
    void fetchCategories()
  }, [searchTerm])

  return (
    <section className="grid gap-4 overflow-hidden w-full relative">
      <div className="inline-flex items-center flex-wrap gap-2">
        <form className="py-1" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar categoría..."
              className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ring-offset-0 xl:min-w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
        {canCreate && (
          <Button
            onClick={() => navigate(PrivateRoutes.CATEGORY_CREATE)}
            size="sm"
            className="h-8 gap-1"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only lg:not-sr-only sm:whitespace-nowrap">Nueva Categoría</span>
          </Button>

          
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Categorías</CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden relative w-full">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
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
                    <TableCell colSpan={2} className="h-24 text-center">
                      No se encontraron categorías
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
