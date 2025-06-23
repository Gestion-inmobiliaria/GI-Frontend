import React from 'react'
import { ImpulsoStatus } from '@/modules/impulsar_inmueble/models/estadoImpulso.model'

interface EstadoBadgeImpulsoProps {
  estado: ImpulsoStatus | string
}

export const EstadoBadgeImpulso: React.FC<EstadoBadgeImpulsoProps> = ({ estado }) => {
  const estadoLower = estado.toLowerCase()

  const config: Record<ImpulsoStatus, { bg: string; text: string }> = {
    [ImpulsoStatus.ACTIVO]: { bg: 'bg-green-100', text: 'text-green-800' },
    [ImpulsoStatus.EXPIRADO]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    [ImpulsoStatus.CANCELADO]: { bg: 'bg-red-100', text: 'text-red-800' }
  }

  const badgeClass =
    estadoLower in config
      ? `${config[estadoLower as ImpulsoStatus].bg} ${config[estadoLower as ImpulsoStatus].text}`
      : 'bg-muted text-muted-foreground'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
      {estado}
    </span>
  )
}