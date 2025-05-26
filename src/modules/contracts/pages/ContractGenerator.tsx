import React, { useState } from 'react'
import { ContractService } from '@/services/contract.service'
import { 
    ContractFormData, 
    ContractType, 
    ContractFormat,
    Property 
} from '@/models/contract.model'



const ContractGenerator: React.FC = () => {
  const [formData, setFormData] = useState<ContractFormData>({
    contractNumber: '',
    type: ContractType.VENTA,
    clientName: '',
    clientDocument: '',
    clientPhone: '',
    clientEmail: '',
    agentName: '',
    agentDocument: '',
    amount: '',
    startDate: '',
    endDate: '',
    propertyId: '',
    paymentMethodId: '1',
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  // const [previewMode, setPreviewMode] = useState(false)
  const [contractFormat, setContractFormat] = useState<ContractFormat>(ContractFormat.HTML)

  // Datos de ejemplo - en producción vendrían del backend
  const mockProperty: Property = {
    id: '1',
    address: 'Av. Arce #2345, Edificio Torre Sol, Piso 10',
    price: 150000,
    city: 'La Paz',
    zone: 'Zona Sur'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePreview = async () => {
    try {
      const htmlContent = ContractService.generateHTMLContent(formData, mockProperty)
      let contractContent: string
      
      if (contractFormat === ContractFormat.PDF) {
        contractContent = await ContractService.htmlToPdfBase64(htmlContent)
      } else {
        contractContent = ContractService.htmlToBase64(htmlContent)
      }
      
      ContractService.previewContract(contractContent, contractFormat)
    } catch (error) {
      console.error('Error al generar vista previa:', error)
      setMessage('Error al generar vista previa')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      console.log('Datos del formulario:', formData)
      console.log('Datos de la propiedad:', mockProperty)
      console.log('Formato seleccionado:', contractFormat)

      // Generar payload
      const payload = await ContractService.prepareCreatePayload(
        formData, 
        mockProperty, 
        contractFormat
      )
      
      // Guardar contrato
      await ContractService.saveContract(payload)
      
      // Descargar el contrato
      ContractService.downloadContract(
        payload.contractContent, 
        payload.contractNumber.toString(), 
        contractFormat
      )
      
      setMessage('¡Contrato generado exitosamente!')
      
      // Limpiar formulario
      setFormData({
        contractNumber: '',
        type: ContractType.VENTA,
        clientName: '',
        clientDocument: '',
        clientPhone: '',
        clientEmail: '',
        agentName: '',
        agentDocument: '',
        amount: '',
        startDate: '',
        endDate: '',
        propertyId: '',
        paymentMethodId: '1',
        notes: ''
      })
      
    } catch (error) {
      console.error('Error:', error)
      setMessage('Error al generar el contrato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Generar Nuevo Contrato</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Información del Contrato */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Información del Contrato</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Número de Contrato</label>
              <input
                type="number"
                name="contractNumber"
                value={formData.contractNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="12345"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Contrato</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value={ContractType.VENTA}>Venta</option>
                <option value={ContractType.COMPRA}>Compra</option>
                <option value={ContractType.ANTICRETICO}>Anticrético</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Formato de Salida</label>
              <select
                value={contractFormat}
                onChange={(e) => setContractFormat(e.target.value as ContractFormat)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value={ContractFormat.HTML}>HTML</option>
                <option value={ContractFormat.PDF}>PDF</option>
              </select>
            </div>
          </div>
        </div>

        {/* Datos del Cliente */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Datos del Cliente</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre Completo</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Pérez García"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">CI/NIT</label>
              <input
                type="text"
                name="clientDocument"
                value={formData.clientDocument}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="12345678"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Teléfono (Opcional)</label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="+591 70000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email (Opcional)</label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="cliente@email.com"
              />
            </div>
          </div>
        </div>

        {/* Datos del Agente */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Datos del Agente</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Agente</label>
              <input
                type="text"
                name="agentName"
                value={formData.agentName}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="María García López"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">CI del Agente</label>
              <input
                type="text"
                name="agentDocument"
                value={formData.agentDocument}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="87654321"
                required
              />
            </div>
          </div>
        </div>

        {/* Detalles del Contrato */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Detalles del Contrato</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ID de Propiedad</label>
              <input
                type="number"
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Monto (USD)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="150000"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Inicio</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Término</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Método de Pago</label>
              <select
                name="paymentMethodId"
                value={formData.paymentMethodId}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Transferencia Bancaria</option>
                <option value="2">Efectivo</option>
                <option value="3">Cheque</option>
              </select>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium mb-1">Observaciones (Opcional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Notas adicionales sobre el contrato..."
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
          >
            Vista Previa
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Generando...' : 'Generar y Guardar Contrato'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContractGenerator
