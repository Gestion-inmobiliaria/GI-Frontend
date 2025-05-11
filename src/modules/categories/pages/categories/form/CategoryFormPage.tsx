import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { getCategory, createCategory, updateCategory } from '@/services/category.service'
import { type Category } from '@/models/category.model'
import { type ApiResponse } from '@/models/api-response.model'
import { PrivateRoutes } from '@/models/routes.model'

export default function CategoryFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [category, setCategory] = useState<Partial<Category>>({
    name: ''
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit && id) {
      void loadCategory(id)
    }
  }, [id])

  const loadCategory = async (categoryId: string) => {
    setLoading(true)
    const response: ApiResponse<Category> = await getCategory(categoryId)
    if (response.statusCode === 200 && response.data) {
      setCategory(response.data)
    } else {
      toast.error('Error al cargar la categoría')
    }
    setLoading(false)
  }

  const handleChange = (field: keyof Category, value: string) => {
    setCategory(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const action = isEdit ? updateCategory(id!, category) : createCategory(category as any)
    const response = await action

    if (response.statusCode === 200 || response.statusCode === 201) {
      toast.success(`Categoría ${isEdit ? 'actualizada' : 'creada'} correctamente`)
      navigate(PrivateRoutes.CATEGORIES)
    } else {
      toast.error(response.message ?? 'Error al guardar la categoría')
    }

    setLoading(false)
  }

  return (
    <div className="container p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Editar Categoría' : 'Crear Categoría'}
      </h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={category.name ?? ''}
            onChange={(e) => { handleChange('name', e.target.value) }}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => { navigate(PrivateRoutes.CATEGORIES) }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </div>
    </div>
  )
}
