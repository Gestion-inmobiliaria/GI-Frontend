import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetAllResource, useGetResource } from '@/hooks/useApiResource'
import PlanCard from '@/modules/landing/components/planCard'
import { type RootState } from '@/redux/store'
import { ENDPOINTS, FormatDateMMMDYYYYHHMM } from '@/utils'
import { ArrowLeft, Check } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const SubscriptionPage = () => {
  const { allResource: plans } = useGetAllResource({
    endpoint: ENDPOINTS.PLAN
  })
  const data: any = useSelector((state: RootState) => state.user)
  const { resource: subscription } = useGetResource<any>({
    endpoint: `${ENDPOINTS.PLAN}/${data?.sector?.realState?.id}/subscription-active`
  })

  const { allResource: payments } = useGetAllResource({
    endpoint: `${ENDPOINTS.REALSTATE}/${data?.sector?.realState?.id}/payments`
  })
  const navigate = useNavigate()

  return (
    <section>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              className="mb-2"
              onClick={() => { navigate(-1) }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              Plan de suscripción
            </h1>
            <p className="text-muted-foreground dark:text-dark-text-secondary">
              {subscription ? 'Detalles de mi suscripción' : 'Selecciona el plan que mejor se adapte a tu negocio'}
            </p>
            {subscription && <div className='p-4'>
              <ul className='flex flex-col gap-2 text-sm text-muted-foreground dark:text-dark-text-secondary'>
                <li className='flex items-center gap-2'>
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    usuarios: {subscription?.plan.amount_users}
                  </span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    propiedades: {subscription?.plan.amount_properties}
                  </span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    sectores: {subscription?.plan.amount_sectors}
                  </span>
                </li>
              </ul>
            </div>}
          </div>

          {subscription && (
            <div className="text-right">
              <h3 className="font-medium md:text-2xl">Plan actual: {subscription?.plan.name}</h3>
              <p className="text-sm text-muted-foreground md:text-xl">
                {subscription.state === 'active'
                  ? <span className='text-green-500'>Activo</span>
                  : <span className='text-yellow-500'>Inactivo</span>}
              </p>
              <p className="text-sm text-muted-foreground dark:text-dark-text-secondary">
                {subscription
                  ? `Tu suscripción se renovará el ${FormatDateMMMDYYYYHHMM(subscription?.next_payment_date)}`
                  : 'Selecciona un plan para comenzar a disfrutar de todas nuestras funcionalidades'}
              </p>
            </div>
          )}
        </div>

        <Tabs defaultValue="monthly" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="monthly">Pago Mensual</TabsTrigger>
            <TabsTrigger value="yearly" disabled>Pago Anual (Pronto)</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans?.map((plan: any, index: number) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  showCurrentPlan={true}
                  index={index}
                  activePlan={subscription?.plan}
                />
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border dark:bg-dark-bg-secondary">
              <h3 className="text-lg font-medium mb-4">Todos nuestros planes incluyen:</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  'Dashboard personalizado',
                  'Gestión de propiedades',
                  'Base de datos de clientes',
                  'Soporte por correo electrónico',
                  'Actualizaciones gratuitas',
                  'Almacenamiento en la nube',
                  'Pago seguro con criptomonedas',
                  'Acceso desde cualquier dispositivo'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className='text-light-bg-secondary dark:text-dark-text-secondary'>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="yearly">
            <div className="text-center py-12 text-muted-foreground">
              Los planes anuales estarán disponibles próximamente.
            </div>
          </TabsContent>
        </Tabs>
        {subscription && <div className='flex flex-col gap-4'>
          <h3 className="text-lg font-medium mb-4">Historial de pagos</h3>
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Fecha</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Monto</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Plan</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-bg-secondary dark:divide-dark-border">
                {payments && payments?.map((payment: any) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-2">{String(payment?.payment_date)}</td>
                    <td className="px-4 py-2">{payment.amount} {payment.subscription.plan.currency}</td>
                    <td className="px-4 py-2">{payment.subscription.plan.name}</td>
                    <td className="px-4 py-2">
                      {payment.state === 'paid' ? <Badge variant="default" className='bg-green-500 dark:bg-green-500 hover:dark:bg-green-500'>Pagado</Badge> : <Badge variant="outline">Pendiente</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>}
      </div>
    </section>
  )
}

export default SubscriptionPage
