import { API_URL } from '@/config/constants'
import React, { useState, useEffect } from 'react'
import SignatureStatusBadge from '@/components/contracts/SignatureStatusBadge'
import { ContractSignatureService } from '@/services/contract-signature.service'
import { Contract, SignatureStatus, SignerType, SignatureStatusResponse } from '@/models/contract.model'


// Interface para el contrato actualizada
// interface Property {
//     id: string
//     createdAt: string
//     updatedAt: string
//     descripcion: string
//     precio: string
//     estado: string
//     area: string
//     NroHabitaciones: number
//     NroBanos: number
//     NroEstacionamientos: number
// }

// interface PaymentMethod {
//     id: string
//     createdAt: string
//     updatedAt: string
//     name: string
// }

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [signatureStatusFilter, setSignatureStatusFilter] = useState<SignatureStatus | ''>('')
  const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false)
  const [signatureDetails, setSignatureDetails] = useState<SignatureStatusResponse | null>(null)

  // Función para obtener los contratos del API
  const fetchContracts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let url = `${API_URL}/api/contracts`
      if (signatureStatusFilter) {
        url += `?signatureStatus=${signatureStatusFilter}`
      }
      
      const response = await fetch(url)
      
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

  // Cargar contratos al montar el componente y cuando cambie el filtro
  useEffect(() => {
    fetchContracts()
  }, [signatureStatusFilter])

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Función para formatear montos
  const formatAmount = (amount: string | number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount)
  }

  // Función para decodificar y mostrar el contenido del contrato
  const viewContract = (contract: Contract) => {
    setSelectedContract(contract)
    setShowModal(true)
  }

  // NUEVA FUNCIÓN: Ver detalles de firma
  const viewSignatureDetails = async (contract: Contract) => {
    try {
      const details = await ContractSignatureService.getSignatureStatus(contract.id)
      setSignatureDetails(details)
      setSelectedContract(contract)
      setShowSignatureModal(true)
    } catch (error) {
      console.error('Error al obtener detalles de firma:', error)
      alert('Error al cargar detalles de firma')
    }
  }

  // NUEVA FUNCIÓN: Iniciar proceso de firma para contrato existente
  const initiateSignature = async (contract: Contract) => {
    const clientEmail = prompt('Ingrese email del cliente:', contract.clientEmail || '')
    const agentEmail = prompt('Ingrese email del agente:', 'agente@inmobiliaria.com')

    if (!clientEmail || !agentEmail) {
      alert('Ambos emails son requeridos')
      return
    }

    try {
      const result = await ContractSignatureService.initiateSignatureProcess(contract.id, {
        clientEmail,
        agentEmail
      })
      
      alert(`Proceso de firma iniciado exitosamente.\n\n${result.message}`)
      fetchContracts() // Recargar lista
    } catch (error) {
      console.error('Error al iniciar proceso de firma:', error)
      alert('Error al iniciar proceso de firma')
    }
  }

  // NUEVA FUNCIÓN: Reenviar invitación
  const resendInvitation = async (contractId: string, signerType: SignerType) => {
    try {
      const result = await ContractSignatureService.resendSignatureInvitation(contractId, signerType)
      alert(result.message)
      fetchContracts() // Recargar lista
    } catch (error) {
      console.error('Error al reenviar invitación:', error)
      alert('Error al reenviar invitación')
    }
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
      <div className="flex justify-center items-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando contratos...</span>
      </div>
    )
  }

  // Componente de error
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold">Error al cargar contratos</h3>
        </div>
        <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
        <button
          onClick={fetchContracts}
          className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Lista de Contratos</h1>
        <p className="text-gray-600 dark:text-gray-300">Total de contratos: {contracts.length}</p>
        
        {/* NUEVO: Filtro por estado de firma */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filtrar por estado de firma:
          </label>
          <select
            value={signatureStatusFilter}
            onChange={(e) => setSignatureStatusFilter(e.target.value as SignatureStatus | '')}
            className="w-full md:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Todos los contratos</option>
            <option value={SignatureStatus.NO_REQUIRED}>Sin firma requerida</option>
            <option value={SignatureStatus.PENDING_SIGNATURES}>Pendiente de firmas</option>
            <option value={SignatureStatus.PARTIALLY_SIGNED}>Firmado parcialmente</option>
            <option value={SignatureStatus.FULLY_SIGNED}>Completamente firmado</option>
            <option value={SignatureStatus.SIGNATURE_EXPIRED}>Firmas expiradas</option>
          </select>
        </div>
      </div>

      {contracts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
            {signatureStatusFilter ? 'No hay contratos con este estado de firma' : 'No hay contratos disponibles'}
          </h3>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contracts.map((contract) => (
            <div key={contract.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header del contrato */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Contrato #{contract.contractNumber}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      contract.status === 'VIGENTE' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    contract.type === 'VENTA' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                  }`}>
                    {contract.type}
                  </span>
                </div>

                {/* NUEVO: Estado de firma */}
                <div className="mb-4">
                  <SignatureStatusBadge 
                    status={contract.signatureStatus} 
                    size="sm"
                    className="w-full justify-center"
                  />
                  {contract.signatureStatus !== SignatureStatus.NO_REQUIRED && (
                    <button
                      onClick={() => viewSignatureDetails(contract)}
                      className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Ver detalles de firma
                    </button>
                  )}
                </div>

                {/* Información del cliente */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contract.clientName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">CI: {contract.clientDocument}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{contract.clientEmail}</p>
                </div>

                {/* Información del agente */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Agente</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contract.agentName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">CI: {contract.agentDocument}</p>
                </div>

                {/* Información financiera */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Monto:</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatAmount(contract.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Método de pago:</span>
                    <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                      {contract.payment_method.name.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Fechas */}
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
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
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Propiedad</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{contract.property.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{contract.property.address}</span>
                    <span>${contract.property.price}</span>
                    <span>{contract.property.city}</span>
                  </div>
                </div>

                {/* Notas */}
                {contract.notes && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notas: </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{contract.notes}</span>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={() => viewContract(contract)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Ver Contrato
                  </button>
                  
                  {/* NUEVO: Botón para iniciar firma si no tiene proceso de firma */}
                  {contract.signatureStatus === SignatureStatus.NO_REQUIRED && (
                    <button
                      onClick={() => initiateSignature(contract)}
                      className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Iniciar Firma
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para mostrar el contrato */}
      {showModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contrato #{selectedContract.contractNumber} - {selectedContract.clientName}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-100px)] bg-white dark:bg-gray-800">
              {selectedContract.contractFormat === 'html' ? (
                <div 
                  className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
                  dangerouslySetInnerHTML={{ 
                    __html: decodeBase64Content(selectedContract.contractContent) 
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Contenido del contrato en formato {selectedContract.contractFormat}
                  </p>
                  <a
                    href={selectedContract.contractContent}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-block transition-colors"
                  >
                    Abrir en nueva ventana
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NUEVO: Modal para detalles de firma */}
      {showSignatureModal && selectedContract && signatureDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Estado de Firmas - Contrato #{selectedContract.contractNumber}
              </h2>
              <button
                onClick={() => setShowSignatureModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-100px)]">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Estado General</h3>
                  <SignatureStatusBadge status={signatureDetails.signatureStatus as SignatureStatus} />
                </div>
                
                {signatureDetails.signatureStartedAt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Proceso iniciado: {formatDate(signatureDetails.signatureStartedAt)}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Firmas Individuales</h4>
                
                {signatureDetails.signatures.map((signature, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {signature.signerName}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {signature.signerType === 'CLIENT' ? 'Cliente' : 'Agente'}
                        </p>
                      </div>
                      <SignatureStatusBadge 
                        status={signature.status as any} 
                        size="sm"
                      />
                    </div>
                    
                    {signature.signedAt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Firmado: {formatDate(signature.signedAt)}
                      </p>
                    )}
                    
                    {signature.status === 'PENDING' && (
                      <button
                        onClick={() => resendInvitation(selectedContract.id, signature.signerType)}
                        className="mt-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        Reenviar invitación
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {signatureDetails.isFullySigned && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      ¡Contrato completamente firmado!
                    </span>
                  </div>
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