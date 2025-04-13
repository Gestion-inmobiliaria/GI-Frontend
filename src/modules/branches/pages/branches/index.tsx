import { PrivateRoutes } from '@/models/routes.model'
import { useHeader } from '@/hooks'
import BranchList from './components/branch-list'

const BranchesPage = (): React.ReactNode => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Sucursales' }
  ])

  return (
    <BranchList />
  )
}

export default BranchesPage 