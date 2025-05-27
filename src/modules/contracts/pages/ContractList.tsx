import { API_URL } from '@/config/constants'
import React, { useState, useEffect } from 'react'



// Interfaces para tipar los datos
interface Property {
  id: string
  createdAt: string
  updatedAt: string
  descripcion: string
  precio: string
  estado: string
  area: string
  NroHabitaciones: number
  NroBanos: number
  NroEstacionamientos: number
}

interface PaymentMethod {
  id: string
  createdAt: string
  updatedAt: string
  name: string
}

interface Contract {
  id: string
  createdAt: string
  updatedAt: string
  contractNumber: number
  type: string
  status: string
  amount: string
  startDate: string
  endDate: string
  clientName: string
  clientDocument: string
  clientPhone: string
  clientEmail: string
  agentName: string
  agentDocument: string
  contractContent: string
  contractFormat: string
  notes: string
  property: Property
  payment_method: PaymentMethod
}

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)

  // Función para obtener los contratos del API
  const fetchContracts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_URL}/api/contracts`)
      
      if (!response.ok) {
        throw new Error(`Error al obtener contratos: ${response.status}`)
      }
      
      const data: Contract[] = await response.json()
      setContracts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  // Cargar contratos al montar el componente
  useEffect(() => {
    fetchContracts()
  }, [])

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Función para formatear montos
  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount))
  }

  // Función para decodificar y mostrar el contenido del contrato
  const viewContract = (contract: Contract) => {
    setSelectedContract(contract)
    setShowModal(true)
  }

  // Función para decodificar Base64
  const decodeBase64Content = (content: string) => {
    try {
      // Remover el prefijo data:text/html;base64, si existe
      const base64Content = content.replace(/^data:text\/html;base64,/, '')
      return atob(base64Content)
    } catch (error) {
      return 'Error al decodificar el contenido del contrato'
    }
  }

  // Componente de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando contratos...</span>
      </div>
    )
  }

  // Componente de error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold">Error al cargar contratos</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchContracts}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Lista de Contratos</h1>
        <p className="text-gray-600">Total de contratos: {contracts.length}</p>
      </div>

      {contracts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-500">No hay contratos visibles</h3>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contracts.map((contract) => (
            <div key={contract.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header del contrato */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Contrato #{contract.contractNumber}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      contract.status === 'VIGENTE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    contract.type === 'VENTA' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {contract.type}
                  </span>
                </div>

                {/* Información del cliente */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Cliente</h4>
                  <p className="text-sm text-gray-600">{contract.clientName}</p>
                  <p className="text-sm text-gray-500">CI: {contract.clientDocument}</p>
                  <p className="text-sm text-gray-500">{contract.clientEmail}</p>
                </div>

                {/* Información del agente */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Agente</h4>
                  <p className="text-sm text-gray-600">{contract.agentName}</p>
                  <p className="text-sm text-gray-500">CI: {contract.agentDocument}</p>
                </div>

                {/* Información financiera */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Monto:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatAmount(contract.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Método de pago:</span>
                    <span className="text-sm font-medium capitalize">
                      {contract.payment_method.name.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Fechas */}
                <div className="mb-4 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Inicio:</span>
                    <span>{formatDate(contract.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fin:</span>
                    <span>{formatDate(contract.endDate)}</span>
                  </div>
                </div>

                {/* Información de la propiedad */}
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <h5 className="font-medium text-gray-700 mb-2">Propiedad</h5>
                  <p className="text-sm text-gray-600 mb-1">{contract.property.descripcion}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                    <span>{contract.property.area}m²</span>
                    <span>{contract.property.NroHabitaciones} hab.</span>
                    <span>{contract.property.NroBanos} baños</span>
                  </div>
                </div>

                {/* Notas */}
                {contract.notes && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">Notas: </span>
                    <span className="text-sm text-gray-600">{contract.notes}</span>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={() => viewContract(contract)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Ver Contrato
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para mostrar el contrato */}
      {showModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                Contrato #{selectedContract.contractNumber} - {selectedContract.clientName}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-100px)]">
              {selectedContract.contractFormat === 'html' ? (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: decodeBase64Content(selectedContract.contractContent) 
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Contenido del contrato en formato {selectedContract.contractFormat}
                  </p>
                  <a
                    href={selectedContract.contractContent}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block"
                  >
                    Abrir en nueva ventana
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContractList
