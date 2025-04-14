import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppConfig } from '@/config'
import { useHeader } from '@/hooks'
import { useGetResource } from '@/hooks/useApiResource'
import { PrivateRoutes } from '@/models'
import { type RootState } from '@/redux/store'
import { ENDPOINTS } from '@/utils'
import { ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const DashboardPage = (): React.ReactNode => {
  useHeader([
    { label: 'Dashboard' }
  ])
  const data: any = useSelector((state: RootState) => state.user)
  const { resource: subscription } = useGetResource<any>({
    endpoint: `${ENDPOINTS.PLAN}/${data?.sector?.realState?.id}/subscription-active`
  })

  const navigate = useNavigate()

  return (
    <>
      {!subscription?.plan?.is_active
        ? <Card className="bg-primary/10 border-primary/30">
          <CardHeader>
            <CardTitle>¡Bienvenido a {AppConfig.APP_TITLE}!</CardTitle>
            <CardDescription>
              Para comenzar a usar todas nuestras funcionalidades, necesitas elegir un plan de suscripción.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Te redirigiremos automáticamente a la página de suscripción en unos segundos...</p>
            <Button onClick={() => { navigate(PrivateRoutes.SUBSCRIPTION) }}>
              Ver planes ahora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        : <section>
          <h1 className='text-2xl font-bold tracking-tight'>
            Bienvenido, {data?.name}
          </h1>
          <p className='text-muted-foreground dark:text-dark-text-secondary'>
            Administra tu negocio inmobiliario desde un solo lugar
          </p>
        </section>}
    </>
  )
}

export default DashboardPage
