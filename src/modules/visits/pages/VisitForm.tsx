import React, { useState, useEffect } from 'react'
import { VisitService } from '@/services/visit.service'
import { EmailService } from '@/services/email.service'
import { VisitFormData, VisitType } from '@/models/visit.model'


interface VisitFormProps {
    onSuccess: () => void
}

const VisitForm: React.FC<VisitFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState<VisitFormData>({
        title: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        propertyId: '',
        agentName: '',
        startDate: '',
        endDate: '',
        type: VisitType.PRIMERA_VISITA,
        notes: ''
    })

    const [properties, setProperties] = useState<Array<{id: string, address: string, price: string}>>([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [sendEmail, setSendEmail] = useState(true) // Nueva opción para enviar correo

    useEffect(() => {
        loadProperties()
    }, [])

    const loadProperties = async () => {
        try {
            const props = await VisitService.getProperties()
            setProperties(props)
        } catch (error) {
            console.error('Error al cargar propiedades:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Auto-generar título
        if (name === 'clientName') {
            setFormData(prev => ({
                ...prev,
                title: value ? `Visita - ${value}` : ''
            }))
        }

        // Auto-calcular fecha de fin (1 hora después)
        if (name === 'startDate' && value) {
            const startDate = new Date(value)
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // +1 hora
            setFormData(prev => ({
                ...prev,
                endDate: endDate.toISOString().slice(0, 16)
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            // Validaciones
            if (!formData.clientName || !formData.propertyId || !formData.agentName || !formData.startDate) {
                setMessage('Por favor complete todos los campos requeridos')
                return
            }

            if (new Date(formData.startDate) <= new Date()) {
                setMessage('La fecha debe ser futura')
                return
            }

            await VisitService.createVisit(formData)

            // Enviar correo de confirmación si está habilitado y hay email
            if (sendEmail && formData.clientEmail) {
                try {
                    const visitData = {
                        id: Date.now().toString(),
                        title: `Visita - ${formData.clientName}`,
                        clientName: formData.clientName,
                        clientPhone: formData.clientPhone,
                        clientEmail: formData.clientEmail,
                        propertyAddress: properties.find(p => p.id === formData.propertyId)?.address || '',
                        agentName: formData.agentName,
                        startDate: formData.startDate,
                        endDate: formData.endDate,
                        type: formData.type,
                        status: 'PROGRAMADA' as any,
                        notes: formData.notes,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }

                    const emailSent = await EmailService.sendVisitNotification(visitData)
                    if (emailSent) {
                        setMessage('¡Visita agendada exitosamente! Se ha enviado un correo de confirmación al cliente.')
                    } else {
                        setMessage('¡Visita agendada exitosamente! (No se pudo enviar el correo de confirmación)')
                    }
                } catch (emailError) {
                    console.error('Error enviando correo:', emailError)
                    setMessage('¡Visita agendada exitosamente! (Error al enviar correo de confirmación)')
                }
            } else {
                setMessage('¡Visita agendada exitosamente!')
            }

            // Limpiar formulario
            setFormData({
                title: '',
                clientName: '',
                clientPhone: '',
                clientEmail: '',
                propertyId: '',
                agentName: '',
                startDate: '',
                endDate: '',
                type: VisitType.PRIMERA_VISITA,
                notes: ''
            })

            // Redirigir al calendario después de 2 segundos
            setTimeout(() => {
                onSuccess()
            }, 2000)

        } catch (error) {
            console.error('Error:', error)
            setMessage('Error al agendar la visita')
        } finally {
            setLoading(false)
        }
    }

    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Agendar Nueva Visita
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

          <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del Cliente */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      Información del Cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                              Nombre del Cliente *
                          </label>
                          <input
                            type="text"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Juan Pérez García"
                            required
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                              Teléfono *
                          </label>
                          <input
                            type="tel"
                            name="clientPhone"
                            value={formData.clientPhone}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="+591 70123456"
                            required
                          />
                      </div>

                      <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                              Email (Opcional)
                          </label>
                          <input
                            type="email"
                            name="clientEmail"
                            value={formData.clientEmail}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="cliente@email.com"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Si proporciona un email, se enviará una confirmación automática
                          </p>
                      </div>

                      {/* Opción para enviar correo */}
                      {formData.clientEmail && (
                        <div className="md:col-span-2">
                            <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={sendEmail}
                                  onChange={(e) => setSendEmail(e.target.checked)}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    📧 Enviar correo de confirmación al cliente
                  </span>
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                                Se enviará un correo con todos los detalles de la visita
                            </p>
                        </div>
                      )}
                  </div>
              </div>

              {/* Información de la Visita */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      Detalles de la Visita
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                              Propiedad *
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
                                    {property.address} - ${property.price}
                                </option>
                              ))}
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                              Tipo de Visita
                          </label>
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                              <option value={VisitType.PRIMERA_VISITA}>Primera Visita</option>
                              <option value={VisitType.SEGUIMIENTO}>Seguimiento</option>
                              <option value={VisitType.CIERRE}>Cierre</option>
                              <option value={VisitType.INSPECCION}>Inspección</option>
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                              Agente Responsable *
                          </label>
                          <input
                            type="text"
                            name="agentName"
                            value={formData.agentName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="María García"
                            required
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                              Título de la Visita
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Se genera automáticamente"
                          />
                      </div>
                  </div>
              </div>

              {/* Horario */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      Horario
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                              Fecha y Hora de Inicio *
                          </label>
                          <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                              Fecha y Hora de Fin
                          </label>
                          <input
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                      </div>
                  </div>
              </div>

              {/* Notas */}
              <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Notas Adicionales
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Información adicional sobre la visita..."
                  />
              </div>

              {/* Botón de envío */}
              <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                      {loading ? 'Agendando...' : 'Agendar Visita'}
                  </button>
              </div>
          </form>
      </div>
    )
}

export default VisitForm
