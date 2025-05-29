import { API_URL } from '@/config/constants'
import React, { useState, useEffect } from 'react'
import { ContractService } from '@/services/contract.service'
import { 
  ContractFormData, 
  ContractWithSignatureFormData,
  ContractType, 
  ContractFormat,
  Property 
} from '@/models/contract.model'


const PAYMENT_METHODS = {
    EFECTIVO: '27677348-8a2d-44a7-9902-41e8f1fbc9b6',
    TARJETA: '53cffd4c-36db-4e73-852d-45e6f1d746be',
    QR: '89c098f0-8cf4-4c87-8128-ecd6aaf98c77',
    CRYPTO: 'd45f9723-b4de-4c56-8fa8-1a6184c5a0db'
}

interface PropertyResponse {
    id: string;
    descripcion: string;
    precio: string;
    ubicacion: {
      direccion: string;
      ciudad: string;
    };
}

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
    paymentMethodId: PAYMENT_METHODS.EFECTIVO,
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [contractFormat, setContractFormat] = useState<ContractFormat>(ContractFormat.HTML)
  const [properties, setProperties] = useState<PropertyResponse[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  // NUEVOS ESTADOS PARA FIRMA DIGITAL
  const [contractMode, setContractMode] = useState<'traditional' | 'signature'>('traditional')
  const [signatureEmails, setSignatureEmails] = useState({
    clientEmail: '',
    agentEmail: ''
  })

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_URL}/api/property`)
        const data = await response.json()
        if (data.statusCode === 200) {
          setProperties(data.data)
        }
      } catch (error) {
        console.error('Error al cargar propiedades:', error)
        setMessage('Error al cargar las propiedades')
      }
    }

    fetchProperties()
  }, [])

  useEffect(() => {
    if (formData.propertyId) {
      const property = properties.find(p => p.id === formData.propertyId)
      if (property) {
        setSelectedProperty({
          id: property.id,
          address: property.ubicacion.direccion,
          price: parseFloat(property.precio),
          description: property.descripcion,
          city: property.ubicacion.ciudad
        })
      }
    }
  }, [formData.propertyId, properties])

  // Sincronizar emails cuando cambien en el formulario principal
  useEffect(() => {
    if (formData.clientEmail && contractMode === 'signature' && !signatureEmails.clientEmail) {
      setSignatureEmails(prev => ({
        ...prev,
        clientEmail: formData.clientEmail || ''
      }))
    }
  }, [formData.clientEmail, contractMode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSignatureEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignatureEmails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!selectedProperty) {
      setMessage('Por favor seleccione una propiedad')
      return false
    }

    // Validaciones específicas para modo firma
    if (contractMode === 'signature') {
      if (!signatureEmails.clientEmail || !signatureEmails.agentEmail) {
        setMessage('Los emails del cliente y agente son requeridos para el proceso de firma')
        return false
      }
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(signatureEmails.clientEmail) || !emailRegex.test(signatureEmails.agentEmail)) {
        setMessage('Por favor ingrese emails válidos')
        return false
      }
    }

    return true
  }

  const handlePreview = async () => {
    try {
      if (!validateForm()) return

      const htmlContent = ContractService.generateHTMLContent(formData, selectedProperty!)
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
      if (!validateForm()) return

      console.log('Datos del formulario:', formData)
      console.log('Datos de la propiedad:', selectedProperty)
      console.log('Formato seleccionado:', contractFormat)
      console.log('Modo de contrato:', contractMode)

      if (contractMode === 'traditional') {
        // Flujo tradicional (sin firma)
        const payload = await ContractService.prepareCreatePayload(
          formData, 
          selectedProperty!, 
          contractFormat
        )
        
        await ContractService.saveContract(payload)
        
        ContractService.downloadContract(
          payload.contractContent, 
          payload.contractNumber.toString(), 
          contractFormat
        )
        
        setMessage('¡Contrato generado exitosamente!')
        
      } else {
        // Flujo con firma digital
        const formDataWithSignature: ContractWithSignatureFormData = {
          ...formData,
          clientEmailForSignature: signatureEmails.clientEmail,
          agentEmailForSignature: signatureEmails.agentEmail
        }

        const payload = await ContractService.prepareCreateWithSignaturePayload(
          formDataWithSignature,
          selectedProperty!,
          contractFormat
        )

        const result = await ContractService.saveContractWithSignature(payload)
        
        setMessage(`¡Contrato creado exitosamente! ${result.signatureProcess.message}`)
      }
      
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
        paymentMethodId: PAYMENT_METHODS.EFECTIVO,
        notes: ''
      })
      
      setSignatureEmails({
        clientEmail: '',
        agentEmail: ''
      })
      
    } catch (error) {
      console.error('Error:', error)
      setMessage('Error al generar el contrato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Generar Nuevo Contrato
      </h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('Error') 
            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
        }`}>
          {message}
        </div>
      )}
      
      <div className="space-y-6">
        {/* NUEVA SECCIÓN: Modo de Contrato */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Modo de Contrato
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600">
              <input
                type="radio"
                name="contractMode"
                value="traditional"
                checked={contractMode === 'traditional'}
                onChange={(e) => setContractMode(e.target.value as 'traditional' | 'signature')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Contrato Tradicional</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Generar y descargar inmediatamente</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600">
              <input
                type="radio"
                name="contractMode"
                value="signature"
                checked={contractMode === 'signature'}
                onChange={(e) => setContractMode(e.target.value as 'traditional' | 'signature')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Con Firma Digital</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Enviar para firma por email</div>
              </div>
            </label>
          </div>
        </div>

        {/* Información del Contrato */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Información del Contrato
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Número de Contrato
              </label>
              <input
                type="number"
                name="contractNumber"
                value={formData.contractNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="12345"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Tipo de Contrato
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={ContractType.VENTA}>Venta</option>
                <option value={ContractType.COMPRA}>Compra</option>
                <option value={ContractType.ANTICRETICO}>Anticrético</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Formato de Salida
              </label>
              <select
                value={contractFormat}
                onChange={(e) => setContractFormat(e.target.value as ContractFormat)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={ContractFormat.HTML}>HTML</option>
                <option value={ContractFormat.PDF}>PDF</option>
              </select>
            </div>
          </div>
        </div>

        {/* Datos del Cliente */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Datos del Cliente
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Nombre Completo
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Juan Pérez García"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                CI/NIT
              </label>
              <input
                type="text"
                name="clientDocument"
                value={formData.clientDocument}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="12345678"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Teléfono (Opcional)
              </label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="+591 70000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Email {contractMode === 'signature' ? '(Requerido para firma)' : '(Opcional)'}
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="cliente@email.com"
                required={contractMode === 'signature'}
              />
            </div>
          </div>
        </div>

        {/* Datos del Agente */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Datos del Agente
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Nombre del Agente
              </label>
              <input
                type="text"
                name="agentName"
                value={formData.agentName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="María García López"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                CI del Agente
              </label>
              <input
                type="text"
                name="agentDocument"
                value={formData.agentDocument}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="87654321"
                required
              />
            </div>
          </div>
        </div>

        {/* NUEVA SECCIÓN: Emails para Firma Digital (solo si está en modo firma) */}
        {contractMode === 'signature' && (
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Emails para Proceso de Firma
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                    Proceso de Firma Digital
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Se enviarán enlaces únicos de firma a los emails especificados. Cada parte podrá firmar el contrato digitalmente desde cualquier dispositivo.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Email del Cliente para Firma
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={signatureEmails.clientEmail}
                  onChange={handleSignatureEmailChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="cliente@email.com"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  El cliente recibirá un enlace para firmar el contrato
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Email del Agente para Firma
                </label>
                <input
                  type="email"
                  name="agentEmail"
                  value={signatureEmails.agentEmail}
                  onChange={handleSignatureEmailChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="agente@inmobiliaria.com"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  El agente recibirá un enlace para firmar el contrato
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detalles del Contrato */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Detalles del Contrato
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Propiedad
              </label>
              <select
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Seleccione una propiedad</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.ubicacion.direccion} - ${property.precio}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Monto (USD)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="150000"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Fecha de Término
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Método de Pago
              </label>
              <select
                name="paymentMethodId"
                value={formData.paymentMethodId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={PAYMENT_METHODS.EFECTIVO}>Efectivo</option>
                <option value={PAYMENT_METHODS.TARJETA}>Tarjeta de crédito</option>
                <option value={PAYMENT_METHODS.QR}>Código QR</option>
                <option value={PAYMENT_METHODS.CRYPTO}>Crypto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Observaciones (Opcional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            rows={3}
            placeholder="Notas adicionales sobre el contrato..."
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            className="flex-1 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
          >
            Vista Previa
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {contractMode === 'signature' ? 'Enviando...' : 'Generando...'}
              </>
            ) : (
              <>
                {contractMode === 'signature' ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Crear y Enviar para Firma
                  </>
                ) : (
                  'Generar y Guardar Contrato'
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContractGenerator