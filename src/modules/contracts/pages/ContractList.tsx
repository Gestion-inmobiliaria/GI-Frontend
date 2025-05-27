import { API_URL } from '@/config/constants'
import React, { useState, useEffect } from 'react'
import { ContractService } from '@/services/contract.service'
import { Contract, ContractFormat } from '@/models/contract.model'



const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchContracts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/contracts`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        })

        if (!isMounted) return

        if (response.status === 204) {
          setContracts([])
          return
        }

        if (response.ok) {
          const data = await response.json()
          if (data?.data) {
            setContracts(data.data)
          } else {
            setContracts([])
          }
        } else {
          setError('Error al cargar los contratos')
        }
      } catch (error) {
        if (!isMounted) return
        console.error('Error:', error)
        setError('Error al cargar los contratos')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchContracts()

    return () => {
      isMounted = false
    }
  }, [])

  const handleViewContract = (contract: Contract) => {
    ContractService.previewContract(contract.contractContent, contract.contractFormat as ContractFormat)
  }

  const handleDownloadContract = (contract: Contract) => {
    ContractService.downloadContract(
      contract.contractContent,
      contract.contractNumber.toString(),
      contract.contractFormat as ContractFormat
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Contratos Existentes</h2>
      
      {contracts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No hay contratos disponibles
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.contractNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${contract.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(contract.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      contract.status === 'VIGENTE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewContract(contract)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleDownloadContract(contract)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ContractList
