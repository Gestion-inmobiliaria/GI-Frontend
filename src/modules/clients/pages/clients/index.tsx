import { PrivateRoutes } from '@/models/routes.model'
import { useHeader } from '@/hooks'
import { ClientList } from './components/client-list'



const ClientsPage = (): React.ReactNode => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Clientes' }
  ])

  return (
    <ClientList />
  )
}

export default ClientsPage 