import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PrivateRoutes } from '@/models/routes.model'
import { useHeader } from '@/hooks'
import { IBranch } from '@/modules/branches/interfaces/branch.interface'
import { useBranches } from '@/modules/branches/hooks/useBranches'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Loader2Icon, BuildingIcon } from 'lucide-react'

interface BranchFormProps {
  title: string
  buttonText: string
}

const BranchForm = ({ title, buttonText }: BranchFormProps): React.ReactNode => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Partial<IBranch>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    isActive: true
  })
  const { getBranchById, createBranch, updateBranch, loading } = useBranches()

  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Sucursales', path: PrivateRoutes.BRANCH },
    { label: title }
  ])

  useEffect(() => {
    const fetchBranch = async () => {
      if (id) {
        const branch = await getBranchById(id)
        if (branch) {
          setFormData({
            name: branch.name,
            address: branch.address,
            phone: branch.phone || '',
            email: branch.email || '',
            description: branch.description || '',
            isActive: branch.isActive
          })
        }
      }
    }

    fetchBranch()
  }, [id, getBranchById])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let success = false

    if (id) {
      const result = await updateBranch(id, formData)
      success = !!result
    } else {
      const result = await createBranch(formData)
      success = !!result
    }

    if (success) {
      navigate(PrivateRoutes.BRANCH)
    }
  }

  return (
    <div className="w-full">
      <Card x-chunk="dashboard-07-chunk-0" className='w-full'>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BuildingIcon className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">{title}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nombre de la sucursal"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Dirección de la sucursal"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Teléfono de contacto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email de contacto"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descripción de la sucursal"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(PrivateRoutes.BRANCH)}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                {buttonText}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default BranchForm 