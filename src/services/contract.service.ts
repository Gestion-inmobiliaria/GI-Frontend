import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { API_URL } from '@/config/constants'
import { contractTemplates } from '@/utils/contract-templates.utils'
import { 
    type CreateContractPayload, 
    type CreateContractWithSignaturePayload,
    type Contract, 
    type ContractFormData, 
    type ContractWithSignatureFormData,
    type Property, 
    ContractFormat, 
    ContractStatus,
    SignatureStatus 
} from '@/models/contract.model'

export class ContractService {
    private static readonly BASE_URL = `${API_URL}/api/contracts`

    /**
     * Crear contrato tradicional (sin firma)
     */
    static async saveContract(payload: CreateContractPayload): Promise<Contract> {
        console.log('Endpoint:', this.BASE_URL)
        console.log('Payload:', JSON.stringify(payload, null, 2))
      
        const response = await fetch(this.BASE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
      
        if (!response.ok) {
            throw new Error('Error al guardar el contrato')
        }
      
        return await response.json()
    }

    /**
     * NUEVO: Crear contrato con proceso de firma automático
     */
    static async saveContractWithSignature(payload: CreateContractWithSignaturePayload): Promise<{
        contract: Contract;
        signatureProcess: { message: string; tokens: { client: string; agent: string } };
    }> {
        console.log('Endpoint:', `${this.BASE_URL}/with-signature`)
        console.log('Payload with signature:', JSON.stringify(payload, null, 2))
      
        const response = await fetch(`${this.BASE_URL}/with-signature`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
      
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Error al crear contrato con firma')
        }
      
        return await response.json()
    }

    /**
     * Obtener todos los contratos con filtro opcional por estado de firma
     */
    static async getAllContracts(signatureStatus?: SignatureStatus): Promise<Contract[]> {
        let url = this.BASE_URL
        if (signatureStatus) {
            url += `?signatureStatus=${signatureStatus}`
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Error al obtener contratos')
        }

        return await response.json()
    }

    static generateHTMLContent(formData: ContractFormData, property: Property): string {
        const currentDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        const templateData = {
            ...formData,
            property,
            currentDate
        }

        return contractTemplates[formData.type](templateData)
    }

    static async htmlToPdfBase64(htmlContent: string): Promise<string> {
        const container = document.createElement('div')
        container.innerHTML = htmlContent
        document.body.appendChild(container)

        try {
            const canvas = await html2canvas(container)
            const pdf = new jsPDF('p', 'mm', 'a4')
            const imgData = canvas.toDataURL('image/png')
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            const pdfBase64 = pdf.output('datauristring')

            return pdfBase64
        } finally {
            document.body.removeChild(container)
        }
    }

    static htmlToBase64(htmlContent: string): string {
        return `data:text/html;base64,${btoa(htmlContent)}`
    }

    static previewContract(content: string, format: ContractFormat): void {
        const previewWindow = window.open('', '_blank')
        if (!previewWindow) {
            throw new Error('No se pudo abrir la ventana de vista previa')
        }

        if (format === ContractFormat.PDF) {
            previewWindow.document.write(`
                <iframe 
                    src="${content}" 
                    style="width: 100%; height: 100vh; border: none;"
                ></iframe>
            `)
        } else {
            previewWindow.document.write(content)
        }
    }

    static downloadContract(content: string, contractNumber: string, format: ContractFormat): void {
        const link = document.createElement('a')
        link.href = content
        link.download = `contrato_${contractNumber}.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    static async prepareCreatePayload(
        formData: ContractFormData,
        property: Property,
        format: ContractFormat
    ): Promise<CreateContractPayload> {
        const htmlContent = this.generateHTMLContent(formData, property)
        let contractContent: string

        if (format === ContractFormat.PDF) {
            contractContent = await this.htmlToPdfBase64(htmlContent)
        } else {
            contractContent = this.htmlToBase64(htmlContent)
        }

        return {
            contractNumber: parseInt(formData.contractNumber),
            type: formData.type,
            status: ContractStatus.VIGENTE,
            amount: parseFloat(formData.amount),
            startDate: formData.startDate,
            endDate: formData.endDate,
            clientName: formData.clientName,
            clientDocument: formData.clientDocument,
            clientPhone: formData.clientPhone,
            clientEmail: formData.clientEmail,
            agentName: formData.agentName,
            agentDocument: formData.agentDocument,
            contractContent,
            contractFormat: format,
            notes: formData.notes,
            propertyId: formData.propertyId,
            paymentMethodId: formData.paymentMethodId,
            requiresSignature: formData.requiresSignature || false,
            agentEmail: formData.agentEmail
        }
    }

    /**
     * NUEVO: Preparar payload para contrato con firma
     */
    static async prepareCreateWithSignaturePayload(
        formData: ContractWithSignatureFormData,
        property: Property,
        format: ContractFormat
    ): Promise<CreateContractWithSignaturePayload> {
        const basePayload = await this.prepareCreatePayload(formData, property, format)
        
        return {
            ...basePayload,
            requiresSignature: true,
            clientEmailForSignature: formData.clientEmailForSignature,
            agentEmailForSignature: formData.agentEmailForSignature
        }
    }
}