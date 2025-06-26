import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import React, { useState, useEffect } from 'react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { VisitService } from '@/services/visit.service'
import interactionPlugin from '@fullcalendar/interaction'
import { CalendarEvent, VisitStatus } from '@/models/visit.model'


const VisitCalendar: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        loadEvents()
    }, [])

    const loadEvents = async () => {
        try {
            setLoading(true)
            const calendarEvents = await VisitService.getCalendarEvents()
            setEvents(calendarEvents)
        } catch (error) {
            console.error('Error al cargar eventos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEventClick = (clickInfo: any) => {
        const event = events.find(e => e.id === clickInfo.event.id)
        if (event) {
            setSelectedEvent(event)
            setShowModal(true)
        }
    }

    const handleStatusChange = async (newStatus: VisitStatus) => {
        if (!selectedEvent) return

        try {
            await VisitService.updateVisitStatus(selectedEvent.id, newStatus)
            setShowModal(false)
            loadEvents() // Recargar eventos
        } catch (error) {
            console.error('Error al actualizar estado:', error)
        }
    }

    const getStatusText = (status: VisitStatus) => {
        switch (status) {
            case VisitStatus.PROGRAMADA:
                return 'Programada'
            case VisitStatus.EN_CURSO:
                return 'En Curso'
            case VisitStatus.COMPLETADA:
                return 'Completada'
            case VisitStatus.CANCELADA:
                return 'Cancelada'
            default:
                return status
        }
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
          <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando calendario...</span>
          </div>
        )
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Google Calendar - Visitas
          </h2>

          {/* Leyenda de colores */}
          <div className="mb-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Programada</span>
              </div>
              <div className="flex items-center">
                  <div className="w-4 h-4 bg-amber-500 rounded mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">En Curso</span>
              </div>
              <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Completada</span>
              </div>
              <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Cancelada</span>
              </div>
          </div>

          {/* Calendario */}
          <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                eventClick={handleEventClick}
                height="auto"
                locale="es"
                firstDay={1} // Lunes como primer día
                buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día'
                }}
                allDaySlot={false}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5, 6], // Lunes a sábado
                    startTime: '08:00',
                    endTime: '18:00'
                }}
              />
          </div>

          {/* Modal para detalles del evento */}
          {showModal && selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {selectedEvent.title}
                            </h3>
                            <button
                              onClick={() => setShowModal(false)}
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Cliente:</span>
                                <p className="text-gray-600 dark:text-gray-400">{selectedEvent.extendedProps.clientName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEvent.extendedProps.clientPhone}</p>
                            </div>

                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Propiedad:</span>
                                <p className="text-gray-600 dark:text-gray-400">{selectedEvent.extendedProps.propertyAddress}</p>
                            </div>

                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Agente:</span>
                                <p className="text-gray-600 dark:text-gray-400">{selectedEvent.extendedProps.agentName}</p>
                            </div>

                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Horario:</span>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {formatDateTime(selectedEvent.start)} - {formatDateTime(selectedEvent.end)}
                                </p>
                            </div>

                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Estado:</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  selectedEvent.extendedProps.status === VisitStatus.PROGRAMADA ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                    selectedEvent.extendedProps.status === VisitStatus.EN_CURSO ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                      selectedEvent.extendedProps.status === VisitStatus.COMPLETADA ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                }`}>
                    {getStatusText(selectedEvent.extendedProps.status)}
                  </span>
                            </div>

                            {selectedEvent.extendedProps.notes && (
                              <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Notas:</span>
                                  <p className="text-gray-600 dark:text-gray-400">{selectedEvent.extendedProps.notes}</p>
                              </div>
                            )}
                        </div>

                        {/* Botones de acción */}
                        {selectedEvent.extendedProps.status === VisitStatus.PROGRAMADA && (
                          <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusChange(VisitStatus.EN_CURSO)}
                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                  Iniciar Visita
                              </button>
                              <button
                                onClick={() => handleStatusChange(VisitStatus.CANCELADA)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                  Cancelar
                              </button>
                          </div>
                        )}

                        {selectedEvent.extendedProps.status === VisitStatus.EN_CURSO && (
                          <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusChange(VisitStatus.COMPLETADA)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                  Completar Visita
                              </button>
                              <button
                                onClick={() => handleStatusChange(VisitStatus.CANCELADA)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                  Cancelar
                              </button>
                          </div>
                        )}
                    </div>
                </div>
            </div>
          )}

          <style>{`
        /* Contenedor principal del calendario */
        .fc {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dark .fc {
          background: #1f2937;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        }

        /* Header del calendario */
        .fc-header-toolbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px 24px;
          margin: 0 !important;
          border-radius: 0;
        }

        .dark .fc-header-toolbar {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        }

        .fc-toolbar-title {
          color: white !important;
          font-size: 24px !important;
          font-weight: 600 !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* Botones del header */
        .fc-button {
          background: rgba(255, 255, 255, 0.2) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 8px !important;
          color: white !important;
          font-weight: 500 !important;
          padding: 8px 16px !important;
          transition: all 0.2s ease !important;
          backdrop-filter: blur(10px);
        }

        .fc-button:hover {
          background: rgba(255, 255, 255, 0.3) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .fc-button:disabled {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          opacity: 0.6;
        }

        .fc-button-active {
          background: rgba(255, 255, 255, 0.4) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Encabezados de los días */
        .fc-col-header {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }

        .dark .fc-col-header {
          background: #374151;
          border-bottom-color: #4b5563;
        }

        .fc-col-header-cell {
          padding: 12px 8px;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
        }

        .fc-col-header-cell-cushion {
          color: #64748b !important;
          font-weight: 600 !important;
        }

        .dark .fc-col-header-cell-cushion {
          color: #9ca3af !important;
        }

        /* Celdas del calendario */
        .fc-daygrid-day {
          transition: background-color 0.2s ease;
        }

        .fc-daygrid-day:hover {
          background-color: #f1f5f9;
        }

        .dark .fc-daygrid-day:hover {
          background-color: #374151;
        }

        .fc-daygrid-day-frame {
          min-height: 100px;
          padding: 4px;
        }

        /* Números de los días */
        .fc-daygrid-day-number {
          color: #475569 !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          padding: 8px !important;
          width: 32px !important;
          height: 32px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          transition: all 0.2s ease !important;
        }

        .dark .fc-daygrid-day-number {
          color: #d1d5db !important;
        }

        .fc-day-today .fc-daygrid-day-number {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
          color: white !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }

        /* Eventos */
        .fc-event {
          border: none !important;
          border-radius: 6px !important;
          padding: 2px 6px !important;
          margin: 1px 2px !important;
          font-size: 11px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }

        .fc-event:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          z-index: 999 !important;
        }

        .fc-event-title {
          font-weight: 500 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }

        /* Eventos por estado con gradientes */
        .fc-event[style*="rgb(59, 130, 246)"] {
          background: linear-gradient(135deg, #3b82f6, #1e40af) !important;
          color: white !important;
        }

        .fc-event[style*="rgb(245, 158, 11)"] {
          background: linear-gradient(135deg, #f59e0b, #d97706) !important;
          color: white !important;
        }

        .fc-event[style*="rgb(16, 185, 129)"] {
          background: linear-gradient(135deg, #10b981, #059669) !important;
          color: white !important;
        }

        .fc-event[style*="rgb(239, 68, 68)"] {
          background: linear-gradient(135deg, #ef4444, #dc2626) !important;
          color: white !important;
        }

        /* Bordes de las celdas */
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: #e2e8f0 !important;
          border-width: 1px !important;
        }

        .dark .fc-theme-standard td,
        .dark .fc-theme-standard th {
          border-color: #4b5563 !important;
        }

        /* Vista de semana y día */
        .fc-timegrid-slot {
          height: 40px;
          border-color: #f1f5f9 !important;
        }

        .dark .fc-timegrid-slot {
          border-color: #374151 !important;
        }

        .fc-timegrid-slot-label {
          color: #64748b !important;
          font-size: 11px !important;
          font-weight: 500 !important;
        }

        .dark .fc-timegrid-slot-label {
          color: #9ca3af !important;
        }

        /* Línea de tiempo actual */
        .fc-timegrid-now-indicator-line {
          border-color: #ef4444 !important;
          border-width: 2px !important;
        }

        .fc-timegrid-now-indicator-arrow {
          border-left-color: #ef4444 !important;
          border-width: 6px !important;
        }

        /* Efecto glassmorphism para el contenedor principal */
        .calendar-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0;
          overflow: hidden;
        }

        .dark .calendar-container {
          background: rgba(31, 41, 55, 0.95);
          border-color: rgba(255, 255, 255, 0.1);
        }

        /* Animaciones suaves */
        .fc-view-harness {
          transition: all 0.3s ease;
        }

        /* Scrollbar personalizada */
        .fc-scroller::-webkit-scrollbar {
          width: 8px;
        }

        .fc-scroller::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .fc-scroller::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .fc-scroller::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .dark .fc-scroller::-webkit-scrollbar-track {
          background: #374151;
        }

        .dark .fc-scroller::-webkit-scrollbar-thumb {
          background: #6b7280;
        }

        .dark .fc-scroller::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Efectos adicionales */
        .fc-event-main {
          padding: 1px 0;
        }

        .fc-daygrid-event-harness {
          margin-bottom: 1px;
        }

        /* Responsivo */
        @media (max-width: 768px) {
          .fc-header-toolbar {
            padding: 16px;
            flex-direction: column;
            gap: 12px;
          }

          .fc-toolbar-title {
            font-size: 20px !important;
            order: -1;
          }

          .fc-button {
            padding: 6px 12px !important;
            font-size: 12px !important;
          }

          .fc-daygrid-day-frame {
            min-height: 80px;
          }
        }
      `}</style>
      </div>
    )
}

export default VisitCalendar
