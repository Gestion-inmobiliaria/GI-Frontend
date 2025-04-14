import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
interface PlanCardProps {
  plan: {
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
  showSelectButton?: boolean
  showCurrentPlan?: boolean
  index: number
  activePlan?: any
}

const PlanCard = ({
  plan,
  showSelectButton = true,
  index,
  activePlan
}: PlanCardProps) => {
  const navigate = useNavigate()
  return (
    <div
      className={`relative flex flex-col rounded-lg border p-6 shadow-sm transition-all ${index % 2 !== 0
        ? 'border-primary/50 shadow-md dark:border-white'
        : 'border-border hover:border-primary/30'
        }`}
    >
      {index % 2 !== 0 && activePlan?.id !== plan.id && (
        <Badge
          variant="default"
          className="absolute -top-2.5 left-1/2 -translate-x-1/2"
        >
          Recomendado
        </Badge>
      )}

      {activePlan?.id === plan.id && (
        <Badge
          variant="outline"
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white text-primary border-primary dark:text-dark-bg-primary"
        >
          Plan actual
        </Badge>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-medium">{plan.name}</h3>
        <div className="mt-2 flex items-baseline">
          <span className="text-3xl font-bold">${plan.unit_amount}</span>
          <span className="ml-1 text-sm text-muted-foreground">/{plan.currency}</span>
        </div>
      </div>

      <ul className="mb-6 space-y-2 text-sm">
        {JSON.parse(plan.contentHtml).map((feature: string, index: number) => (
          <li key={index} className="flex items-start">
            <Check className="mr-2 h-4 w-4 text-accent" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {showSelectButton && (
          <Button
            variant={activePlan?.id !== plan.id ? 'default' : 'outline'}
            className="w-full"
            onClick={() => {
              if (activePlan?.id !== plan.id) {
                navigate(`/subscripcion/${plan?.id}`)
              }
            }}
            disabled={activePlan?.id === plan?.id}
          >
            {activePlan?.id === plan?.id ? 'Plan actual' : 'Seleccionar plan'}
          </Button>
        )}

        {/* {showCurrentPlan && isCurrentPlan && subscription?.status === 'active' && (
          <div className="text-center mt-2 text-sm text-muted-foreground">
            <span>Activo hasta: {new Date(subscription.endDate).toLocaleDateString()}</span>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default PlanCard
