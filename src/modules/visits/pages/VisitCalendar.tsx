import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { CalendarEvent, VisitStatus } from '@/models/visit.model'
import { VisitService } from '@/services/visit.service'


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
        Calendario de Visitas
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
        .fc {
          background: transparent;
        }
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: #e5e7eb;
        }
        .dark .fc-theme-standard td,
        .dark .fc-theme-standard th {
          border-color: #374151;
        }
        .fc-toolbar-title {
          color: #111827;
        }
        .dark .fc-toolbar-title {
          color: #f9fafb;
        }
        .fc-button {
          background-color: #3b82f6 !important;
          border-color: #3b82f6 !important;
        }
        .fc-button:hover {
          background-color: #2563eb !important;
          border-color: #2563eb !important;
        }
        .fc-daygrid-day-number,
        .fc-col-header-cell-cushion {
          color: #374151;
        }
        .dark .fc-daygrid-day-number,
        .dark .fc-col-header-cell-cushion {
          color: #d1d5db;
        }
      `}</style>
    </div>
  )
}

export default VisitCalendar