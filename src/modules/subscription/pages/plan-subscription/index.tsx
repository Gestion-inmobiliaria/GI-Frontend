import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Banknote, Bitcoin, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { type Plan } from './success'
import { useCreateResource, useGetResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { useSelector } from 'react-redux'
import { type RootState } from '@/redux/store'
import { useAuth } from '@/hooks'
import { Checkbox } from '@/components/ui/checkbox'

const PlanSubscription = () => {
  const params = useParams()
  const data: any = useSelector((state: RootState) => state.user)
  const { checkAuthStatus } = useAuth()
  const { resource: plan } = useGetResource<Plan>({
    endpoint: `${ENDPOINTS.PLAN}/${params.id}`
  })
  const { createResource: subscribePlan } = useCreateResource({
    endpoint: `${ENDPOINTS.PLAN}/${plan?.id}/${data?.sector?.realState?.id}/subscription`
  })

  const { createResource: createPaymentCrypto, isMutating: isMutatingPayment } = useCreateResource({
    endpoint: `${ENDPOINTS.REALSTATE}/checkout`
  })

  const [selectedCrypto, setSelectedCrypto] = useState(plan?.currency ?? 'usdt')
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()
  const [fakePayment, setFakePayment] = useState(false)

  // if (!selectedPlan) {
  //   navigate('/subscription')
  //   return null
  // }

  const cryptoOptions = {
    btc: {
      name: 'Bitcoin',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      icon: Bitcoin,
      amount: ((plan?.unit_amount ?? 0) / 28000).toFixed(5) // Precio aproximado Bitcoin 2023
    },
    eth: {
      name: 'Ethereum',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      icon: Wallet,
      amount: ((plan?.unit_amount ?? 0) / 1800).toFixed(5) // Precio aproximado Ethereum 2023
    },
    usdt: {
      name: 'USDT',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      icon: Banknote,
      amount: plan?.unit_amount.toFixed(2)
    }
  }

  const handleCompletePayment = async () => {
    setIsProcessing(true)
    try {
      // Generar un ID de transacción aleatorio
      const transactionId = `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`

      // await subscribePlan()
      toast.promise(
        subscribePlan({}),
        {
          loading: 'Procesando pago...',
          success: () => {
            void checkAuthStatus()
            return `Pago exitoso. ID de transacción: ${transactionId}`
          },
          error: (error) => {
            return `Error al procesar el pago: ${error.message}`
          }
        }
      )

      navigate(`/subscripcion/${params.id}/success`)
    } catch (error) {
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVerifyPayment = () => {
    setIsProcessing(true)

    // PAGANDO CON CRYPTO REAL
    if (!fakePayment) {
      toast.promise(
        createPaymentCrypto({
          amount: String(plan?.unit_amount),
          currency: plan?.currency.toUpperCase(),
          userId: data?.id,
          planId: plan?.id,
          realstateId: data?.sector?.realState?.id
        }),
        {
          loading: 'Generando pago...',
          success: (data: any) => {
            console.log(data.result.url)
            window.location.href = String(data.result.url)
            return 'Pago generado con éxito'
          },
          error: (error) => {
            return `Error al verificar el pago: ${error.message}`
          }
        }
      )
    } else {
      // Simulamos una verificación de pago
      setTimeout(() => {
        setIsProcessing(false)
        // Simulamos una transacción exitosa
        void handleCompletePayment()
      }, 2000)
    }
  }

  const CryptoIcon = cryptoOptions[selectedCrypto as keyof typeof cryptoOptions].icon
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Pago de suscripción
        </h1>
        <p className="text-muted-foreground">
          Completa el pago para activar tu suscripción
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Pagar con Criptomonedas</CardTitle>
            <CardDescription>
              Completa el pago de tu plan {plan?.name} por {plan?.unit_amount} <span className='uppercase'>{plan?.currency}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs defaultValue="usdt" value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger disabled value="btc">Bitcoin</TabsTrigger>
                <TabsTrigger disabled value="eth">Ethereum</TabsTrigger>
                <TabsTrigger value="usdt">USDT</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedCrypto} className="mt-4 space-y-4">
                <div className="flex flex-row justify-center gap-4 w-full">
                  <span className='w-full text-lg'>Plan</span>
                  <span className='w-full text-right text-lg font-semibold'>{plan?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CryptoIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      {cryptoOptions[selectedCrypto as keyof typeof cryptoOptions].name}
                    </span>
                  </div>
                  <div className="font-bold">
                    {cryptoOptions[selectedCrypto as keyof typeof cryptoOptions].amount} {selectedCrypto.toUpperCase()}
                  </div>
                  {/* mostrar detalles del plan */}

                </div>

                {/* <div className="border p-3 rounded-md bg-muted/30">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-mono break-all mr-2">
                      {cryptoOptions[selectedCrypto as keyof typeof cryptoOptions].address}
                    </p>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={handleCopyAddress}
                    >
                      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div> */}

                {/* <div className="rounded-md bg-amber-50 p-3 text-amber-600 text-sm dark:bg-amber-100/10">
                  <p>
                    Envía exactamente{' '}
                    <span className="font-bold">
                      {cryptoOptions[selectedCrypto as keyof typeof cryptoOptions].amount} {selectedCrypto.toUpperCase()}
                    </span>{' '}
                    a la dirección anterior para completar el pago.
                  </p>
                </div> */}
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex-col space-y-2">
            {/* habilitar un checkbox indicando que simularemos un pago */}
            <label className='flex items-center gap-4 w-full py-4'>
              <span>Simular pago</span>
              <Checkbox
                id="simular-pago"
                className="peer"
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFakePayment(true)
                  } else {
                    setFakePayment(false)
                  }
                }}
              />
            </label>
            <Button
              className="w-full"
              onClick={handleVerifyPayment}
              disabled={isProcessing ?? isMutatingPayment}
            >
              {/* {isProcessing
                ? (<>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verificando pago...
                </>)
                : ('He completado el pago')} */}
              Pagar ahora
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => { navigate(-1) }}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default PlanSubscription
