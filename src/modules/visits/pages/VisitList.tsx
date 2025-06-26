import React, { useState, useEffect } from 'react'
import { VisitService } from '@/services/visit.service'
import { Visit, VisitStatus } from '@/models/visit.model'


const VisitList: React.FC = () => {
    const [visits, setVisits] = useState<Visit[]>([])
    const [filteredVisits, setFilteredVisits] = useState<Visit[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'past' | VisitStatus>('all')
    const [downloadingPDF, setDownloadingPDF] = useState(false)

    useEffect(() => {
        loadVisits()
    }, [])

    useEffect(() => {
        filterVisits()
    }, [visits, selectedFilter])

    const loadVisits = async () => {
        try {
            setLoading(true)
            const allVisits = await VisitService.getAllVisits()
            setVisits(allVisits)
        } catch (error) {
            console.error('Error al cargar visitas:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterVisits = () => {
        let filtered = [...visits]
        const now = new Date()

        switch (selectedFilter) {
            case 'upcoming':
                filtered = visits.filter(visit =>
                  new Date(visit.startDate) > now && visit.status === VisitStatus.PROGRAMADA
                )
                break
            case 'past':
                filtered = visits.filter(visit => new Date(visit.startDate) < now)
                break
            case VisitStatus.PROGRAMADA:
            case VisitStatus.EN_CURSO:
            case VisitStatus.COMPLETADA:
            case VisitStatus.CANCELADA:
                filtered = visits.filter(visit => visit.status === selectedFilter)
                break
            default:
                filtered = visits
        }

        setFilteredVisits(filtered)
    }

    const handleStatusChange = async (visitId: string, newStatus: VisitStatus) => {
        try {
            await VisitService.updateVisitStatus(visitId, newStatus)
            loadVisits() // Recargar visitas
        } catch (error) {
            console.error('Error al actualizar estado:', error)
        }
    }

    const handleDownloadPDF = async () => {
        try {
            setDownloadingPDF(true)
            await VisitService.generateVisitsReportPDF(filteredVisits)
        } catch (error) {
            console.error('Error al generar PDF:', error)
            alert('Error al generar el reporte PDF')
        } finally {
            setDownloadingPDF(false)
        }
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status: VisitStatus) => {
        switch (status) {
            case VisitStatus.PROGRAMADA:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            case VisitStatus.EN_CURSO:
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
            case VisitStatus.COMPLETADA:
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            case VisitStatus.CANCELADA:
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
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

    if (loading) {
        return (
          <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando visitas...</span>
          </div>
        )
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Lista de Visitas
              </h2>
              <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total: {filteredVisits.length} visitas
          </span>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF || filteredVisits.length === 0}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                      {downloadingPDF ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Generando...
                        </>
                      ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Descargar PDF
                        </>
                      )}
                  </button>
              </div>
          </div>

          {/* Filtros */}
          <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                      Todas
                  </button>
                  <button
                    onClick={() => setSelectedFilter('upcoming')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === 'upcoming'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                      Próximas
                  </button>
                  <button
                    onClick={() => setSelectedFilter('past')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === 'past'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                      Pasadas
                  </button>
                  <button
                    onClick={() => setSelectedFilter(VisitStatus.PROGRAMADA)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === VisitStatus.PROGRAMADA
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                      Programadas
                  </button>
                  <button
                    onClick={() => setSelectedFilter(VisitStatus.COMPLETADA)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === VisitStatus.COMPLETADA
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                      Completadas
                  </button>
                  <button
                    onClick={() => setSelectedFilter(VisitStatus.CANCELADA)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === VisitStatus.CANCELADA
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                      Canceladas
                  </button>
              </div>
          </div>

          {/* Lista de visitas */}
          {filteredVisits.length === 0 ? (
            <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0L4 9v10a2 2 0 002 2h12a2 2 0 002-2V9l-2-2" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                    No hay visitas con este filtro
                </h3>
            </div>
          ) : (
            <div className="space-y-4">
                {filteredVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                      <div className="flex justify-between items-start mb-3">
                          <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {visit.title}
                              </h3>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                    {getStatusText(visit.status)}
                  </span>
                          </div>
                          <div className="text-right">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDateTime(visit.startDate)}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                  hasta {formatDateTime(visit.endDate)}
                              </p>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{visit.clientName}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-500">{visit.clientPhone}</p>
                              {visit.clientEmail && (
                                <p className="text-sm text-gray-500 dark:text-gray-500">{visit.clientEmail}</p>
                              )}
                          </div>

                          <div>
                              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Propiedad</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{visit.propertyAddress}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-500">Agente: {visit.agentName}</p>
                          </div>
                      </div>

                      {visit.notes && (
                        <div className="mb-4">
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Notas</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{visit.notes}</p>
                        </div>
                      )}

                      {/* Botones de acción */}
                      <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                          {visit.status === VisitStatus.PROGRAMADA && (
                            <>
                                <button
                                  onClick={() => handleStatusChange(visit.id, VisitStatus.EN_CURSO)}
                                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                >
                                    Iniciar
                                </button>
                                <button
                                  onClick={() => handleStatusChange(visit.id, VisitStatus.CANCELADA)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                            </>
                          )}

                          {visit.status === VisitStatus.EN_CURSO && (
                            <>
                                <button
                                  onClick={() => handleStatusChange(visit.id, VisitStatus.COMPLETADA)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                >
                                    Completar
                                </button>
                                <button
                                  onClick={() => handleStatusChange(visit.id, VisitStatus.CANCELADA)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                            </>
                          )}

                          {(visit.status === VisitStatus.COMPLETADA || visit.status === VisitStatus.CANCELADA) && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 py-1">
                    Actualizado: {formatDateTime(visit.updatedAt)}
                  </span>
                          )}
                      </div>
                  </div>
                ))}
            </div>
          )}
      </div>
    )
}

export default VisitList
