import { useState, useEffect } from 'react'
import { useHeader } from '@/hooks'
import { Card } from '@/components/ui/card'
import { BuildingIcon, UsersIcon, RefreshCwIcon } from 'lucide-react'
import { useBranches } from '@/modules/branches/hooks/useBranches'
import Loading from '@/components/shared/loading'
import { Link } from 'react-router-dom'
import { PrivateRoutes } from '@/models/routes.model'
import { useAuthorization } from '@/hooks/useAuthorization'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { useSidebar } from '@/context/sidebarContext'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const DashboardPage = (): React.ReactNode => {
  useHeader([
    { label: 'Dashboard' }
  ])

  const { getBranches, branches, loading: branchesLoading } = useBranches()
  const [activeBranches, setActiveBranches] = useState(0)
  const { verifyPermission } = useAuthorization()
  const { resetMenuState } = useSidebar()
  const canAccessBranches = verifyPermission([PERMISSION.BRANCH, PERMISSION.BRANCH_SHOW])

  useEffect(() => {
    if (canAccessBranches) {
      const fetchBranches = async () => {
        const response = await getBranches()
        const activeBranchCount = response.data.filter(branch => branch.isActive).length
        setActiveBranches(activeBranchCount)
      }
      
      fetchBranches()
    }
  }, [getBranches, canAccessBranches])

  const handleResetMenu = () => {
    resetMenuState()
    toast.success('Los menús han sido restablecidos. Recarga la página para ver los cambios.')
    // Opcional: recargar la página después de un breve retraso
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          variant="outline"
          onClick={handleResetMenu}
          className="flex items-center gap-2"
        >
          <RefreshCwIcon className="h-4 w-4" />
          Restablecer menú
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {canAccessBranches && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sucursales Activas</p>
                {branchesLoading ? (
                  <div className="mt-2"><Loading /></div>
                ) : (
                  <h3 className="text-3xl font-bold mt-1">{activeBranches}</h3>
                )}
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <BuildingIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to={PrivateRoutes.BRANCH}
                className="text-sm text-primary hover:underline"
              >
                Ver todas las sucursales
              </Link>
            </div>
          </Card>
        )}
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Usuarios</p>
              <h3 className="text-3xl font-bold mt-1">-</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <UsersIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to={PrivateRoutes.USER}
              className="text-sm text-primary hover:underline"
            >
              Ver todos los usuarios
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
