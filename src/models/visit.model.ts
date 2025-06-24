export enum VisitStatus {
  PROGRAMADA = 'PROGRAMADA',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  EN_CURSO = 'EN_CURSO'
}

export enum VisitType {
  PRIMERA_VISITA = 'PRIMERA_VISITA',
  SEGUIMIENTO = 'SEGUIMIENTO',
  CIERRE = 'CIERRE',
  INSPECCION = 'INSPECCION'
}

export interface VisitFormData {
  title: string
  clientName: string
  clientPhone: string
  clientEmail: string
  propertyId: string
  agentName: string
  startDate: string
  endDate: string
  type: VisitType
  notes?: string
}

export interface Visit {
  id: string
  title: string
  clientName: string
  clientPhone: string
  clientEmail: string
  propertyAddress: string
  agentName: string
  startDate: string
  endDate: string
  type: VisitType
  status: VisitStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

// Para FullCalendar
export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
  extendedProps: {
    clientName: string
    clientPhone: string
    propertyAddress: string
    agentName: string
    type: VisitType
    status: VisitStatus
    notes?: string
  }
}