import { Visit } from '@/models/visit.model'
import { getStorage, STORAGE_TOKEN } from '@/utils'


// SOLUCIÓN: Variables de entorno para frontend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const ZAPIER_WEBHOOK_URL = import.meta.env.VITE_ZAPIER_WEBHOOK_URL

export class EmailService {

    // OPCIÓN 1: Envío a través de tu API backend (RECOMENDADO)
    static async sendVisitNotificationViaAPI(visit: Visit): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/email/send-visit-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getStorage(STORAGE_TOKEN)}`
                },
                body: JSON.stringify({
                    to: visit.clientEmail,
                    visitData: {
                        clientName: visit.clientName,
                        startDate: visit.startDate,
                        endDate: visit.endDate,
                        propertyAddress: visit.propertyAddress,
                        agentName: visit.agentName,
                        clientPhone: visit.clientPhone,
                        notes: visit.notes
                    }
                })
            })

            if (response.ok) {
                const result = await response.json()
                console.log('API Response:', result)
                return true
            } else {
                const error = await response.json()
                console.error('API Error:', error)
                return false
            }
        } catch (error) {
            console.error('Error enviando correo via API:', error)
            return false
        }
    }

    // OPCIÓN 2: EmailJS (Servicio de terceros)
    // static async sendVisitNotificationEmailJS(visit: Visit): Promise<boolean> {
    //     try {
    //         console.log('EmailJS no implementado aún, usando fallback...')
    //         return false
    //     } catch (error) {
    //         console.error('Error con EmailJS:', error)
    //         return false
    //     }
    // }

    // OPCIÓN 3: Mailto (Abre cliente de correo del usuario)
    static openMailtoForVisit(visit: Visit): void {
        const subject = encodeURIComponent(`Confirmación de Visita - ${visit.propertyAddress}`)
        const body = encodeURIComponent(`
Estimado/a ${visit.clientName},

Le confirmamos su visita programada con los siguientes detalles:

📅 Fecha: ${new Date(visit.startDate).toLocaleDateString('es-ES')}
🕐 Hora: ${new Date(visit.startDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
🏠 Propiedad: ${visit.propertyAddress}
👤 Agente responsable: ${visit.agentName}
📞 Teléfono de contacto: ${visit.clientPhone}

${visit.notes ? `Notas adicionales: ${visit.notes}` : ''}

Por favor, confirme su asistencia respondiendo a este correo.

Saludos cordiales,
Equipo de Ventas
        `.trim())

        const mailtoUrl = `mailto:${visit.clientEmail}?subject=${subject}&body=${body}`
        window.open(mailtoUrl)
    }

    // OPCIÓN 4: Webhook a Zapier/Make
    static async sendViaWebhook(visit: Visit): Promise<boolean> {
        try {
            if (!ZAPIER_WEBHOOK_URL) {
                console.warn('Webhook URL no configurada')
                return false
            }

            const response = await fetch(ZAPIER_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'visit_notification',
                    data: {
                        clientEmail: visit.clientEmail,
                        clientName: visit.clientName,
                        visitDate: visit.startDate,
                        propertyAddress: visit.propertyAddress,
                        agentName: visit.agentName,
                        notes: visit.notes
                    }
                })
            })

            return response.ok
        } catch (error) {
            console.error('Error enviando via webhook:', error)
            return false
        }
    }

    // Método principal simplificado
    static async sendVisitNotification(visit: Visit): Promise<boolean> {
        if (!visit.clientEmail) {
            console.warn('No se puede enviar correo: email del cliente no disponible')
            return false
        }

        console.log('Intentando enviar correo para visita:', visit.clientName)

        try {
            // 1. Intentar con API backend primero
            console.log('Intentando envío via API backend...')
            const apiResult = await this.sendVisitNotificationViaAPI(visit)
            if (apiResult) {
                console.log('✅ Correo enviado via API backend')
                return true
            }

            // 2. Si falla la API, intentar webhook (si está configurado)
            if (ZAPIER_WEBHOOK_URL) {
                console.log('Intentando envío via webhook...')
                const webhookResult = await this.sendViaWebhook(visit)
                if (webhookResult) {
                    console.log('✅ Correo enviado via webhook')
                    return true
                }
            }

            // 3. Como último recurso, abrir mailto
            console.log('Usando fallback: abriendo cliente de correo...')
            this.openMailtoForVisit(visit)
            console.log('✅ Cliente de correo abierto')
            return true

        } catch (error) {
            console.error('❌ Error en envío de correo:', error)

            // En caso de error, usar mailto como fallback
            console.log('Usando fallback por error...')
            this.openMailtoForVisit(visit)
            return true
        }
    }
}

// Plantilla HTML para el correo (sin cambios)
export const getVisitEmailTemplate = (visit: Visit): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; }
        .footer { background: #333; color: white; padding: 15px; border-radius: 0 0 10px 10px; }
        .highlight { background: #e3f2fd; padding: 10px; border-left: 4px solid #2196f3; margin: 15px 0; }
        .button { display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 Confirmación de Visita</h1>
        </div>
        <div class="content">
          <p>Estimado/a <strong>${visit.clientName}</strong>,</p>
          
          <p>Le confirmamos su visita programada con los siguientes detalles:</p>
          
          <div class="highlight">
            <p><strong>📅 Fecha:</strong> ${new Date(visit.startDate).toLocaleDateString('es-ES')}</p>
            <p><strong>🕐 Hora:</strong> ${new Date(visit.startDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>🏠 Propiedad:</strong> ${visit.propertyAddress}</p>
            <p><strong>👤 Agente responsable:</strong> ${visit.agentName}</p>
            <p><strong>📞 Su teléfono de contacto:</strong> ${visit.clientPhone}</p>
          </div>
          
          ${visit.notes ? `<p><strong>Notas adicionales:</strong> ${visit.notes}</p>` : ''}
          
          <p>Por favor, confirme su asistencia respondiendo a este correo o contactando directamente a su agente.</p>
          
          <p>¡Esperamos verle pronto!</p>
        </div>
        <div class="footer">
          <p>Equipo de Ventas<br>
          <small>Este es un correo automático, no responda a esta dirección.</small></p>
        </div>
      </div>
    </body>
    </html>
  `
}
