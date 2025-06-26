import { Visit, VisitFormData, VisitStatus, VisitType, CalendarEvent } from '@/models/visit.model'


// Datos mock para la presentación - FECHAS ACTUALIZADAS
let mockVisits: Visit[] = [
    // VISITAS FUTURAS (desde 27 de junio)
    {
        id: '1',
        title: 'Visita - Juan Pérez',
        clientName: 'Juan Pérez García',
        clientPhone: '+591 70123456',
        clientEmail: 'juan.perez@email.com',
        propertyAddress: 'Av. Arce #2354, Zona San Jorge',
        agentName: 'María García',
        startDate: '2025-06-27T10:00:00',
        endDate: '2025-06-27T11:00:00',
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
        startDate: '2025-06-28T14:30:00',
        endDate: '2025-06-28T15:30:00',
        type: VisitType.SEGUIMIENTO,
        status: VisitStatus.PROGRAMADA,
        notes: 'Segunda visita, cliente muy interesado',
        createdAt: '2025-06-24T09:00:00',
        updatedAt: '2025-06-24T09:00:00'
    },
    {
        id: '5',
        title: 'Visita - Roberto Silva',
        clientName: 'Roberto Silva Mamani',
        clientPhone: '+591 70333444',
        clientEmail: 'roberto.silva@email.com',
        propertyAddress: 'Zona Sur, Calle 15 #789',
        agentName: 'Laura Fernández',
        startDate: '2025-06-30T16:00:00',
        endDate: '2025-06-30T17:00:00',
        type: VisitType.CIERRE,
        status: VisitStatus.PROGRAMADA,
        notes: 'Cliente listo para firmar contrato',
        createdAt: '2025-06-25T10:00:00',
        updatedAt: '2025-06-25T10:00:00'
    },
    {
        id: '6',
        title: 'Visita - Carmen Flores',
        clientName: 'Carmen Flores Quispe',
        clientPhone: '+591 70555666',
        clientEmail: 'carmen.flores@email.com',
        propertyAddress: 'Sopocachi, Av. 20 de Octubre #321',
        agentName: 'Miguel Torres',
        startDate: '2025-07-02T11:00:00',
        endDate: '2025-07-02T12:00:00',
        type: VisitType.INSPECCION,
        status: VisitStatus.PROGRAMADA,
        notes: 'Inspección técnica de la propiedad',
        createdAt: '2025-06-25T15:00:00',
        updatedAt: '2025-06-25T15:00:00'
    },
    // VISITAS PASADAS (antes del 27 de junio)
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

    // NUEVA FUNCIONALIDAD: Generar reporte PDF del historial de visitas
    static async generateVisitsReportPDF(visits: Visit[]): Promise<void> {
        // Generar contenido HTML para el reporte
        const htmlContent = this.generateReportHTML(visits)

        // Crear ventana temporal para generar PDF
        const printWindow = window.open('', '_blank')
        if (!printWindow) {
            throw new Error('No se pudo abrir la ventana para generar el PDF')
        }

        printWindow.document.write(htmlContent)
        printWindow.document.close()

        // Esperar a que se cargue el contenido y luego imprimir
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print()
                printWindow.close()
            }, 500)
        }
    }

    // Generar HTML para el reporte
    private static generateReportHTML(visits: Visit[]): string {
        const currentDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        const formatDateTime = (dateString: string) => {
            return new Date(dateString).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }

        const getStatusText = (status: VisitStatus) => {
            switch (status) {
                case VisitStatus.PROGRAMADA: return 'Programada'
                case VisitStatus.EN_CURSO: return 'En Curso'
                case VisitStatus.COMPLETADA: return 'Completada'
                case VisitStatus.CANCELADA: return 'Cancelada'
                default: return status
            }
        }

        const getTypeText = (type: VisitType) => {
            switch (type) {
                case VisitType.PRIMERA_VISITA: return 'Primera Visita'
                case VisitType.SEGUIMIENTO: return 'Seguimiento'
                case VisitType.CIERRE: return 'Cierre'
                case VisitType.INSPECCION: return 'Inspección'
                default: return type
            }
        }

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Visitas - ${currentDate}</title>
        <style>
          @page {
            margin: 2cm;
            size: A4;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #3b82f6;
            font-size: 24px;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .summary {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .summary h2 {
            margin: 0 0 10px 0;
            color: #374151;
            font-size: 18px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-top: 10px;
          }
          .summary-item {
            text-align: center;
          }
          .summary-number {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
          }
          .summary-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
          }
          .visits-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .visits-table th,
          .visits-table td {
            border: 1px solid #e5e7eb;
            padding: 8px;
            text-align: left;
            font-size: 11px;
          }
          .visits-table th {
            background-color: #f3f4f6;
            font-weight: bold;
            color: #374151;
          }
          .visits-table tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .status {
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-align: center;
          }
          .status-programada { background: #dbeafe; color: #1e40af; }
          .status-en-curso { background: #fef3c7; color: #b45309; }
          .status-completada { background: #d1fae5; color: #065f46; }
          .status-cancelada { background: #fee2e2; color: #b91c1c; }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
          }
          @media print {
            body { margin: 0; }
            .header { page-break-after: avoid; }
            .visits-table { page-break-inside: auto; }
            .visits-table tr { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>REPORTE DE HISTORIAL DE VISITAS</h1>
          <p>Generado el ${currentDate}</p>
          <p>Total de registros: ${visits.length}</p>
        </div>

        <div class="summary">
          <h2>Resumen Ejecutivo</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-number">${visits.filter(v => v.status === VisitStatus.PROGRAMADA).length}</div>
              <div class="summary-label">Programadas</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${visits.filter(v => v.status === VisitStatus.COMPLETADA).length}</div>
              <div class="summary-label">Completadas</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${visits.filter(v => v.status === VisitStatus.CANCELADA).length}</div>
              <div class="summary-label">Canceladas</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${visits.filter(v => v.status === VisitStatus.EN_CURSO).length}</div>
              <div class="summary-label">En Curso</div>
            </div>
          </div>
        </div>

        <table class="visits-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Propiedad</th>
              <th>Agente</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            ${visits.map(visit => `
              <tr>
                <td>${formatDateTime(visit.startDate)}</td>
                <td><strong>${visit.clientName}</strong></td>
                <td>${visit.clientPhone}</td>
                <td>${visit.propertyAddress}</td>
                <td>${visit.agentName}</td>
                <td>${getTypeText(visit.type)}</td>
                <td>
                  <span class="status status-${visit.status.toLowerCase().replace('_', '-')}">
                    ${getStatusText(visit.status)}
                  </span>
                </td>
                <td>${visit.notes || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Este reporte fue generado automáticamente por el Sistema de Gestión de Visitas</p>
          <p>Página 1 de 1 • ${currentDate}</p>
        </div>
      </body>
      </html>
    `
    }
}
