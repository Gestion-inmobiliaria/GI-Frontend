import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { Check } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export interface Plan {
  id: string
  name: string
  description: string
  unit_amount: number
  currency: string
  interval: string
  contentHtml: string
  is_active: boolean
  amount_users: number
  amount_properties: number
  amount_sectors: number
}
const Success = () => {
  const navigate = useNavigate()
  const params = useParams()
  // const data: any = useSelector((state: RootState) => state.user)
  const { resource: plan } = useGetResource<Plan>({ endpoint: `${ENDPOINTS.PLAN}/${params.id}` })
  // const { resource: subscription } = useGetResource<any>({
  //   endpoint: `${ENDPOINTS.PLAN}/${data?.sector?.realState?.id}/subscription-active`
  // })

  // let ismounting = true
  // useEffect(() => {
  //   if (plan && subscription) {
  //     console.log({ plan, planSub: subscription.plan })
  //     if (subscription.plan?.id !== plan?.id) {
  //       navigate(-1)
  //     }
  //   }
  //   // return () => {
  //   //   ismounting = false
  //   // }
  // }, [subscription, plan])

  // if (!plan || !subscription) {
  //   return (
  //     <div className='grid place-content-center place-items-center h-full min-h-[calc(100vh-70px)]'>
  //       <Loading />
  //     </div>
  //   )
  // }

  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="text-center border-2 border-green-500/20 shadow-md">
        <CardContent className="pt-12 pb-8 px-8 gap-5">
          <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-4 mb-6 dark:bg-green-100/10">
            <Check className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold mb-4">
            ¡Pago exitoso!
          </h1>

          <p className="text-gray-600 mb-6 dark:text-dark-text-secondary">
            Tu suscripción al plan <span className="font-bold text-primary">{plan?.name}</span> ha
            sido activada correctamente.
          </p>

          <div className="bg-gray-50 border rounded-md p-4 mb-8 dark:bg-dark-bg-secondary">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-dark-text-secondary">Plan:</span>
              <span className="font-medium">{plan?.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-dark-text-secondary">Precio:</span>
              <span className="font-medium">{plan?.unit_amount}/{plan?.currency}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-dark-text-secondary">Estado:</span>
              <span className="text-green-600 font-medium">Activo</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              className="w-full"
              onClick={() => { navigate('/app') }}
            >
              Ir al Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Success
