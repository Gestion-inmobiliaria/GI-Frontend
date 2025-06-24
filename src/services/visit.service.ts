import { Visit, VisitFormData, VisitStatus, VisitType, CalendarEvent } from '@/models/visit.model'

// Datos mock para la presentación
let mockVisits: Visit[] = [
  {
    id: '1',
    title: 'Visita - Juan Pérez',
    clientName: 'Juan Pérez García',
    clientPhone: '+591 70123456',
    clientEmail: 'juan.perez@email.com',
    propertyAddress: 'Av. Arce #2354, Zona San Jorge',
    agentName: 'María García',
    startDate: '2025-06-25T10:00:00',
    endDate: '2025-06-25T11:00:00',
    type: VisitType.PRIMERA_VISITA,
    status: VisitStatus.PROGRAMADA,
    notes: 'Cliente interesado en departamento de 2 dormitorios',
    createdAt: '2025-06-24T08:00:00',
    updatedAt: '2025-06-24T08:00:00'
  },
  {
    id: '2',
    title: 'Visita - Ana López',
    clientName: 'Ana López Mendoza',
    clientPhone: '+591 70987654',
    clientEmail: 'ana.lopez@email.com',
    propertyAddress: 'Calle 21 de Calacoto #456',
    agentName: 'Carlos Rodríguez',
    startDate: '2025-06-26T14:30:00',
    endDate: '2025-06-26T15:30:00',
    type: VisitType.SEGUIMIENTO,
    status: VisitStatus.PROGRAMADA,
    notes: 'Segunda visita, cliente muy interesado',
    createdAt: '2025-06-24T09:00:00',
    updatedAt: '2025-06-24T09:00:00'
  },
  {
    id: '3',
    title: 'Visita - Pedro Martín',
    clientName: 'Pedro Martín Silva',
    clientPhone: '+591 70555444',
    clientEmail: 'pedro.martin@email.com',
    propertyAddress: 'Zona Sur, Calle 15 #789',
    agentName: 'Laura Fernández',
    startDate: '2025-06-23T16:00:00',
    endDate: '2025-06-23T17:00:00',
    type: VisitType.CIERRE,
    status: VisitStatus.COMPLETADA,
    notes: 'Visita completada exitosamente, cliente decidió comprar',
    createdAt: '2025-06-22T10:00:00',
    updatedAt: '2025-06-23T17:00:00'
  },
  {
    id: '4',
    title: 'Visita - Sandra Choque',
    clientName: 'Sandra Choque Mamani',
    clientPhone: '+591 70111222',
    clientEmail: 'sandra.choque@email.com',
    propertyAddress: 'Sopocachi, Av. 20 de Octubre #321',
    agentName: 'Miguel Torres',
    startDate: '2025-06-22T11:00:00',
    endDate: '2025-06-22T12:00:00',
    type: VisitType.PRIMERA_VISITA,
    status: VisitStatus.CANCELADA,
    notes: 'Cliente canceló por motivos personales',
    createdAt: '2025-06-21T15:00:00',
    updatedAt: '2025-06-22T10:30:00'
  }
]

// Propiedades mock
const mockProperties = [
  { id: '1', address: 'Av. Arce #2354, Zona San Jorge', price: '120000' },
  { id: '2', address: 'Calle 21 de Calacoto #456', price: '180000' },
  { id: '3', address: 'Zona Sur, Calle 15 #789', price: '95000' },
  { id: '4', address: 'Sopocachi, Av. 20 de Octubre #321', price: '150000' },
  { id: '5', address: 'Miraflores, Calle 27 #543', price: '75000' }
]

export class VisitService {
  // Obtener todas las visitas
  static async getAllVisits(): Promise<Visit[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))
    return [...mockVisits].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  }

  // Obtener visitas para el calendario
  static async getCalendarEvents(): Promise<CalendarEvent[]> {
    const visits = await this.getAllVisits()
    return visits.map(visit => ({
      id: visit.id,
      title: visit.title,
      start: visit.startDate,
      end: visit.endDate,
      backgroundColor: this.getStatusColor(visit.status),
      borderColor: this.getStatusColor(visit.status),
      extendedProps: {
        clientName: visit.clientName,
        clientPhone: visit.clientPhone,
        propertyAddress: visit.propertyAddress,
        agentName: visit.agentName,
        type: visit.type,
        status: visit.status,
        notes: visit.notes
      }
    }))
  }

  // Crear nueva visita
  static async createVisit(formData: VisitFormData): Promise<Visit> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const property = mockProperties.find(p => p.id === formData.propertyId)
    
    const newVisit: Visit = {
      id: Date.now().toString(),
      title: `Visita - ${formData.clientName}`,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientEmail: formData.clientEmail,
      propertyAddress: property?.address || 'Dirección no encontrada',
      agentName: formData.agentName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      type: formData.type,
      status: VisitStatus.PROGRAMADA,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockVisits.push(newVisit)
    return newVisit
  }

  // Actualizar estado de visita
  static async updateVisitStatus(visitId: string, status: VisitStatus): Promise<Visit> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const visitIndex = mockVisits.findIndex(v => v.id === visitId)
    if (visitIndex === -1) {
      throw new Error('Visita no encontrada')
    }
    
    mockVisits[visitIndex] = {
      ...mockVisits[visitIndex],
      status,
      updatedAt: new Date().toISOString()
    }
    
    return mockVisits[visitIndex]
  }

  // Obtener propiedades disponibles
  static async getProperties(): Promise<Array<{id: string, address: string, price: string}>> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockProperties
  }

  // Obtener colores por estado
  private static getStatusColor(status: VisitStatus): string {
    switch (status) {
      case VisitStatus.PROGRAMADA:
        return '#3b82f6' // Blue
      case VisitStatus.EN_CURSO:
        return '#f59e0b' // Amber
      case VisitStatus.COMPLETADA:
        return '#10b981' // Green
      case VisitStatus.CANCELADA:
        return '#ef4444' // Red
      default:
        return '#6b7280' // Gray
    }
  }

  // Obtener visitas por estado
  static async getVisitsByStatus(status: VisitStatus): Promise<Visit[]> {
    const allVisits = await this.getAllVisits()
    return allVisits.filter(visit => visit.status === status)
  }

  // Obtener visitas futuras
  static async getUpcomingVisits(): Promise<Visit[]> {
    const allVisits = await this.getAllVisits()
    const now = new Date()
    return allVisits.filter(visit => 
      new Date(visit.startDate) > now && 
      visit.status === VisitStatus.PROGRAMADA
    )
  }

  // Obtener visitas pasadas
  static async getPastVisits(): Promise<Visit[]> {
    const allVisits = await this.getAllVisits()
    const now = new Date()
    return allVisits.filter(visit => 
      new Date(visit.startDate) < now
    )
  }
}